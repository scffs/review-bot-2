import { relations } from 'drizzle-orm'
import { integer, pgTable, serial, unique } from 'drizzle-orm/pg-core'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'

import { tasks } from '../Task'
import { users } from '../User'

export const assignees = pgTable(
  'assignees',
  {
    id: serial('id').primaryKey(),
    taskId: integer('task_id')
      .references(() => tasks.id, { onDelete: 'cascade', onUpdate: 'cascade' })
      .notNull(),
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' })
      .notNull()
  },
  (table) => [unique().on(table.taskId, table.userId)]
)

export const assigneesRelations = relations(assignees, ({ one }) => ({
  task: one(tasks, {
    fields: [assignees.taskId],
    references: [tasks.id]
  }),
  user: one(users, {
    fields: [assignees.userId],
    references: [users.id]
  })
}))

export const assigneeInsertSchema = createInsertSchema(assignees)
export const assigneeUpdateSchema = createUpdateSchema(assignees)
