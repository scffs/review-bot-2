import type { InputPeerLike, InputText } from '@mtcute/core'

import type { Bot } from '@bot'

/**
 * Отправка текстового сообщения через Telegram-клиент.
 * @param chatId ID чата или пользователя, куда отправляется сообщение
 * @param text Текст сообщения
 * @param params Дополнительные параметры отправки (необязательно)
 * @returns Результат отправки сообщения
 */
export async function sendText(
  this: Bot,
  chatId: InputPeerLike,
  text: InputText,
  params?: Parameters<typeof this.tg.sendText>[2]
) {
  return this.tg.sendText(chatId, text, params)
}
