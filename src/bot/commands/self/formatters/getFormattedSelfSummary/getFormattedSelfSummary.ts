import { di } from '@di'

import { createMainSelfKeyboard } from '../../keyboard'
import type { SelfStats } from '../../services'

export async function getFormattedSelfSummary(
  stats: SelfStats,
  userId: number
) {
  const user = await di.user.getById(userId)
  if (!user) {
    throw new Error('Пользователь не найден')
  }

  const lines = [
    'Краткая статистика твоих задач: \n',
    `✅ Завершено: ${stats.completed.length}`,
    `🧪 В тестировании: ${stats.inTesting.length}`
  ]

  const keyboard = createMainSelfKeyboard(userId)

  return {
    text: lines.join('\n'),
    keyboard
  }
}
