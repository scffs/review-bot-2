import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'

import type { reviewStats } from './schema.ts'

export type ReviewStat = InferSelectModel<typeof reviewStats>
export type InsertReviewStat = InferInsertModel<typeof reviewStats>
