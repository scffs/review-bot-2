import type { DbType } from '@database'

import { create, deleteByMrReviewId, findByMrReviewId, update } from './methods'

/**
 * @description Repository for working with MrComment model
 */
export class MrCommentRepository {
  constructor(protected db: DbType) {
    this.db = db
  }

  create = create
  findByMrReviewId = findByMrReviewId
  deleteByMrReviewId = deleteByMrReviewId
  update = update
}
