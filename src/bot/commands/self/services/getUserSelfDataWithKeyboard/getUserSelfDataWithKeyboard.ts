import { md } from '@mtcute/bun'
import type { CallbackQueryContext, UpdateState } from '@mtcute/dispatcher'

import { di } from '@di'

import { getSelfMessage } from '../../handler'
import { SelfKeyboardActions } from '../../keyboard'

export async function getUserSelfDataWithKeyboard(
  ctx: CallbackQueryContext,
  state: UpdateState<any>
) {
  await state.rateLimit(SelfKeyboardActions.Refresh, 2, 1)

  const user = await di.user.getByTelegramId(ctx.user.id)
  if (!user) {
    await ctx.answer({})
    return
  }

  const summary = await getSelfMessage(user.id)

  const oldMessage = await ctx.getMessage()
  if (oldMessage?.textWithEntities.text === summary.text) {
    await ctx.answer({})
    return
  }

  await ctx.editMessage({
    text: md(summary.text),
    replyMarkup: summary.keyboard
  })
}
