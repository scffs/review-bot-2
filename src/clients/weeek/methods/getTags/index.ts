import type { Weeek } from '../../weeek.ts'

import type { GetTagsResponse } from './type.ts'

/**
 * Получение списка тегов из Weeek API.
 * Метод делает запрос к API для получения всех доступных тегов проекта.
 *
 * @returns Promise, разрешающийся в массив тегов или пустой массив в случае ошибки
 */
export async function getTags(this: Weeek) {
  const response = await this.get<GetTagsResponse>('/ws/tags')

  if (response.success) {
    return response.tags || []
  }

  return []
}
