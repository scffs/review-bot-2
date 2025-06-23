import type { DbType } from '@database'

import {
  create,
  deleteByTestId,
  findByTestId,
  getTopBugsTask,
  getTotalBugsResolved
} from './methods'

/**
 * @description Repository for working with TestDetailRepository model
 */
export class TestDetailRepository {
  constructor(protected db: DbType) {
    this.db = db
  }

  create = create
  findByTestId = findByTestId
  deleteByTestId = deleteByTestId
  getTopBugsTask = getTopBugsTask
  getTotalBugsResolved = getTotalBugsResolved
}
