import { WizardSceneAction } from '@mtcute/dispatcher'

import { cancelKb } from '../keyboard.ts'
import type { RegisterSceneStepHandler } from '../types.ts'

export const start: RegisterSceneStepHandler = async (ctx) => {
  await ctx.answerText('Регистрация началась. \n\nПожалуйста, введите имя:', {
    replyMarkup: cancelKb
  })

  return WizardSceneAction.Next
}
