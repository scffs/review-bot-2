import type { DbType } from '@database'

import {
  createTaskMessage,
  deleteTaskMessagesByTaskId,
  getByTaskId
} from './methods'

/**
 * @description Repository for working with TaskMessage model
 */
export class TaskMessageRepository {
  constructor(protected db: DbType) {
    this.db = db
  }

  getByTaskId = getByTaskId
  create = createTaskMessage
  deleteByTaskId = deleteTaskMessagesByTaskId
}
