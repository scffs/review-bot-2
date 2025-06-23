import { eq, max, sum } from 'drizzle-orm'

import {
  type MrReviewRepository,
  type Tx,
  assignees,
  mrReviews,
  tasks
} from '@database'

export async function getStatsForAllTime(
  this: MrReviewRepository,
  userId: number,
  tx?: Tx
) {
  const db = tx ?? this.db

  const [row] = await db
    .select({
      totalAdditions: sum(mrReviews.additions).as('totalAdditions'),
      totalDeletions: sum(mrReviews.deletions).as('totalDeletions'),
      totalFilesChanged: sum(mrReviews.changedFilesCount).as(
        'totalFilesChanged'
      ),
      longestTaskDurationSeconds: max(mrReviews.durationSeconds).as(
        'longestTaskDurationSeconds'
      )
    })
    .from(assignees)
    .innerJoin(tasks, eq(tasks.id, assignees.taskId))
    .innerJoin(mrReviews, eq(mrReviews.taskId, tasks.id))
    .where(eq(assignees.userId, userId))

  return {
    totalAdditions: Number(row?.totalAdditions ?? 0),
    totalDeletions: Number(row?.totalDeletions ?? 0),
    totalFilesChanged: Number(row?.totalFilesChanged ?? 0),
    longestTaskDurationSeconds: Number(row?.longestTaskDurationSeconds ?? 0)
  }
}
