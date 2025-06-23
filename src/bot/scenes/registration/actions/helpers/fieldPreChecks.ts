import type {
  MessageContext,
  UpdateState,
  WizardSceneAction
} from '@mtcute/dispatcher'

import { di } from '@di'

import { logger } from '@utils'
import type { Field, RegistrationForm, RegistrationState } from '../../types'

// Тип результата предварительной проверки поля — булево или действие сцены
export type PreCheckResult = boolean | WizardSceneAction

// Тип функции проверки поля, асинхронная, принимает контекст, состояние и значение поля
export type FieldPreCheck<K extends Field> = (
  ctx: MessageContext,
  state: UpdateState<RegistrationState>,
  value: RegistrationForm[K]
) => Promise<PreCheckResult>

// Объект с функциями предварительных проверок для полей формы регистрации
export const fieldPreChecks: {
  [K in Field]?: FieldPreCheck<K>
} = {
  // Проверка поля telegramId
  telegramId: async (ctx, state, value) => {
    // Проверяем, есть ли уже пользователь с таким Telegram ID
    const exists = await di.user.getByTelegramId(value)
    if (exists) {
      await ctx.replyText('Пользователь с таким Telegram ID уже есть в системе')
      return false // Отклоняем, т.к. ID занят
    }

    try {
      // Пытаемся получить пользователя Telegram по ID
      const user = await di.bot.tg.getUser(value)

      // Если есть username, сохраняем его в состояние
      if (user.username) {
        await state.merge({ telegramUsername: user.username })
      }
    } catch {
      // Если получить пользователя не удалось — даём подсказку, чтобы написал боту
      const username = await di.bot.tg.getMyUsername()
      let msg = 'Пользователь с таким Telegram ID не доступен для регистрации.'
      msg += `\n\nПопросите его написать мне @${username} и попробуйте снова`
      await ctx.replyText(msg)
      return true // Разрешаем продолжать регистрацию, т.к. проверки строгой нет
    }

    return true // Проверка успешна
  },

  // Проверка поля telegramUsername
  telegramUsername: async (ctx, state, value) => {
    const exists = await di.user.getByTelegramUserName(value)
    if (exists) {
      await ctx.replyText(
        'Пользователь с таким Telegram username уже есть в системе'
      )
      return false
    }

    const s = await state.get()

    if (!s?.telegramId) {
      const msg = 'Внутренняя ошибка. Обратитесь к администратору проекта'
      await ctx.replyText(msg)
      throw new Error(msg)
    }

    try {
      const user = await di.bot.tg.getUser(s.telegramId)

      if (!user.username) {
        return true
      }

      if (value !== user.username) {
        let msg = 'Вы ввели неправильный username.'
        msg += `\n\nВаш ввод: ${value}, актуальный username пользователя ${user.username}.`
        msg +=
          '\n\nЭто поле заполняется автоматически, поэтому его ввод необязателен.'
        await ctx.replyText(msg)
      }
    } catch {
      const username = await di.bot.tg.getMyUsername()
      let msg = 'Пользователь с таким Telegram ID не доступен для регистрации.'
      msg += `\n\nПопросите его написать мне @${username} и попробуйте снова позже`
      // await ctx.replyText(msg)
      return true
    }

    return true
  },

  // Проверка поля gitlabId
  gitlabId: async (ctx, _state, value) => {
    const exists = await di.user.getByGitlabId(value)
    if (exists) {
      await ctx.replyText('Пользователь с таким GitLab ID уже есть в системе')
      return false
    }

    try {
      const existsInGitlab = await di.gitlab.getUserById(value)
      if (existsInGitlab) {
        await ctx.replyText('Пользователь с таким GitLab ID не найден в GitLab')
        return false
      }
    } catch (err) {
      if (
        err &&
        typeof err === 'object' &&
        'message' in err &&
        err.message === 'Not Found'
      ) {
        await ctx.replyText(`Пользователь с id ${value} не найден в GitLab`)
        return false
      }
      const msg =
        'Ошибка при регистрации на поле GitLab ID, обратитесь к администратору.'
      logger.error({ err: err }, msg)
      await ctx.replyText(msg)
      return false
    }

    return true
  }
}
