import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'

import type { testDetails } from './schema.ts'

export type TestDetail = InferSelectModel<typeof testDetails>
export type TestDetailInsert = InferInsertModel<typeof testDetails>
export type TestId = TestDetail['testId']
