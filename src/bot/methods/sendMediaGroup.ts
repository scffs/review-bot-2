import type { InputMediaLike } from '@mtcute/bun'
import type { InputPeerLike } from '@mtcute/core'

import type { Bot } from '@bot'

/**
 * Отправка медиагруппы в чат.
 * @param chatId ID чата или пользователя
 * @param media Массив медиафайлов для отправки
 * @returns Результат отправки медиагруппы
 */

export async function sendMediaGroup(
  this: Bot,
  chatId: InputPeerLike,
  media: (InputMediaLike | string)[]
) {
  return this.tg.sendMediaGroup(chatId, media)
}
