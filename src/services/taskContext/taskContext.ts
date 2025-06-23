import {
  getCurrentTaskFields,
  getTaskMedia,
  getTaskMessage,
  initialize
} from './methods'

import { taskFieldsSchema } from './schema.ts'

export class TaskContext {
  schema = taskFieldsSchema

  getTaskMessage = getTaskMessage
  initialize = initialize
  getTaskMedia = getTaskMedia
  getCurrentTaskFields = getCurrentTaskFields
}

export const taskContext = new TaskContext()
