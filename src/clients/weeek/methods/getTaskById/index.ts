import { CONFIG } from '@config'

import type { Weeek } from '../../weeek.ts'

import type { GetTaskResponse } from '../type.ts'

/**
 * Получение задачи по её ID из Weeek API.
 * Метод делает запрос к API для получения детальной информации о конкретной задаче.
 *
 * @param id - ID задачи в Weeek
 * @returns Promise, разрешающийся в объект задачи или undefined в случае ошибки
 */
export async function getTaskById(this: Weeek, id: number) {
  const response = await this.get<GetTaskResponse>(`/tm/tasks/${id}`, {
    projectId: CONFIG.weeek.projectId // ID проекта из конфигурации
  })

  if (!response.success) {
    return
  }

  return response.task
}
