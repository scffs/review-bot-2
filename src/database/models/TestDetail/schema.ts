import { relations } from 'drizzle-orm'
import { boolean, integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core'
import { createSelectSchema } from 'drizzle-zod'

import { tests } from '../Test'

export const testDetails = pgTable('test_detail', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  link: varchar('link', { length: 255 }).notNull(),
  isCompleted: boolean('is_completed').notNull(),
  testId: integer('test_id')
    .references(() => tests.id, { onDelete: 'cascade', onUpdate: 'cascade' })
    .notNull()
})

export const testDetailRelations = relations(testDetails, ({ one }) => ({
  test: one(tests, {
    fields: [testDetails.testId],
    references: [tests.id]
  })
}))

export const testDetailSchema = createSelectSchema(testDetails).omit({
  id: true,
  testId: true,
  isCompleted: true
})
