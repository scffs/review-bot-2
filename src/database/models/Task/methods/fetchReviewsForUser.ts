import { and, eq, isNotNull, or } from 'drizzle-orm'

import {
  type TaskRepository,
  type Tx,
  type UserId,
  mrComments,
  mrReviewers,
  mrReviews,
  tasks
} from '@database'

export async function fetchReviewsForUser(
  this: TaskRepository,
  userId: UserId,
  tx?: Tx
) {
  const executor = tx ?? this.db

  const results = await executor
    .select({
      id: tasks.id,
      title: tasks.title,
      taskUrl: tasks.taskUrl,
      mrUrl: tasks.mrUrl,
      commentId: mrComments.commentId,
      commentLink: mrComments.commentLink,
      needsReview: eq(mrReviewers.isApproved, false)
    })
    .from(tasks)
    .leftJoin(mrReviews, eq(mrReviews.taskId, tasks.id))
    .leftJoin(
      mrComments,
      and(
        eq(mrComments.mrReviewId, mrReviews.id),
        eq(mrComments.assignedUserId, userId)
      )
    )
    .leftJoin(
      mrReviewers,
      and(
        eq(mrReviewers.mrReviewId, mrReviews.id),
        eq(mrReviewers.userId, userId)
      )
    )
    .where(
      and(
        eq(tasks.isCompleted, false),
        or(
          and(
            eq(mrComments.assignedUserId, userId),
            isNotNull(mrComments.commentId)
          ),
          and(
            eq(mrReviewers.userId, userId),
            eq(mrReviewers.isApproved, false),
            isNotNull(mrReviewers.id)
          )
        )
      )
    )
    .orderBy(tasks.id)

  const taskMap: Record<
    number,
    {
      id: number
      title: string
      taskUrl: string | null
      mrUrl: string
      needsReview: boolean
      commentsToRespond: { id: number; link: string }[]
    }
  > = {}

  for (const row of results) {
    if (!taskMap[row.id]) {
      taskMap[row.id] = {
        id: row.id,
        title: row.title,
        taskUrl: row.taskUrl,
        mrUrl: row.mrUrl || '',
        needsReview: !!row.needsReview,
        commentsToRespond: []
      }
    }

    if (row.commentId && row.commentLink) {
      taskMap[row.id].commentsToRespond.push({
        id: row.commentId,
        link: row.commentLink
      })
    }
  }

  return Object.values(taskMap)
}
