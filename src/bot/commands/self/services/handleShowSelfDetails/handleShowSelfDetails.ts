import { getFormattedTask } from '@utils'

import { formatDetailedStats } from '../../formatters'

import { handleSelfStats } from '../handleSelfStats/handleSelfStats.ts'

interface ShowDetails {
  page: string
  databaseUserId: number
}

export async function handleShowSelfDetails({
  page,
  databaseUserId
}: ShowDetails) {
  const currentPage = Math.max(1, Number(page) || 1)
  const limit = 5

  // Получаем и категории, и «страницу»
  const stats = await handleSelfStats(databaseUserId, currentPage, limit)

  // Форматируем только текущую страницу
  const formatted = await Promise.all(
    stats.tasksPage.map((t) => getFormattedTask(t))
  )

  // В конструктор передаём уже отформатированные задачи-страницы + навигацию
  const totalPages = Math.ceil(stats.totalCount / limit)
  const { text, keyboard } = formatDetailedStats(
    formatted,
    currentPage,
    totalPages,
    databaseUserId
  )

  return { text, keyboard }
}
