import { CONFIG } from '@config'

import type { Weeek } from '../../weeek.ts'

import type { GetTasksResponse, Task } from '../type.ts'

/**
 * Получение списка задач из Weeek API.
 * Метод делает запрос к API для получения задач из указанной доски и колонки.
 *
 * @returns Promise, разрешающийся в массив задач или пустой массив в случае ошибки
 */
export async function getTasksInReview(
  this: Weeek,
  offset = 0,
  perPage = 20
): Promise<{
  tasks: Task[]
  hasMore: boolean
}> {
  const response = await this.get<GetTasksResponse>('/tm/tasks', {
    boardColumnId: CONFIG.weeek.reviewColumnId,
    boardId: CONFIG.weeek.boardId,
    projectId: CONFIG.weeek.projectId,
    offset,
    perPage
  })

  if (!response.success) {
    throw new Error('Не удалось получить задачи на ревью из Weeek API')
  }

  return {
    tasks: response.tasks ?? [],
    hasMore: !!response.hasMore
  }
}
