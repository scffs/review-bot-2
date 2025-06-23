import type { InputText } from '@mtcute/core'

import { ADMIN_ID } from '@config'

import type { Bot } from '@bot'

export async function sendToAdmin(
  this: Bot,
  text: InputText,
  params?: Parameters<typeof this.tg.sendText>[2]
) {
  return this.sendText(ADMIN_ID, text, params)
}
