import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'

import type { taskTags } from './schema.ts'

export type TaskTag = InferSelectModel<typeof taskTags>
export type InsertTaskTag = InferInsertModel<typeof taskTags>
