import { TelegramClient } from '@mtcute/bun'
import { Dispatcher, MemoryStateStorage } from '@mtcute/dispatcher'

import { API_HASH, API_ID } from '@config'
import { logger } from '@utils'

import { setup } from './core'

import {
  deleteMessage,
  editMessage,
  sendMediaGroup,
  sendText,
  sendToAdmin
} from './methods'

import { authMiddleware, errorMiddleware } from './middlewares'

/**
 * Позволяет передавать состояние в обработчики команд и настраивать rate-limit / throttle для обработки всех событий,
 * например сообщений и кликов на кнопки
 */
export type DispatcherWithStorage = Dispatcher<MemoryStateStorage>

/**
 * Класс для управления Telegram-ботом.
 */
export class Bot {
  readonly tg: TelegramClient
  readonly dp: DispatcherWithStorage

  constructor() {
    // Инициализация Telegram-клиента с API-ключаиами
    this.tg = new TelegramClient({
      apiId: API_ID,
      apiHash: API_HASH,
      // Путь к файлу сессии
      storage: 'bot-data/session'
    })

    this.tg.onError.add((err) => {
      logger.error(err, 'bot error')
    })

    this.dp = Dispatcher.for(this.tg, {
      storage: new MemoryStateStorage()
    })

    // Middleware авторизации
    this.dp.onPreUpdate((upd) => authMiddleware(upd, this.dp))

    this.dp.onError(errorMiddleware)
  }

  // Методы, доступные извне
  // Базовая настройка бота (запуск)
  setup = setup
  // Работа с сообщениями
  sendText = sendText
  sendToAdmin = sendToAdmin
  sendMediaGroup = sendMediaGroup
  editMessage = editMessage
  deleteMessage = deleteMessage
}
