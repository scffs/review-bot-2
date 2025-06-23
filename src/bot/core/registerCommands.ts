import type { DispatcherWithStorage } from '@bot'

import {
  registerAnalytic,
  registerDaily,
  registerSelfCommand,
  registerStart,
  registerStats
} from '../commands'

/**
 * Регистрация обработчиков команд для бота.
 * Добавляет обработчики для различных типов сообщений.
 */
export const registerCommands = (dp: DispatcherWithStorage) => {
  registerStart(dp)
  registerDaily(dp)
  registerSelfCommand(dp)
  registerStats(dp)
  registerAnalytic(dp)
}
