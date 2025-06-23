import type { GitLabService } from '../gitlabService.ts'

import { CONFIG } from '@config'
import { logger } from '@utils'

interface MrStats {
  /**
   * Время от создания MR до мерджа
   */
  duration: {
    days: number
    hours: number
    minutes: number
    seconds: number
  }
  /**
   * Сколько файлов поменяно в MR
   */
  changedFilesCount: number
  /**
   * Всего добавлено строк
   */
  additions: number
  /**
   * Всего удалено строк
   */
  deletions: number
  /**
   * Сколько коммитов в MR
   */
  commitCount: number
}

export async function getMrSummaryStats(
  this: GitLabService,
  mergeRequestId: number
): Promise<MrStats> {
  // 1) Берём полный объект MR
  const mr = await this.api.MergeRequests.show(
    CONFIG.gitlab.projectId,
    mergeRequestId
  )

  // 2) Вычисляем дельту времени
  const created = new Date(mr.created_at)
  const merged = new Date(mr.merged_at ?? Date.now())
  const diffMs = merged.getTime() - created.getTime()

  const days = Math.floor(diffMs / 86_400_000)
  const hours = Math.floor((diffMs % 86_400_000) / 3_600_000)
  const minutes = Math.floor((diffMs % 3_600_000) / 60_000)
  const seconds = Math.floor((diffMs % 60_000) / 1000)

  const diffs = await this.api.MergeRequests.allDiffs(
    CONFIG.gitlab.projectId,
    mergeRequestId
  )

  const changedFilesCount = diffs.length

  // 4) Парсим unified‑diff, чтобы посчитать добавления/удаления
  let additions = 0
  let deletions = 0
  for (const ch of diffs) {
    for (const line of ch.diff.split('\n')) {
      if (line.startsWith('+') && !line.startsWith('+++')) additions++
      if (line.startsWith('-') && !line.startsWith('---')) deletions++
    }
  }

  // 5) Количество коммитов в MR
  const commits = await this.api.MergeRequests.allCommits(
    CONFIG.gitlab.projectId,
    mergeRequestId
  )
  const commitCount = commits.length

  logger.debug({ commitCount, deletions, additions }, 'mr code data')
  return {
    duration: { days, hours, minutes, seconds },
    changedFilesCount,
    additions,
    deletions,
    commitCount
  }
}
