import type { DbType } from '@database'

import {
  create,
  deleteAssignee,
  deleteByTaskId,
  getByTaskId,
  update
} from './methods'

/**
 * @description Репозиторий для работы с таблицей Assignees
 */
export class AssigneeRepository {
  constructor(protected db: DbType) {
    this.db = db
  }

  getByTaskId = getByTaskId

  create = create

  update = update

  delete = deleteAssignee

  deleteByTaskId = deleteByTaskId
}
