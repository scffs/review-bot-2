import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'

import type { taskMessages } from './schema.ts'

export type TaskMessage = InferSelectModel<typeof taskMessages>
export type InsertTaskMessage = InferInsertModel<typeof taskMessages>
