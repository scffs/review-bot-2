import type { InputMediaLike } from '@mtcute/bun'

import { CONFIG } from '@config'
import type { Logger } from '@utils'

import { di } from '@di'

import { saveTask } from 'services/saveTask'
import type { TaskProcessingContext } from 'services/taskContext'

/**
 * Обрабатывает создание новой задачи в чате
 *
 * Процесс:
 * 1. Отправляет группу медиа-сообщений в чат
 * 2. Сохраняет идентификаторы сообщений
 * 3. Сохраняет все связанные данные задачи
 *
 * @param {TaskProcessingContext} context - Контекст обработки задачи
 * @param {InputMediaLike[]} messageMedia - Медиа-файлы для отправки
 * @param {Logger} log - Логгер для записи событий
 * @returns {Promise<void>}
 */
export async function handleNewTask(
  context: TaskProcessingContext,
  messageMedia: InputMediaLike[],
  log: Logger
): Promise<void> {
  const messages = await di.bot.sendMediaGroup(CONFIG.chatId, messageMedia)
  const messageIds = messages.map((msg) => msg.id)

  await saveTask.withRelatedData(
    context.taskId,
    {
      messageMediaPaths: context.messageMediaPaths,
      messageCaption: context.messageCaption,
      messageIds,
      fields: context.fields,
      createdAt: Date.now()
    },
    context.taskFromDb
  )

  log.info('Задача создана')
}
