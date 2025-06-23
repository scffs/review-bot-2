import { getFormatedStatsSummary } from '../formatters'
import { getUserStats } from '../services'

export async function getStatsMessage(databaseUserId: number) {
  const stats = await getUserStats(databaseUserId)

  return getFormatedStatsSummary(stats)
}
