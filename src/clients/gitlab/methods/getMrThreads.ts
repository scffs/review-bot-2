import type { DiscussionSchema } from '@gitbeaker/rest'

import { CONFIG } from '@config'

import type { GitLabService } from '../index.ts'

/**
 * Получение всех обсуждений (threads) для Merge Request.
 * Метод делает запрос к GitLab API для получения всех обсуждений,
 * связанных с указанным Merge Request.
 *
 * @param mergeRequestId - ID Merge Request
 * @returns Promise, разрешающийся в массив обсуждений для указанного Merge Request
 */
export async function getMrThreads(
  this: GitLabService,
  mergeRequestId: number
): Promise<DiscussionSchema[]> {
  return this.api.MergeRequestDiscussions.all(
    CONFIG.gitlab.projectId,
    mergeRequestId
  )
}
