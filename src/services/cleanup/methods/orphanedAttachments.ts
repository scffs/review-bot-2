import path from 'node:path'

import { di } from '@di'

import { MEDIA_DIR } from '@config'
import { logger } from '@utils'

import type { Cleanup } from '../cleanup.ts'
import { deleteFile } from '../utils.ts'

/**
 * Очищает ""брошенные"" в БД вложения: удаляет записи и файлы
 */
export async function orphanedAttachments(this: Cleanup): Promise<void> {
  const orphaned = await di.attachment.findOrphaned()

  for (const { id, localPath } of orphaned) {
    const filePath = path.join(MEDIA_DIR, localPath)
    await deleteFile(filePath)
    try {
      await di.attachment.deleteById(id)
      logger.info(`Запись вложения ${id} удалена из БД`)
    } catch (error) {
      logger.error(error, `Ошибка при удалении записи ${id}:`)
    }
  }
}
