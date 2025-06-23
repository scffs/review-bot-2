import { BOT_TOKEN } from '@config'
import { logger } from '@utils'

import type { Bot } from '@bot'

import { registerCommands } from './registerCommands.ts'
import { registerScenes } from './registerScenes.ts'

/**
 * Инициализация и настройка бота.
 * Включает регистрацию команд и запуск Telegram-клиента.
 */
export async function setup(this: Bot) {
  // Запуск Telegram-клиента с использованием токена бота
  const user = await this.tg.start({
    botToken: BOT_TOKEN
  })

  // Логирование успешного входа в систему
  logger.debug(`Вход в аккаунт @${user.username}`)

  // Регистрация команд и сцен для бота
  registerCommands(this.dp)
  registerScenes(this.dp)
}
