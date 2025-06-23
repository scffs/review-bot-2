import type { InputMediaLike } from '@mtcute/bun'

import { CONFIG } from '@config'
import { type Logger, logger } from '@utils'

import { di } from '@di'

import { saveTask } from 'services/saveTask'
import type { TaskProcessingContext } from 'services/taskContext'

/**
 * Обрабатывает обновление медиа-контента задачи
 *
 * Выполняет:
 * 1. Удаление старых сообщений
 * 2. Отправку новых медиа-файлов
 * 3. Обновление данных в базе данных
 *
 * @param {TaskProcessingContext} context - Контекст обработки задачи
 * @param {InputMediaLike[]} messageMedia - Новые медиа-файлы
 * @param {Logger} log - Логгер для записи событий
 * @returns {Promise<void>}
 */
export async function handleMediaUpdate(
  context: TaskProcessingContext,
  messageMedia: InputMediaLike[],
  log: Logger
): Promise<void> {
  for (const messageId of context.messageIds) {
    try {
      await di.bot.deleteMessage(CONFIG.chatId, messageId)
    } catch (e) {
      logger.error(e, 'delete message err')
    }
  }

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
}
