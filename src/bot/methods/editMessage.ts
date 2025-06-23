import type { InputPeerLike, InputText } from '@mtcute/core'

import type { Bot } from '@bot'

/**
 * Редактирование подписи существующего сообщения.
 * @param chatId ID чата или пользователя
 * @param messageId ID сообщения для редактирования
 * @param caption Новая подпись сообщения
 * @returns Результат редактирования сообщения
 */

export async function editMessage(
  this: Bot,
  chatId: InputPeerLike,
  messageId: number,
  caption: InputText
) {
  return this.tg.editMessage({
    chatId,
    message: messageId,
    text: caption
  })
}
