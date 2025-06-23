import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'

import type { attachments } from './schema.ts'

export type Attachment = InferSelectModel<typeof attachments>
export type InsertAttachment = InferInsertModel<typeof attachments>
