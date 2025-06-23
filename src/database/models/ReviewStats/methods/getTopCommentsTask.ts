import {
  type ReviewStatRepository,
  type Tx,
  UserRepository,
  mrReviews,
  reviewStats,
  tasks
} from '@database'

import { desc, eq, sum } from 'drizzle-orm'

export async function getTopCommentsTask(
  this: ReviewStatRepository,
  userId: number,
  tx?: Tx
) {
  const db = tx ?? this.db

  // 0) Переводим внутренний userId → gitlabId
  const gitlabId = await new UserRepository(this.db).getGitlabIdById(userId, tx)
  if (gitlabId == null) {
    throw new Error(`User ${userId} not found`)
  }

  const [topCommentTaskRow] = await db
    .select({
      taskId: mrReviews.taskId,
      taskUrl: tasks.taskUrl,
      cnt: sum(reviewStats.commentsCount)
    })
    .from(reviewStats)
    .innerJoin(mrReviews, eq(mrReviews.id, reviewStats.mrReviewId))
    .innerJoin(tasks, eq(tasks.id, mrReviews.taskId))
    .where(eq(reviewStats.userId, gitlabId))
    .groupBy(mrReviews.taskId, tasks.taskUrl)
    .orderBy(
      // Сортировка по сумме комментариев
      desc(sum(reviewStats.commentsCount))
    )
    .limit(1)

  return topCommentTaskRow
}
