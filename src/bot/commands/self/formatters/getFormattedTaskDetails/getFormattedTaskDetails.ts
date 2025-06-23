import type { TaskFieldsForSummary } from '@types'

/**
 * Возвращает сообщение, если тестирование не требуется для задачи
 */
function getNoTestsBlock(): string[] {
  return ['🚫 Тестирование не требуется']
}

/**
 * Возвращает сообщение, если задача ожидает начала тестирования
 */
function getPendingTestsBlock(): string[] {
  return ['🧪 Ожидаем начала тестирования']
}

/**
 * Возвращает сообщение, если тестирование проведено и багов не обнаружено
 */
function getPassedWithoutBugsBlock(): string[] {
  return ['Тестирование пройдено без багов']
}

/**
 * Возвращает сообщение, если тестирование не проводилось, но было необходимо
 */
function getNotConductedBlock(): string[] {
  return ['Тестирование не проводилось']
}

/**
 * Возвращает сообщение, если баги были, но все исправлены, и есть ссылка на отчёт
 */
function getPassedWithBugsBlock(
  taskUrl: string,
  fixed: number,
  total: number
): string[] {
  const summary = `🧪 Все баги устранены | [${fixed}/${total}](${taskUrl})`
  return [summary]
}

/**
 * Возвращает сообщение, если остались нерешённые баги, включая счётчики и ссылку
 */
function getUnresolvedBugsBlock(
  unresolved: number,
  fixed: number,
  total: number,
  taskUrl?: string
): string[] {
  const block = [
    '🧪 Обнаружены баги',
    `Исправлено: ${fixed}/${total}`,
    `Открыто: ${unresolved}`
  ]

  // Добавляем ссылку на отчёт о тестировании, если она есть
  if (taskUrl) {
    block.push(`🔗 [Просмотр отчёта о тестировании](${taskUrl})`)
  }

  return block
}

/**
 * Формирует блок информации о тестировании задачи
 * Включает учёт статуса выполнения, наличия багов и ссылки на отчёт
 */
function getTestsBlock(task: TaskFieldsForSummary): string[] {
  if (!task.tests.isNeeded) {
    // Тестирование не требуется
    return getNoTestsBlock()
  }

  const tests = task.tests

  if (!tests.taskUrl) {
    // Тестирование необходимо, но отчёта нет → не проводилось
    return getNotConductedBlock()
  }

  const total = tests.all?.length ?? 0
  const unresolved = tests.unresolved?.length ?? 0
  const fixed = total - unresolved

  if (total === 0) {
    // Нет тестов вообще
    if (task.isCompleted) {
      return tests.isCompleted
        ? getPassedWithoutBugsBlock()
        : getNotConductedBlock()
    }

    // Задача не завершена — тесты ещё не начались
    return getPendingTestsBlock()
  }

  if (unresolved === 0) {
    // Все баги устранены
    return getPassedWithBugsBlock(tests.taskUrl, fixed, total)
  }

  // Есть нерешённые баги
  return getUnresolvedBugsBlock(unresolved, fixed, total, tests.taskUrl)
}

/**
 * Формирует полный текстовый блок с подробной информацией по задаче
 * Включает заголовок, статус, тестирование
 */
export function getFormattedTaskDetails(
  task: TaskFieldsForSummary,
  index: number
): string {
  const status = task.isCompleted ? '✅ Завершена' : '⏳ В работе'

  const lines = [
    // Первый блок может быть стилизован звездочками
    ...(index === 1 ? ['🌟━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━🌟 \n'] : []),

    // Заголовок задачи со ссылкой
    `**#${index} 📝 [${task.title || 'Без названия'}](${task.taskUrl})** `,

    // Статус задачи
    `${status}`,

    // Блок с информацией о тестировании
    ...getTestsBlock(task)
  ]

  return lines.join('\n')
}
