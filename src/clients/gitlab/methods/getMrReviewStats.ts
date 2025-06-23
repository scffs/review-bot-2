import type { GitLabService } from '../gitlabService.ts'

import { CONFIG } from '@config'

interface MrReviewStat {
  userId: number
  commentsCount: number
}

export async function getMrReviewStats(
  this: GitLabService,
  mergeRequestId: number
): Promise<MrReviewStat[]> {
  const projectId = CONFIG.gitlab.projectId

  // Получаем информацию о MR, чтобы узнать автора
  const mr = await this.api.MergeRequests.show(projectId, mergeRequestId)
  const authorId = mr.author?.id

  const discussions = await this.api.MergeRequestDiscussions.all(
    projectId,
    mergeRequestId
  )

  const commentCountByUser = new Map<number, number>()

  for (const discussion of discussions) {
    for (const note of discussion.notes ?? []) {
      if (
        note.type === 'DiffNote' &&
        note.author &&
        !note.system &&
        // исключаем автора MR
        note.author.id !== authorId
      ) {
        const userId = note.author.id
        const prev = commentCountByUser.get(userId) ?? 0
        commentCountByUser.set(userId, prev + 1)
      }
    }
  }

  return Array.from(commentCountByUser.entries()).map(
    ([userId, commentsCount]) => ({
      userId,
      commentsCount
    })
  )
}
