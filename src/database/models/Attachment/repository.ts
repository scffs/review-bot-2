import type { DbType } from '@database'

import {
  create,
  deleteById,
  deleteByTaskId,
  findOrphaned,
  getAllLocalPaths,
  getByTaskId
} from './methods'

/**
 * @description Repository for working with Attachment model
 */
export class AttachmentRepository {
  constructor(protected db: DbType) {
    this.db = db
  }

  getByTaskId = getByTaskId
  create = create
  deleteByTaskId = deleteByTaskId
  findOrphaned = findOrphaned
  getAllLocalPaths = getAllLocalPaths
  deleteById = deleteById
}
