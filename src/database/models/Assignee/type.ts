import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'

import type { assignees } from './schema'

export type Assignee = InferSelectModel<typeof assignees>
export type InsertAssignee = InferInsertModel<typeof assignees>
