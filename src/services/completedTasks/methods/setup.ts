import type { CompletedTasks } from '../completedTasks'

import { logger } from '@utils'

/**
 * Получает завершённые задачи из Weeek API и сохраняет их.
 *
 * Процесс:
 * 1. Постранично получает завершённые задачи с помощью Weeek API
 * 2. Для каждой задачи вызывает метод `save`
 * 3. Повторяет, пока есть ещё задачи (hasMore === true)
 *
 * Обработка ошибок:
 * - Логирует все ошибки
 * - Гарантирует завершение процесса через `finally`
 */
export async function setup(this: CompletedTasks) {
  const perPage = 20
  let offset = 0
  let hasMore = true

  try {
    while (hasMore) {
      // Получение очередной страницы задач
      const { tasks, hasMore: more } = await this.weeekApi.getCompletedTasks(
        offset,
        perPage
      )

      if (tasks.length === 0) {
        break
      }

      // Последовательное сохранение задач (можно заменить на параллельное)
      for (const t of tasks) {
        await this.save(t)
      }

      offset += tasks.length
      hasMore = more
    }
  } catch (err) {
    logger.error(err, 'Ошибка при обработке завершённых задач')
  } finally {
    logger.info('Завершена обработка завершённых задач')
  }
}
