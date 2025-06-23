import fs from 'node:fs/promises'
import path from 'node:path'

import { logger } from '@utils'

/**
 * Удаляет файлы, указанные в списке, и логирует процесс
 */
export const deleteFile = async (filePath: string) => {
  try {
    await Bun.file(filePath).delete()
  } catch (error) {
    logger.warn(error, `Не удалось удалить файл ${filePath}:`)
  }
}

/**
 * Рекурсивно собирает все файлы в директории
 */
export async function getAllFiles(dir: string): Promise<string[]> {
  const dirents = await fs.readdir(dir, { withFileTypes: true })

  const files = await Promise.all(
    dirents.map(async (dirent) => {
      const res = path.resolve(dir, dirent.name)
      return dirent.isDirectory() ? await getAllFiles(res) : res
    })
  )

  return Array.prototype.concat(...files)
}
