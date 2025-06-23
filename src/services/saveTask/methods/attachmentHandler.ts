import { deepEqual } from '@utils'

import type { Tx } from '@database'
import { di } from '@di'

import type { ReviewFields } from 'clients/weeek'

/**
 * Сохраняет вложения задачи в базу данных
 *
 * Функционал:
 * 1. Объединяет изображения и видео в общий список
 * 2. Сравнивает с существующими вложениями
 * 3. При изменениях:
 *    - Удаляет старые вложения
 *    - Создает новые записи с правильным типом медиа
 *
 * @param {number} taskId - Идентификатор задачи
 * @param {ReviewFields} fields - Поля с данными о вложениях
 * @param messageMediaPaths - Массив локальных файлов
 * @param tx
 *
 * @returns {Promise<void>}
 */
export async function attachmentHandler(
  taskId: number,
  { images, videos }: { images: string[]; videos: string[] },
  messageMediaPaths: string[],
  tx?: Tx
): Promise<void> {
  const allMedia = [...images, ...videos]

  const existingAttachments = await di.attachment.getByTaskId(taskId, tx)

  if (
    !deepEqual(
      existingAttachments?.map((a) => a.originalUrl),
      allMedia
    )
  ) {
    await di.attachment.deleteByTaskId(taskId, tx)

    // Map media URLs to their corresponding local paths
    for (let i = 0; i < allMedia.length; i++) {
      const mediaUrl = allMedia[i]
      await di.attachment.create(
        {
          taskId,
          originalUrl: mediaUrl,
          type: images.includes(mediaUrl) ? 'image' : 'video',
          localPath: messageMediaPaths[i]
        },
        tx
      )
    }
  }
}
