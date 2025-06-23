import type { BugTask, ReviewTask } from '@database'

export function getFormatedDailySummary(
  bugs: BugTask[],
  reviews: ReviewTask[]
): string {
  const lines: string[] = []

  lines.push('🗒 **Актуальные рабочие задачи.** \n')

  // === Секция ревью ===
  if (reviews.length > 0) {
    lines.push('📋 **Актуальное на ревью:**')
    reviews.forEach((task, idx) => {
      lines.push(`${idx + 1}. 🔗 [${task.title}](${task.taskUrl})`)
    })
  }

  // Разделитель между секциями
  if (reviews.length > 0 && bugs.length > 0) {
    lines.push('')
  }

  // === Секция багов ===
  if (bugs.length > 0) {
    lines.push('🪲 **Актуальные баги:**\n')
    bugs.forEach((task, idx) => {
      lines.push(
        `${idx + 1}. 🗂️ **Задача:** [${task.title || 'Без названия'}](${task.taskUrl})\n`
      )

      task.unresolvedTestDetails.forEach((detail) => {
        const raw = detail.name.replace(/^\[.*?]\s*/, '')
        const clean = raw
          ? raw.charAt(0).toUpperCase() + raw.slice(1)
          : 'Без названия'

        lines.push(`   • 🔍 [${clean}](${detail.link})`)
      })

      if (idx < bugs.length - 1) {
        lines.push('')
      }
    })
  }

  // Если ни багов, ни ревью
  if (lines.length === 1) {
    lines.push(
      '🎉 На данный момент нет ни ревью, ни багов — можно спокойно заниматься своими задачами!'
    )
  }

  return lines.join('\n')
}
