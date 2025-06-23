import type { InferSelectModel } from 'drizzle-orm'

import type { mrReviewers } from './schema.ts'

export type MrReviewer = InferSelectModel<typeof mrReviewers>
export type MrReviewerId = MrReviewer['id']
