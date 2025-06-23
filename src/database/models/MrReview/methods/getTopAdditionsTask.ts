import { and, desc, eq } from 'drizzle-orm'

import {
  type MrReviewRepository,
  type Tx,
  UserRepository,
  assignees,
  mrReviews,
  tasks
} from '@database'

export interface TopAdditionsRow {
  taskId: number
  taskUrl: string | null
  totalAdditions: number
}

export async function getTopAdditionsTask(
  this: MrReviewRepository,
  userId: number,
  tx?: Tx
): Promise<TopAdditionsRow | undefined> {
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
      totalAdditions: mrReviews.additions
    })
    .from(assignees)
    .innerJoin(tasks, eq(tasks.id, assignees.taskId))
    .innerJoin(
      mrReviews,
      and(eq(mrReviews.taskId, tasks.id), eq(assignees.userId, userId))
    )
    .where(eq(assignees.userId, userId))
    .orderBy(desc(mrReviews.additions))
    .limit(1)

  if (!row) {
    return
  }

  return {
    taskId: row.taskId,
    taskUrl: row.taskUrl,
    totalAdditions: Number(row.totalAdditions)
  }
}
