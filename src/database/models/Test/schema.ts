import { relations, sql } from 'drizzle-orm'
import { boolean, integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core'
import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

import { tasks } from '../Task'
import { testDetailSchema, testDetails } from '../TestDetail'

export const tests = pgTable('tests', {
  id: serial('id').primaryKey(),
  total: integer('total').notNull().default(0),
  taskUrl: varchar('task_url', { length: 255 }).default(sql`NULL`),
  isNeeded: boolean('is_needed').default(false).notNull(),
  isStarted: boolean('is_started').default(false).notNull(),
  isCompleted: boolean('is_completed').default(false).notNull(),

  taskId: integer('task_id')
    .references(() => tasks.id, { onDelete: 'cascade', onUpdate: 'cascade' })
    .notNull()
})

export const testsRelations = relations(tests, ({ one, many }) => ({
  task: one(tasks, {
    fields: [tests.taskId],
    references: [tasks.id]
  }),
  testDetails: many(testDetails)
}))

export const testsSchema = createSelectSchema(tests)
  .omit({ id: true, taskId: true })
  .extend({
    // todo: check this
    unresolved: testDetailSchema.array().nullable(),
    taskUrl: z.string().url().nullable()
  })
