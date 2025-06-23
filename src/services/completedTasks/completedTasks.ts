import { type Weeek, weeek } from '../../clients/weeek'

import { save, setup } from './methods'

/**
 * Класс CompletedTasks обрабатывает завершённые задачи из Weeek.
 *
 * Основные обязанности:
 * - Получение задач с помощью Weeek API
 * - Сохранение задач в базу данных
 * - Обработка информации, связанной с MR, тестами, тегами и исполнителями
 */
export class CompletedTasks {
  /**
   * Экземпляр клиента Weeek API.
   * Используется для получения задач и метаданных из внешнего сервиса.
   */
  protected weeekApi: Weeek

  /**
   * Конструктор инициализирует API клиента.
   */
  constructor() {
    this.weeekApi = weeek
  }

  // Инициализация процесса получения задач
  setup = setup

  // Сохранение задачи
  save = save
}

// Глобальный экземпляр сервиса
export const completedTasks = new CompletedTasks()
