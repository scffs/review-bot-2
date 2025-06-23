import type { TagType, Tx } from '@database'
import { di } from '@di'
import { deepEqual } from '@utils'

import { formatTagsToDb } from './convertTags.ts'

/**
 * Сохраняет теги задачи в базу данных
 *
 * Процесс:
 * 1. Конвертирует теги в формат БД
 * 2. Сравнивает с существующими тегами
 * 3. При изменениях удаляет старые теги и создает новые
 *
 * @param {number} taskId - Идентификатор задачи
 * @param tags
 * @param tx
 * @returns {Promise<void>}
 */
export async function tagHandler(
  taskId: number,
  tags: TagType[],
  tx?: Tx
): Promise<void> {
  // const tags = fields.tags
  const dbTags = await formatTagsToDb(tags)
  const existingTags = await di.taskTag.getByTaskId(taskId, tx)

  if (
    !deepEqual(
      existingTags?.map((t) => t.tagId),
      dbTags.map((t) => t.id)
    )
  ) {
    await di.taskTag.deleteByTaskId(taskId, tx)

    for (const tag of dbTags) {
      await di.taskTag.create(
        {
          taskId,
          tagId: tag.id
        },
        tx
      )
    }
  }
}
