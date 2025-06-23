import { md } from '@mtcute/bun'
import { filters } from '@mtcute/dispatcher'

import type { DispatcherWithStorage } from '@bot'

import { getStartMessage } from './handler'

export const registerStart = (dp: DispatcherWithStorage) => {
  dp.onNewMessage(filters.start, async (ctx) => {
    const message = await getStartMessage(dp.deps.user)

    if (!message) {
      return
    }

    await ctx.answerText(md(message))
  })
}
