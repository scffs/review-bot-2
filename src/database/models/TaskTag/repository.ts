import type { DbType } from '@database'

import { createTaskTag, deleteTaskTagsByTaskId, getByTaskId } from './methods'

export class TaskTagRepository {
  constructor(protected db: DbType) {
    this.db = db
  }

  getByTaskId = getByTaskId
  create = createTaskTag
  deleteByTaskId = deleteTaskTagsByTaskId
}
