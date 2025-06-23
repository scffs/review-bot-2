import { and, desc, eq } from 'drizzle-orm'

import {
  type MrReviewRepository,
  type Tx,
  UserRepository,
  assignees,
  mrReviews,
  tasks
} from '@database'

export interface TopDeletionsRow {
  taskId: number
  taskUrl: string | null
  totalDeletions: number
}

export async function getTopDeletionsTask(
  this: MrReviewRepository,
  userId: number,
  tx?: Tx
): Promise<TopDeletionsRow | undefined> {
  const db = tx ?? this.db

  // 1) Переводим внутренний userId → gitlabId
  const gitlabId = await new UserRepository(this.db).getGitlabIdById(userId, tx)

  if (gitlabId == null) {
    return
  }

  const [row] = await db
    .select({
      taskId: tasks.id,
      taskUrl: tasks.taskUrl,
      totalDeletions: mrReviews.deletions
    })
    .from(assignees)
    .innerJoin(tasks, eq(tasks.id, assignees.taskId))
    .innerJoin(
      mrReviews,
      and(eq(mrReviews.taskId, tasks.id), eq(assignees.userId, userId))
    )
    .where(eq(assignees.userId, userId))
    .orderBy(desc(mrReviews.deletions))
    .limit(1)

  if (!row) {
    return
  }

  return {
    taskId: row.taskId,
    taskUrl: row.taskUrl,
    totalDeletions: Number(row.totalDeletions)
  }
}
