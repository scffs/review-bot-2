import type { DbType } from '@database'

import {
  create,
  deleteTag,
  getByWeeekId,
  getTagByType,
  updateTag
} from './methods'

/**
 * @description Repository for working with Tag model
 */
export class TagRepository {
  constructor(protected db: DbType) {
    this.db = db
  }

  getByWeeekId = getByWeeekId
  getByType = getTagByType
  update = updateTag
  delete = deleteTag
  create = create
}
