import { md } from '@mtcute/bun'
import { filters } from '@mtcute/dispatcher'

import type { DispatcherWithStorage } from '@bot'

import { getDailyMessage } from './handler'

export const registerDaily = (dp: DispatcherWithStorage) => {
  // Обработка команды /daily от пользователя
  dp.onNewMessage(filters.command('daily'), async (ctx) => {
    // Получаем сгенерированное текстовое сообщение-сводку
    const summary = await getDailyMessage(dp.deps.user.id)

    // Если данных нет – ничего не отвечаем
    if (!summary) {
      return
    }

    // Отправляем Markdown-сообщение пользователю, отключая предпросмотр ссылок
    await ctx.answerText(md(summary), { disableWebPreview: true })
  })
}
