import { CONFIG } from '@config'

import { di } from '@di'

import { type Logger, logger } from '@utils'

/**
 * Удаляет старые сообщения задачи из чата и базы данных
 *
 * Процесс:
 * 1. Последовательно удаляет каждое сообщение из чата
 * 2. Удаляет все записи сообщений из БД
 *
 * @param {number} taskId - Идентификатор задачи
 * @param {number[]} messageIds - Массив ID сообщений для удаления
 * @param {Logger} log - Логгер для записи событий
 * @returns {Promise<void>}
 */
export async function deleteOldMessages(
  taskId: number,
  messageIds: number[],
  log: Logger
): Promise<void> {
  // Удаляем каждое сообщение из чата
  for (const messageId of messageIds) {
    log.info('Удаление сообщения из чата', messageId)
    try {
      await di.bot.deleteMessage(CONFIG.chatId, messageId)
    } catch (e) {
      logger.error(e, 'delete message error')
    }
  }
  // Удаляем все связанные сообщения из БД
  await di.taskMessage.deleteByTaskId(taskId)
}
