import { logger } from '@utils'

import type { TasksReview } from 'services/tasksReview'

/**
 * Автоматическое обновление задач и их сообщений.
 *
 * Основной процесс работы сервиса уведомлений, который:
 * 1. Получает актуальный список задач из Weeek API
 * 2. Обрабатывает каждую задачу и обновляет соответствующие сообщения
 *
 * Обработка ошибок:
 * - Перехватывает все исключения, чтобы обеспечить непрерывность работы
 * - Логирует ошибки для последующего анализа
 * - При ошибке ожидает следующего цикла проверки
 *
 * @returns {Promise<void>} Promise, который разрешается после завершения всех операций
 */
export async function autoReviewer(this: TasksReview): Promise<void> {
  const perPage = 20
  let offset = 0
  let hasMore = true

  try {
    while (hasMore) {
      // Получаем «страницу» задач на ревью
      const { tasks, hasMore: more } = await this.weeekApi.getTasksInReview(
        offset,
        perPage
      )

      if (tasks.length === 0) {
        break
      }

      // Обрабатываем все задачи последовательно
      for (const task of tasks) {
        await this.handleTaskAndUpdate(task)
      }

      // Сдвигаем offset и учитываем флаг
      offset += tasks.length
      hasMore = more
    }
  } catch (err) {
    logger.error(err, 'Ошибка в autoReviewer при получении задач на ревью')
  }
}
