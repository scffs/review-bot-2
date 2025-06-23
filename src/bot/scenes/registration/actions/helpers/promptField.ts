import {
  type MessageContext,
  type UpdateState,
  WizardSceneAction
} from '@mtcute/dispatcher'

import type { Field, RegistrationState } from '../../types.ts'

import { prompts } from '../../constants.ts'
import { navKb } from '../../keyboard.ts'

/**
 * Шаг: показать пользователю текст для ввода field
 */
export async function promptField(
  ctx: MessageContext,
  state: UpdateState<RegistrationState>,
  field: Field,
  step: number
): Promise<WizardSceneAction> {
  console.log('field', field)
  const s = await state.get()

  if (!s) {
    await ctx.answerText('Невалидное состояние, попробуйте позже')

    return WizardSceneAction.Exit
  }

  const val = s[field]
  const text = `${prompts[field]}${val ? ` (текущее: ${val})` : ''}`

  await ctx.answerText(text, { replyMarkup: navKb(step, Boolean(val)) })
  return WizardSceneAction.Stay
}
