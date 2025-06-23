import type { Tag, TagType, TagValueType } from '@database'

import { di } from '@di'

/**
 * Конвертирует теги из формата Weeek в формат базы данных
 *
 * Обработка:
 * 1. Принимает массив тегов в разных форматах
 * 2. Для объектов с id использует их напрямую
 * 3. Для строковых тегов ищет соответствие в БД
 *
 * @param {Array<Tag>} tags - Массив тегов для конвертации
 * @returns {Promise<Tag[]>} Массив тегов в формате БД
 */
export async function formatTagsToDb(tags: Array<TagType>): Promise<Tag[]> {
  const dbTags: Tag[] = []

  for (const tag of tags) {
    if (tag == null) {
      continue
    }

    if (typeof tag === 'object' && 'id' in tag) {
      dbTags.push(tag)
      continue
    }

    const tagType = tag as TagValueType
    const dbTag = await di.tag.getByType(tagType)

    if (dbTag) {
      dbTags.push(dbTag)
    }
  }

  return dbTags
}
