import type { Logger } from '@utils'

import { di } from '@di'

import type { Task } from 'clients/weeek'

import type { Tx } from '@database'
import type { TaskContext } from '../taskContext.ts'
import type { TaskProcessingContext } from '../types.ts'

/**
 * Инициализирует контекст обработки задачи
 *
 * Этапы инициализации:
 * 1. Проверяет существование задачи в БД
 * 2. Получает поля задачи из Weeek
 * 3. Получает существующие сообщения
 * 4. Создает подпись для сообщения
 * 5. Подготавливает пути к медиа-файлам
 *
 * @param {Task} task - Задача для инициализации
 * @param {Logger} log - Логгер для записи событий
 * @param tx
 * @returns {Promise<TaskProcessingContext | null>} Контекст задачи или null при ошибке
 */
export async function initialize(
  this: TaskContext,
  task: Task,
  log?: Logger,
  tx?: Tx
): Promise<TaskProcessingContext | null> {
  log?.debug({ taskId: task.id }, 'initialize')
  if (!task.id) {
    return null
  }

  const fields = await this.getCurrentTaskFields(task, tx)
  log?.debug({ title: fields?.title }, 'fields')

  if (!fields) {
    log?.warn('Поля задачи не получены')
    return null
  }

  const validationResult = this.schema.safeParse(fields)
  if (!validationResult.success) {
    log?.error(validationResult.error.errors, 'Невалидные данные задачи:')
    return null
  }

  log?.info(
    {
      // mrId: fields.mrId,
      title: fields.title
      // videos: fields.videos.length,
      // images: fields.images.length,
      // tags: fields.tags.length
    },
    'Получены поля'
  )

  const taskFromDb = await di.task.getByWeeekId(task.id, tx)

  const existingMessages = taskFromDb
    ? await di.taskMessage.getByTaskId(taskFromDb.id, tx)
    : []

  const messageIds = existingMessages.map((msg) => msg.messageId)

  const messageCaption = this.getTaskMessage(task, fields)

  if (!messageCaption) {
    log?.warn('Сообщение задачи не получено')
    return null
  }

  log?.debug('Скачиваю медиа')
  const messageMediaPaths = await this.getTaskMedia(fields, task.id, log)

  return {
    taskId: task.id,
    taskFromDb,
    fields,
    messageIds,
    messageCaption,
    messageMediaPaths
  }
}
