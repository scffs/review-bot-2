import { di } from '@di'
import { logger } from '@utils'

import type { Task } from 'clients/weeek'
import { taskContext } from 'services/taskContext'
import type { TasksReview } from 'services/tasksReview'

import { UpdateReason, checkForUpdates } from './helpers'
import { processTaskUpdate } from './operations'

/**
 * Обрабатывает задачу и обновляет соответствующие сообщения в Telegram.
 *
 * Основной процесс:
 * 1. Инициализирует контекст обработки задачи
 * 2. Проверяет, требуется ли обновление сообщений
 * 3. Если требуется, выполняет обновление сообщений
 *
 * Особенности:
 * - Использует дочерний логгер с привязкой к ID задачи
 * - Пропускает задачи без ID
 * - Обрабатывает ошибки на каждом этапе
 *
 * @param {Task} task - Задача из Weeek API
 * @returns {Promise<void>} Promise, который разрешается после обработки задачи
 */
export async function handleTaskAndUpdate(
  this: TasksReview,
  task: Task
): Promise<void> {
  // Пропускаем задачи без ID (невалидный объект)
  if (!task.id) return

  // Создаём дочерний логгер, привязанный к ID задачи
  const log = logger.child({ taskId: task.id })

  try {
    // Шаг 1. Инициализация контекста задачи (включает данные из БД и Weeek API)
    const context = await taskContext.initialize(task, log)
    if (!context) return // Если контекст не собран — прекращаем обработку

    // Проверка: задача была завершена, но теперь возобновлена
    if (context.taskFromDb?.isCompleted) {
      log.info('Задача была возобновлена')
      await di.task.updateByWeeekId(task.id, {
        isCompleted: false,
        completedAt: null
      })
    }

    // Шаг 2. Проверка необходимости обновления сообщений
    const updateReason = await checkForUpdates(context, log)
    if (updateReason === UpdateReason.NONE) return

    // Шаг 3. Обновляем сообщения на основе причины обновления
    await processTaskUpdate(context, log, updateReason)
  } catch (error) {
    // Логируем любую ошибку, возникшую в процессе
    log.error(error, 'Ошибка при обработке задачи')
  }
}
