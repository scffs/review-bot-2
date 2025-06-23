import type { DbType } from '@database'

import {
  createTest,
  deleteTestsByTaskId,
  getByTaskId,
  getWithDetailsByTaskId,
  updateTest
} from './methods'

/**
 * @description Repository for working with Test model
 */
export class TestRepository {
  constructor(protected db: DbType) {
    this.db = db
  }

  getByTaskId = getByTaskId
  create = createTest
  update = updateTest
  deleteByTaskId = deleteTestsByTaskId
  getWithDetailsByTaskId = getWithDetailsByTaskId
}
