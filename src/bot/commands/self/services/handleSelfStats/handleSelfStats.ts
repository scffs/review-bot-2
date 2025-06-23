import { di } from '@di'

import type { TaskWithRelations } from '@database'

export interface SelfStats {
  completed: TaskWithRelations[]
  inTesting: TaskWithRelations[]
  // inProgress: TaskWithRelations[]
  // для детального просмотра
  tasksPage: TaskWithRelations[]
  totalCount: number
  hasNextPage: boolean
}

export async function handleSelfStats(
  userId: number,
  page = 1,
  limit = 5
): Promise<SelfStats> {
  // 1) Считаем смещение
  const offset = (page - 1) * limit

  // 2) Берём полную выборку для сводки
  const allTasks = await di.task.fetchByUserId(userId)
  const completed = allTasks.filter((t) => t.isCompleted)
  const inTesting = allTasks.filter((t) => !t.isCompleted)

  // 3) Берём «страницу» задач с запасной записью для hasNextPage
  const rows = await di.task.fetchByUserId(userId, offset, limit + 1)

  const hasNextPage = rows.length > limit
  const tasksPage = hasNextPage ? rows.slice(0, limit) : rows

  return {
    completed,
    inTesting,
    tasksPage,
    totalCount: allTasks.length,
    hasNextPage
  }
}
