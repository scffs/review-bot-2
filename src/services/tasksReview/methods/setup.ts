import type { TasksReview } from 'services/tasksReview'

import { withTimeOut } from '@utils'
import { TASKS_CHECK_INTERVAL } from '../config'

/**
 * Запуск циклической проверки задач.
 *
 * Функция запускает процесс автоматического обновления задач (autoReviewer),
 * а затем планирует следующий запуск через интервал, указанный в конфигурации.
 * @returns {void}
 */

let started = false

export function setup(this: TasksReview): void {
  if (started) {
    throw new Error('Менеджер ревью уже запущен')
  }

  started = true

  // Запуск автоматического обновления задач
  withTimeOut(async () => {
    await this.autoReviewer()
  }, TASKS_CHECK_INTERVAL)
}
