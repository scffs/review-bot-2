import type { TeamMember, UserWithVacancies } from '@database'

import { di } from '@di'

import type { MrField } from 'clients/weeek'

/**
 * Извлекает и обрабатывает данные MR-ревью по идентификатору задачи.
 */
export async function getMergeRequestData(taskId: number) {
  const mrReview = await di.mrReview.getWithRelatedData(taskId)

  if (!mrReview) {
    return null
  }

  // Формируем список действий, требующих внимания, на основе комментариев
  const actionsNeeded: MrField['comments']['actionsNeeded'] = []
  const commentsByUser = new Map<
    string,
    { user: UserWithVacancies; comments: { id: number; link: string }[] }
  >()

  for (const comment of mrReview.comments) {
    if (!comment.assignedUser?.id) {
      continue
    }

    const userKey = String(comment.assignedUser.gitlabId)

    if (!commentsByUser.has(userKey)) {
      commentsByUser.set(userKey, {
        user: {
          ...comment.assignedUser,
          vacancy: comment.assignedUser.vacancy.map((uv) => uv.vacancy)
        },
        comments: []
      })
    }

    commentsByUser.get(userKey)?.comments.push({
      id: comment.commentId,
      link: comment.commentLink
    })
  }

  for (const [_, { user, comments }] of commentsByUser.entries()) {
    const userVacancies = user.vacancy || []

    actionsNeeded.push({
      assigned: {
        gitlabId: user.gitlabId,
        name: user.name,
        weeekId: user.weeekId,
        telegramLink: `https://t.me/${user.telegramUsername}`,
        vacancy: userVacancies
      },
      comments
    })
  }

  // Формируем список пользователей, оставивших комментарии
  const peopleCommented = mrReview.commentedUsers
    .filter((entry) => entry.user?.id)
    .map((entry) => {
      const user = entry.user
      const vacancies = user.vacancy?.map((uv) => uv.vacancy) || []

      return {
        gitlabId: user.gitlabId,
        name: user.name,
        weeekId: user.weeekId,
        telegramLink: `https://t.me/${user.telegramUsername}`,
        vacancy: vacancies
      }
    })

  // Формируем список ревьюеров, от которых требуется обратная связь
  const reviewNeeded: Array<TeamMember> = mrReview.reviewers
    .filter((entry) => entry.user?.id)
    .map((entry) => {
      const user = entry.user
      const vacancies = user.vacancy?.map((uv) => uv.vacancy) || []

      return {
        gitlabId: user.gitlabId,
        name: user.name,
        weeekId: user.weeekId,
        telegramLink: `https://t.me/${user.telegramUsername}`,
        vacancy: vacancies
      }
    })

  // Формируем список неразрешенных ревьюеров с ссылками на их профили
  const unresolved = mrReview.reviewers
    .filter((reviewer) => reviewer.user?.id)
    .map((reviewer) => {
      const user = reviewer.user
      const vacancies = user.vacancy?.map((uv) => uv.vacancy) || []

      return {
        gitlabId: user.gitlabId,
        name: user.name,
        weeekId: user.weeekId,
        telegramLink: `https://t.me/${user.telegramUsername}`,
        vacancy: vacancies
      }
    })

  // Возвращаем итоговый объект с полной структурой данных
  return {
    ...mrReview,
    comments: {
      total: mrReview.totalComments,
      unresolved: mrReview.unresolvedComments,
      actionsNeeded,
      peopleCommented
    },
    reviewers: {
      total: mrReview.totalReviewers,
      unresolved,
      reviewNeeded
    }
  }
}
