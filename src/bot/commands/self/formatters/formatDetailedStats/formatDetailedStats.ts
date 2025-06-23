import type { TaskFieldsForSummary } from '@types'

import {
  createBackSelfKeyboard,
  createSelfPaginationKeyboard
} from '../../keyboard'
import { getFormattedTaskDetails } from '../getFormattedTaskDetails/getFormattedTaskDetails.ts'

export function formatDetailedStats(
  tasksPage: TaskFieldsForSummary[],
  page: number,
  totalPages: number,
  userId: number
) {
  // Формируем тело
  const details = tasksPage
    .map((task, idx) =>
      getFormattedTaskDetails(task, (page - 1) * tasksPage.length + idx + 1)
    )
    .join('\n\n')

  const text = `📊 Детальная статистика (${page}/${totalPages}):\n\n${details}`

  // Навигация: стрелки и «назад»
  const keyboard =
    totalPages > 1
      ? createSelfPaginationKeyboard(userId, page, totalPages)
      : createBackSelfKeyboard(userId)

  return { text, keyboard }
}
