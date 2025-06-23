import { deepEqual } from '@utils'

import { di } from '@di'

import type { ReviewFields } from 'clients/weeek'

/**
 * Сравнивает медиа-поля с существующими вложениями в базе данных
 *
 * Процесс сравнения:
 * 1. Получает существующие вложения из БД
 * 2. Объединяет новые изображения и видео в один массив
 * 3. Сравнивает URL-адреса существующих и новых медиа
 *
 * @param {number} taskId - Идентификатор задачи для сравнения медиа
 * @param {ReviewFields} fields - Поля с информацией о медиа
 * @returns {Promise<boolean>} true если медиа идентичны, false если есть различия
 */
export async function compareMediaFields(
  taskId: number,
  fields: ReviewFields
): Promise<boolean> {
  // Получаем существующие вложения
  const existingAttachments = await di.attachment.getByTaskId(taskId)

  // Объединяем новые медиа в один массив
  const images = fields.images || []
  const videos = fields.videos || []
  const allMediaUrls = [...images, ...videos]

  if (!existingAttachments) {
    return false
  }

  // Сравниваем URL-адреса
  const existingUrls = existingAttachments.map((a) => a.originalUrl)
  return deepEqual(existingUrls, allMediaUrls)
}
