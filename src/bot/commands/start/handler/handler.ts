import type { UserWithVacancies } from '@database'
import { logger } from '@utils'

import { getFormattedStartText } from '../formatters'

/**
 * Обработчик команды /start.
 * При получении команды /start выполняет запрос к GitLab API и отправляет данные пользователю.
 */
export async function getStartMessage(user: UserWithVacancies) {
  try {
    return getFormattedStartText(user)
  } catch (e) {
    logger.error(e, 'Ошибка в обработке команды /start')
  }
}
