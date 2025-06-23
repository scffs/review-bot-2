import { CONFIG } from '@config'

import type { Weeek } from '../../weeek.ts'

import type { GetTasksResponse, Task } from '../type.ts'

/**
 * Получить одну “страницу” задач.
 */
export async function getCompletedTasks(
  this: Weeek,
  offset = 0,
  perPage = 20
): Promise<{
  tasks: Task[]
  hasMore: boolean
}> {
  const response = await this.get<GetTasksResponse>('/tm/tasks', {
    boardColumnId: CONFIG.weeek.completedColumnId,
    boardId: CONFIG.weeek.boardId,
    projectId: CONFIG.weeek.projectId,
    offset,
    perPage
  })

  if (!response.success) {
    throw new Error('Не удалось получить задачи от Weeek API')
  }

  return {
    tasks: response.tasks ?? [],
    hasMore: !!response.hasMore
  }
}
