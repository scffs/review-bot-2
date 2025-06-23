import { formatWord } from '@utils'
import { type AnalyticStats, AnalyticType } from '../types'

/**
 * Тип функции форматирования аналитики в строку
 */
type Formatter = (stats: AnalyticStats) => string

/**
 * Объект с форматировщиками по типу аналитики
 */
const formatters: Record<AnalyticType, Formatter> = {
  [AnalyticType.PERSONAL]: formatPersonalAnalytics,
  [AnalyticType.TEAM]: formatTeamAnalytics,
  [AnalyticType.REVIEWS]: formatReviewsAnalytics,
  [AnalyticType.TASKS]: formatTasksAnalytics
}

/**
 * Основная функция форматирования.
 * Выбирает нужный форматтер по типу статистики.
 * Если форматтер не найден, возвращает сообщение об ошибке.
 */
export const getFormattedAnalyticMessage = (stats: AnalyticStats): string => {
  const formatter = formatters[stats.type]
  if (!formatter) return 'Аналитика недоступна'
  return formatter(stats)
}

/**
 * Вспомогательная функция проверки наличия данных.
 * Генерирует исключение с сообщением, если данных нет.
 * Используется для защиты форматтеров от некорректных входных данных.
 */
function checkStats<T>(
  data: T | undefined,
  errorMsg: string
): asserts data is T {
  if (!data) throw new Error(errorMsg)
}

/**
 * Форматирование персональной аналитики в человекочитаемый вид.
 */
function formatPersonalAnalytics(stats: AnalyticStats): string {
  try {
    checkStats(stats.userStats, 'Данные не найдены')
  } catch {
    return 'Данные не найдены'
  }

  const { completedTasks, openTasks, reviewsGiven, commentsLeft } =
    stats.userStats

  const lines = [
    '📊 **Персональная аналитика**',
    '',
    `✅ Завершён${completedTasks === 1 ? 'а' : 'о'} ${completedTasks} ${formatWord(completedTasks, 'задача', 'задачи', 'задач')}`,
    `📝 Открыт${openTasks === 1 ? 'а' : 'о'} ${openTasks} ${formatWord(openTasks, 'задача', 'задачи', 'задач')}`,
    `🔍 Проведено ${reviewsGiven} ${formatWord(reviewsGiven, 'ревью', 'ревью', 'ревью')}`,
    `💬 Оставлено ${commentsLeft} ${formatWord(commentsLeft, 'комментарий', 'комментария', 'комментариев')}`
  ]

  return lines.join('\n')
}

/**
 * Форматирование аналитики команды.
 */
function formatTeamAnalytics(stats: AnalyticStats): string {
  try {
    checkStats(stats.teamStats, 'Данные команды не найдены')
  } catch {
    return 'Данные команды не найдены'
  }

  const {
    totalCompletedTasks,
    totalResolvedBugs,
    totalReviewComments,
    totalOpenTasks,
    avgReviewTime,
    topPerformers
  } = stats.teamStats

  const avgTimeFormatted = avgReviewTime.toFixed(2)

  const lines = [
    '🏆 **Аналитика команды**',
    '',
    `✅ Всего завершено задач: ${totalCompletedTasks} ${formatWord(totalCompletedTasks, 'задача', 'задачи', 'задач')}`,
    `📝 Всего открытых задач: ${totalOpenTasks} ${formatWord(totalOpenTasks, 'задача', 'задачи', 'задач')}`,
    `🐞 Закрыто багов: ${totalResolvedBugs} ${formatWord(totalResolvedBugs, 'баг', 'бага', 'багов')}`,
    `💬 Комментариев в ревью: ${totalReviewComments} ${formatWord(totalReviewComments, 'комментарий', 'комментария', 'комментариев')}`,
    `⏱ Среднее время ревью: ${avgTimeFormatted} ч.`,
    '',
    '**Топ исполнители:**',
    ...topPerformers.map(
      (u, i) =>
        `${i + 1}. ${u.name} - ${u.completedTasks} ${formatWord(u.completedTasks, 'задача', 'задачи', 'задач')} • 💬 ${u.commentsLeft ?? 0} • 🐞 ${u.bugsClosed ?? 0}`
    )
  ]

  return lines.join('\n')
}

/**
 * Форматирование аналитики по ревью.
 */
function formatReviewsAnalytics(stats: AnalyticStats): string {
  try {
    checkStats(stats.userStats, 'Данные по ревью не найдены')
  } catch {
    return 'Данные по ревью не найдены'
  }

  const { reviewsGiven, commentsLeft } = stats.userStats

  const lines = [
    '🔍 **Аналитика ревью**',
    '',
    `📊 Проведено ${reviewsGiven} ${formatWord(reviewsGiven, 'ревью', 'ревью', 'ревью')}`,
    `💬 Оставлено ${commentsLeft} ${formatWord(commentsLeft, 'комментарий', 'комментария', 'комментариев')}`
  ]

  return lines.join('\n')
}

/**
 * Форматирование аналитики по задачам.
 */
function formatTasksAnalytics(stats: AnalyticStats): string {
  try {
    checkStats(stats.userStats, 'Данные по задачам не найдены')
  } catch {
    return 'Данные по задачам не найдены'
  }

  const { completedTasks, openTasks } = stats.userStats

  const lines = [
    '📝 **Аналитика задач**',
    '',
    `✅ Завершён${completedTasks === 1 ? 'а' : 'о'} ${completedTasks} ${formatWord(completedTasks, 'задача', 'задачи', 'задач')}`,
    `🔄 Открыт${openTasks === 1 ? 'а' : 'о'} ${openTasks} ${formatWord(openTasks, 'задача', 'задачи', 'задач')}`
  ]

  return lines.join('\n')
}
