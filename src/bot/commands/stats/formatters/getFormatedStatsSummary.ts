import {formatDuration, formatWord} from '@utils'

import type { UserStats } from '../types'

export function getFormatedStatsSummary(stats: UserStats): string {
  const lines: string[] = []

  const {
    totalComments,
    totalBugsResolved,
    totalAdditions,
    totalDeletions,
    totalFilesChanged,
    longestTaskDurationSeconds,

    topCommentTask,
    topBugTask,
    topAdditionsTask,
    topDeletionsTask,
    topFilesChangedTask
  } = stats

  if (totalComments > 0) {
    lines.push(`💬 Ты оставил **${totalComments}** ${formatWord(totalComments, 'комментарий', 'комментария', 'комментариев')}`)
    if (topCommentTask?.taskUrl) {
      lines.push(
        `🔝 Больше всего обсуждений — в задаче [#${topCommentTask.taskId}](${topCommentTask.taskUrl}) 😄`
      )
    }
  }

  if (totalBugsResolved > 0) {
    lines.push(
      `\n🪲 Уничтожено **${totalBugsResolved}** баг${totalBugsResolved > 1 ? 'ов' : ''}!`
    )
    if (topBugTask?.taskUrl) {
      lines.push(
        `🔧 Самая багованная задача — [#${topBugTask.taskId}](${topBugTask.taskUrl}) 🛠`
      )
    }
  }

  if (totalAdditions + totalDeletions > 0) {
    lines.push(
      `\n➕➖ Ты поколдовал над кодом: **${totalAdditions}** строк добавлено, **${totalDeletions}** удалено!`
    )
    if (topAdditionsTask?.taskUrl) {
      lines.push(
        `📈 Больше всего строк в [#${topAdditionsTask.taskId}](${topAdditionsTask.taskUrl}) 🚀`
      )
    }
    if (topDeletionsTask?.taskUrl) {
      lines.push(
        `📉 А вот и большая чистка — [#${topDeletionsTask.taskId}](${topDeletionsTask.taskUrl}) 🧹`
      )
    }
  }

  if (totalFilesChanged > 0) {
    lines.push(`\n📂 Затронуто **${totalFilesChanged}** файлов`)
    if (topFilesChangedTask?.taskUrl) {
      lines.push(
        `🗂 Больше всего изменений — в [#${topFilesChangedTask.taskId}](${topFilesChangedTask.taskUrl})`
      )
    }
  }

  if (longestTaskDurationSeconds > 0) {
    lines.push(
      `\n⏱ Самая длительная задача: **${formatDuration(longestTaskDurationSeconds)}** — ты не сдался, молодец! 🏁`
    )
  }

  if (lines.length === 0) {
    return '📭 Пока статистика пуста... Но всё впереди! Самое время проявить себя 💪'
  }

  return lines.join('\n')
}
