import type { InputPeerLike } from '@mtcute/core'

import type { Bot } from '@bot'

/**
 * Удаление сообщения из чата.
 * @param chatId ID чата или пользователя
 * @param messageId ID сообщения для удаления
 * @returns Результат удаления сообщения
 */
export async function deleteMessage(
  this: Bot,
  chatId: InputPeerLike,
  messageId: number
) {
  try {
    return this.tg.deleteMessagesById(chatId, [messageId])
  } catch (error) {
    console.log('error', error)
  }
}
