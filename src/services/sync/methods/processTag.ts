import { di } from '@di'
import { logger } from '@utils'

import type { Sync } from '../sync.ts'
import { TAG_MAPPING } from '../types.ts'

/**
 * Обрабатывает один тег из Weeek.
 * Проверяет его наличие в маппинге и в базе данных,
 * затем создает новый или обновляет существующий тег.
 *
 * @param weeekTag - Тег из Weeek API
 * @returns {Promise<void>} Promise, который разрешается после обработки тега
 */
export async function processTag(
  this: Sync,
  weeekTag: {
    title: string
    id: number
  }
): Promise<void> {
  // Получение соответствующего тега из маппинга
  const enumTag = TAG_MAPPING[weeekTag.title]

  // Пропускаем теги, которых нет в маппинге
  if (!enumTag) {
    logger.warn(
      { tagTitle: weeekTag.title },
      'Тег из Weeek API не соответствует ни одному значению в enum'
    )
    return
  }

  // Проверка существования тега в базе данных
  const existingTag = await di.tag.getByType(enumTag)

  // Оповещаем о новом теге
  if (!existingTag) {
    logger.info(
      { tagTitle: weeekTag.title, weeekId: weeekTag.id },
      'Создан новый тег в базе данных'
    )
    return
  }

  if (existingTag.weeekId === weeekTag.id) {
    return
  }

  await di.tag.update(existingTag.id, { weeekId: weeekTag.id })

  logger.info(
    { tagTitle: weeekTag.title, weeekId: weeekTag.id },
    'Обновлен weeekId для существующего тега'
  )
}
