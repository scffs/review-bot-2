import { WizardSceneAction } from '@mtcute/dispatcher'

import { logger } from '@utils'

import { prompts } from '../constants.ts'
import { cancelKb, navKb } from '../keyboard.ts'
import { schemas } from '../validation.ts'

import type { RegisterSceneStepHandler } from '../types.ts'

export const firstName: RegisterSceneStepHandler = async (ctx, state) => {
  if (!ctx.text) {
    await ctx.answerText(prompts.name, { replyMarkup: cancelKb })
    return WizardSceneAction.Stay
  }

  const t = ctx.text.trim()
  const parsed = schemas.name.safeParse(t)
  if (!parsed.success) {
    await ctx.replyText(parsed.error.errors[0].message)
    return WizardSceneAction.Stay
  }

  try {
    await state.merge({ name: t })
  } catch (e) {
    await state.set({ name: t })
    logger.error({ e }, 'merge state error')
  }

  const s = await state.get()

  const val = s?.lastName
  const text = `${prompts.lastName}${val ? ` (текущее: ${val})` : ''}`

  await ctx.answerText(text, { replyMarkup: navKb(2, Boolean(val)) })
  return WizardSceneAction.Next
}
