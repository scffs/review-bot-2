import type { DbType } from '@database'
import { create, deleteByMrReviewId, findByMrReviewId } from './methods'

/**
 * @description Repository for working with MrCommentedUser model
 */
export class MrCommentedUserRepository {
  constructor(protected db: DbType) {
    this.db = db
  }

  create = create
  findByMrReviewId = findByMrReviewId
  deleteByMrReviewId = deleteByMrReviewId
}
