import path from 'node:path'

import type { InputMediaLike } from '@mtcute/bun'
import { InputMedia } from '@mtcute/core'

import { readToBuffer } from '@utils'

/**
 * Создает медиа-объекты для отправки в Telegram
 *
 * Функционал:
 * 1. Читает файлы из указанных путей
 * 2. Определяет тип медиа по расширению файла
 * 3. Создает соответствующие InputMedia объекты
 *
 * @param {string[]} messageMediaPaths - Пути к медиа-файлам
 * @returns {Promise<InputMediaLike[]>} Массив объектов для отправки
 */
export async function createMessageMedia(
  messageMediaPaths: string[]
): Promise<InputMediaLike[]> {
  return Promise.all(
    messageMediaPaths.map(async (filePath) => {
      const uint8Array = await readToBuffer(filePath)
      const ext = path.extname(filePath).toLowerCase()
      return ext === '.mp4'
        ? InputMedia.video(uint8Array)
        : InputMedia.photo(uint8Array)
    })
  )
}
