import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'

import type { tests } from './schema.ts'

export type Test = InferSelectModel<typeof tests>
export type InsertTest = InferInsertModel<typeof tests>
export type TestWithRelation = Test & {
  testDetails: Array<{ name: string; link: string; isCompleted: boolean }>
}
