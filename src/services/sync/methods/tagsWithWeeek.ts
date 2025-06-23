import { logger } from '@utils'

import type { Sync } from '../sync.ts'

/**
 * Синхронизирует теги между Weeek и базой данных.
 *
 * Процесс:
 * 1. Получает все теги из Weeek API
 * 2. Для каждого тега параллельно:
 *    - Проверяет соответствие в маппинге
 *    - Проверяет существование тега в БД
 *    - Создает новый или обновляет существующий тег
 *
 * Особенности:
 * - Использует Promise.all для параллельной обработки тегов
 * - Логирует все важные операции
 * - Пропускает теги, которых нет в маппинге
 * - Обновляет только при несовпадении weeekId
 *
 * @returns {Promise<void>} Promise, который разрешается после завершения синхронизации
 */
export async function tagsWithWeeek(this: Sync): Promise<void> {
  try {
    const weeekTags = await this.weeekApi.getTags()

    // Параллельная обработка каждого тега
    await Promise.all(weeekTags.map((weeekTag) => this.processTag(weeekTag)))
  } catch (error) {
    logger.error(error, 'Ошибка при синхронизации тегов с Weeek')
  }
}
