import { md } from '@mtcute/bun'
import { filters } from '@mtcute/dispatcher'

import type { DispatcherWithStorage } from '@bot'

import { getStatsMessage } from './handler'

export const registerStats = (dp: DispatcherWithStorage) => {
  dp.onNewMessage(filters.command('stats'), async (ctx) => {
    const summary = await getStatsMessage(dp.deps.user.id)

    await ctx.answerText(md(summary), { disableWebPreview: true })
  })
}
