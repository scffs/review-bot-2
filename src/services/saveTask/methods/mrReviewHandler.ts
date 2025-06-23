import type { Tx } from '@database'
import { di } from '@di'

import type { MrField } from 'clients/weeek'

/**
 * Сохраняет данные ревью merge request в базу данных
 *
 * Сохраняемые данные включают:
 * - Отставание ветки (branchBehindBy)
 * - Наличие конфликтов (hasConflicts)
 * - Комментарии (comments)
 * - Ревьюеры (reviewers)
 *
 * @param {number} taskId - Идентификатор задачи
 * @param mrId
 * @param mr
 * @param tx
 * @returns {Promise<void>}
 */
export async function mrReviewHandler(
  taskId: number,
  mrId: number,
  mr: MrField,
  tx?: Tx
): Promise<void> {
  const stats = await di.gitlab.getMrSummaryStats(mrId)

  const durationSeconds =
    stats.duration.days * 86_400 +
    stats.duration.hours * 3_600 +
    stats.duration.minutes * 60 +
    stats.duration.seconds

  // 1) Формируем полный объект для insert/update
  const mrReviewData = {
    taskId,
    branchBehindBy: mr.branchBehindBy,
    hasConflicts: mr.hasConflicts,
    totalComments: mr.comments.total,
    unresolvedComments: mr.comments.unresolved,
    totalReviewers: mr.reviewers.total,
    changedFilesCount: stats.changedFilesCount,
    additions: stats.additions,
    deletions: stats.deletions,
    durationSeconds
  }

  let mrReviewId: number
  const existingMrReview = await di.mrReview.getByTaskId(taskId, tx)

  if (existingMrReview) {
    await di.mrReview.update(existingMrReview.id, mrReviewData, tx)
    mrReviewId = existingMrReview.id

    // Удаляем старые связанные данные перед добавлением новых
    await di.mrComment.deleteByMrReviewId(mrReviewId, tx)
    await di.mrCommentedUser.deleteByMrReviewId(mrReviewId, tx)
    await di.mrReviewer.deleteByMrReviewId(mrReviewId, tx)
    await di.reviewStat.deleteByMrReviewId(mrReviewId, tx)
  } else {
    const newMrReview = await di.mrReview.create(mrReviewData, tx)
    mrReviewId = newMrReview.id
  }

  // 3) Сохраняем comments.actionsNeeded → mr_comments
  for (const action of mr.comments.actionsNeeded) {
    const user = await di.user.getByGitlabId(action.assigned.gitlabId, tx)
    if (!user) continue

    for (const comment of action.comments) {
      await di.mrComment.create(
        {
          mrReviewId,
          commentId: comment.id,
          commentLink: comment.link,
          assignedUserId: user.id
        },
        tx
      )
    }
  }

  // 4) Сохраняем peopleCommented → mr_commented_users
  for (const commenter of mr.comments.peopleCommented) {
    const user = await di.user.getByGitlabId(commenter.gitlabId, tx)
    if (!user) continue
    await di.mrCommentedUser.create({ mrReviewId, userId: user.id }, tx)
  }

  // 5) Сохраняем reviewers.reviewNeeded + reviewers.unresolved → mr_reviewers
  for (const rev of [
    ...mr.reviewers.reviewNeeded,
    ...mr.reviewers.unresolved
  ]) {
    const user = await di.user.getByGitlabId(rev.gitlabId, tx)
    if (!user) continue
    // защитимся от дубликатов
    const exists = await di.mrReviewer.findByMrReviewIdAndUserId(
      mrReviewId,
      user.id,
      tx
    )
    if (exists) continue

    await di.mrReviewer.create(
      { mrReviewId, userId: user.id, isApproved: false },
      tx
    )
  }

  // 6) Считаем per‑user количество комментариев и пишем в review_stats
  //    (раз-два: удалили выше, теперь просто создаём новые)
  const counts: Record<number, number> = {}
  for (const c of mr.comments.peopleCommented) {
    const user = await di.user.getByGitlabId(c.gitlabId, tx)

    if (!user) {
      continue
    }

    counts[user.id] = (counts[user.id] ?? 0) + 1
  }

  for (const [userIdStr, commentsCount] of Object.entries(counts)) {
    const userId = Number(userIdStr)

    const user = await di.user.getByGitlabId(userId, tx)

    if (!user) {
      continue
    }

    await di.reviewStat.create({ mrReviewId, userId, commentsCount }, tx)
  }
}
