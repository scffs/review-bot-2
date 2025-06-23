import type { DbType } from '@database'

import {
  createMrReview,
  deleteMrReviewsByTaskId,
  getByTaskId,
  getStatsForAllTime,
  getTopAdditionsTask,
  getTopChangedFilesTask,
  getTopDeletionsTask,
  getWithRelatedDataByTaskId,
  updateMrReview
} from './methods'

/**
 * @description Repository for working with MrReview model
 */
export class MrReviewRepository {
  constructor(protected db: DbType) {
    this.db = db
  }

  getByTaskId = getByTaskId
  create = createMrReview
  update = updateMrReview
  deleteByTaskId = deleteMrReviewsByTaskId
  getWithRelatedData = getWithRelatedDataByTaskId

  /**
   * Статистика
   */
  getTopAdditionsTask = getTopAdditionsTask
  getStatsForAllTime = getStatsForAllTime
  getTopDeletionsTask = getTopDeletionsTask
  getTopChangedFilesTask = getTopChangedFilesTask
}
