import type { ParsedUpdate } from '@mtcute/core'
import { PropagationAction } from '@mtcute/dispatcher'

import { di } from '@di'
import { logger } from '@utils'

import type { DispatcherWithStorage } from '@bot'
import { db } from '@database'

export const authMiddleware = async (
  // Объект, содержащий информацию о входящем событии
  update: ParsedUpdate,
  dp: DispatcherWithStorage
) => {
  // Редактирование сообщения и удаление не требуют проверок
  if (update.name === 'delete_message' || update.name === 'edit_message') {
    return PropagationAction.Continue
  }

  // callback_query – событие клика на кнопки
  if (update.name !== 'new_message' && update.name !== 'callback_query') {
    logger.error({ name: update.name }, 'Получено неизвестное событие')
    return PropagationAction.Stop
  }

  const telegramId = update.data.chat.id

  const user = await di.user.getByTelegramId(telegramId)
  // Если пользователя нет в БД, необходимо прекратить обработку входящего события
  if (!user) {
    return PropagationAction.Stop
  }

  // Инъекция зависимостей
  dp.inject({ user })
  dp.inject({ db: db })

  // Отправляем событие дальше
  return PropagationAction.Continue
}
