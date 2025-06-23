import path from 'node:path'

import { di } from '@di'

import { MEDIA_DIR } from '@config'
import { logger } from '@utils'

import type { Cleanup } from '../cleanup.ts'
import { deleteFile, getAllFiles } from '../utils.ts'

/**
 * Анализирует папку MEDIA_DIR и удаляет файлы, не содержащиеся в БД
 */
export async function unreferencedOnDisk(this: Cleanup): Promise<void> {
  // 1. Собираем все реальные файлы
  const allFiles = await getAllFiles(MEDIA_DIR)

  // 2. Берём пути из БД и приводим их к абсолютным
  const rawPaths = await di.attachment.getAllLocalPaths()

  const referencedAbs = rawPaths.map((lp) => {
    // если lp уже абсолютный, оставляем; иначе присоединяем к MEDIA_DIR
    return path.isAbsolute(lp) ? path.normalize(lp) : path.join(MEDIA_DIR, lp)
  })

  const referencedSet = new Set(referencedAbs)

  // 3. Удаляем всё, чего нет в referencedSet
  for (const fullPath of allFiles) {
    if (!referencedSet.has(fullPath)) {
      await deleteFile(fullPath)
      logger.info(`Файл ${fullPath} не найден в БД и был удален`)
    }
  }
}
