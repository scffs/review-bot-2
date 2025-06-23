import { getFormattedSelfSummary } from '../formatters'
import { handleSelfStats } from '../services'

export async function getSelfMessage(databaseUserId: number) {
  const stats = await handleSelfStats(databaseUserId)

  return getFormattedSelfSummary(stats, databaseUserId)
}
