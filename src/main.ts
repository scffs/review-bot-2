import { logger, shutdown } from '@utils'

import { db } from '@database'
import { di } from '@di'

import { sync } from './services/sync'

import { cleanup } from 'services/cleanup'
import { tasksReview } from 'services/tasksReview'
import { completedTasks } from './services/completedTasks'

// Главная функция приложения
const main = async () => {
  // Запуск Telegram-бота
  await di.bot.setup()
  // Подключение к базе данных
  await db.connect()

  // Очистка от устаревших данных
  await cleanup.setup()

  // Запуск сервиса синхронизации задач о ревью
  await completedTasks.setup()

  // Запуск сервиса уведомлений о ревью
  tasksReview.setup()

  // Запуск сервиса синхронизации данных
  sync.setup()
}

// Обработка сигналов завершения работы приложения
// Обработка Ctrl+C
process.on('SIGINT', shutdown)
// Обработка сигнала завершения от системы
process.on('SIGTERM', shutdown)

// Обработка необработанных ошибок
main().catch((error) => {
  // Логирование ошибки
  logger.error(error, 'Необработанная ошибка: %s')
  // Завершение работы приложения
  shutdown()
})
