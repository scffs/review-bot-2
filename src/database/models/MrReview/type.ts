import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'

import type { mrReviews } from './schema.ts'

export type MrReview = InferSelectModel<typeof mrReviews>
export type InsertMrReview = InferInsertModel<typeof mrReviews>
