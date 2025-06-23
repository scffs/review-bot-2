import {
  type MessageContext,
  type UpdateState,
  WizardSceneAction
} from '@mtcute/dispatcher'

import type { RegistrationState } from '../../types.ts'

import { prompts, stepOrder } from '../../constants.ts'
import { navKb } from '../../keyboard.ts'

/**
 * Шаг: отправить следующий prompt или завершить
 */
export async function navigateNextOrExit(
  ctx: MessageContext,
  state: UpdateState<RegistrationState>,
  nextStep: number
): Promise<WizardSceneAction> {
  // если есть следующий шаг
  if (nextStep < stepOrder.length) {
    const next = stepOrder[nextStep]
    const s = await state.get()

    if (!s) {
      return WizardSceneAction.Exit
    }

    const val = s[next]

    await ctx.answerText(`${prompts[next]}${val ? ` (текущее: ${val})` : ''}`, {
      replyMarkup: navKb(nextStep + 1, Boolean(val))
    })
    return WizardSceneAction.Next
  }

  await ctx.replyText('Регистрация завершена!')
  return WizardSceneAction.Exit
}
