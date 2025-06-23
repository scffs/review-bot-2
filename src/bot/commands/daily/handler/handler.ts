import { getFormatedDailySummary } from '../formatters'
import { getDailyStats } from '../services'

export async function getDailyMessage(databaseUserId: number) {
  // Получаем статистику по багам и ревью
  const { reviews, bugs } = await getDailyStats(databaseUserId)

  // Формируем финальный текст сводки
  return getFormatedDailySummary(bugs, reviews)
}
