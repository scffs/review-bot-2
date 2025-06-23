import type { DbType } from '@database'

import {
  create,
  deleteByMrReviewId,
  getAllComments,
  getByMrReviewAndUser,
  getByMrReviewId,
  getTopCommentsTask,
  update
} from './methods'

/**
 * @description Repository for working with ReviewStat model
 */
export class ReviewStatRepository {
  constructor(protected db: DbType) {
    this.db = db
  }

  getByMrReviewAndUser = getByMrReviewAndUser
  getByMrReviewId = getByMrReviewId
  create = create
  update = update
  deleteByMrReviewId = deleteByMrReviewId
  getTopCommentsTask = getTopCommentsTask
  getAllComments = getAllComments
}
