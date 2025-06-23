import type { UserSchema } from '@gitbeaker/rest'

import { logger } from '@utils'

import type { GitLabService } from '../index.ts'

/**
 * Получение данных пользователя GitLab по его ID.
 * Метод делает запрос к GitLab API для получения информации о пользователе.
 *
 * @param userId - ID пользователя в GitLab
 * @returns Promise, разрешающийся в объект с данными пользователя
 */
export async function getUserById(
  this: GitLabService,
  userId: number
): Promise<UserSchema> {
  try {
    return await this.api.Users.show(userId)
  } catch (error) {
    logger.error(error, `Ошибка при получении данных пользователя ${userId}:`)
    throw new Error(`Не удалось получить данные пользователя ${userId}.`)
  }
}
