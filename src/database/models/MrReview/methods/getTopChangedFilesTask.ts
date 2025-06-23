import { and, desc, eq, sum } from 'drizzle-orm'

import {
  type MrReviewRepository,
  type Tx,
  UserRepository,
  assignees,
  mrReviews,
  tasks
} from '@database'

export interface TopChangedFiles {
  taskId: number
  taskUrl: string | null
  totalChangedFiles: number
}

export async function getTopChangedFilesTask(
  this: MrReviewRepository,
  userId: number,
  tx?: Tx
): Promise<TopChangedFiles | undefined> {
  const db = tx ?? this.db

  // 1) Получаем gitlabId по userId
  const gitlabId = await new UserRepository(this.db).getGitlabIdById(userId, tx)

  if (gitlabId == null) {
    return
  }

  // 2) Запрос с учётом пользователя и суммированием changedFilesCount
  const [row] = await db
    .select({
      taskId: tasks.id,
      taskUrl: tasks.taskUrl,
      totalChangedFiles: sum(mrReviews.changedFilesCount)
    })
    .from(assignees)
    .innerJoin(tasks, eq(tasks.id, assignees.taskId))
    .innerJoin(
      mrReviews,
      and(eq(mrReviews.taskId, tasks.id), eq(assignees.userId, userId))
    )
    .where(eq(assignees.userId, userId))
    .groupBy(tasks.id, tasks.taskUrl)
    .orderBy(desc(sum(mrReviews.changedFilesCount)))
    .limit(1)

  if (!row) {
    return
  }

  return {
    taskId: row.taskId,
    taskUrl: row.taskUrl,
    totalChangedFiles: Number(row.totalChangedFiles)
  }
}
