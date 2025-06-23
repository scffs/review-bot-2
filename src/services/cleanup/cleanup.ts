import { type Weeek, weeek } from 'clients/weeek'

import {
  completedTasks,
  orphanedAttachments,
  setup,
  unreferencedOnDisk
} from './methods'

/**
 * Класс Cleanup отвечает за очистку и поддержку целостности данных.
 *
 * Основные обязанности:
 * - Удаление завершённых задач
 * - Удаление "сиротских" вложений (непривязанных к задачам)
 * - Очистка неиспользуемых файлов на диске
 * - Выполнение подготовительных процедур (setup)
 */
export class Cleanup {
  /**
   * Экземпляр клиента Weeek API.
   * Используется для получения данных о задачах и тегах из внешнего источника.
   */
  protected weeekApi: Weeek

  /**
   * Конструктор инициализирует зависимости,
   * включая клиент Weeek API.
   */
  constructor() {
    // Инициализация клиента Weeek API
    this.weeekApi = weeek
  }

  /**
   * Метод для удаления завершённых задач
   */
  completedTasks = completedTasks

  /**
   * Метод для удаления вложений, не привязанных к задачам в базе данных
   */
  orphanedAttachments = orphanedAttachments

  /**
   * Метод для базовой инициализации состояния перед выполнением операций очистки
   */
  setup = setup

  /**
   * Метод для удаления файлов на диске, не привязанных ни к одной задаче
   */
  unreferencedOnDisk = unreferencedOnDisk
}

/**
 * Экземпляр сервиса Cleanup, готовый к использованию.
 */
export const cleanup = new Cleanup()
