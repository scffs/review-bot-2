import type { DbType } from '@database'

import {
  create,
  deleteByMrReviewId,
  findByMrReviewId,
  findByMrReviewIdAndUserId,
  findUnresolvedByMrReviewId,
  update
} from './methods'

/**
 * @description Repository for working with MrReviewer model
 */
export class MrReviewerRepository {
  constructor(protected db: DbType) {
    this.db = db
  }

  create = create
  update = update

  findByMrReviewId = findByMrReviewId
  deleteByMrReviewId = deleteByMrReviewId
  findUnresolvedByMrReviewId = findUnresolvedByMrReviewId
  findByMrReviewIdAndUserId = findByMrReviewIdAndUserId
}
