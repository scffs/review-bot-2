import { relations } from 'drizzle-orm'
import { integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core'

import { tasks } from '../Task'

export const attachments = pgTable('attachments', {
  id: serial('id').primaryKey(),
  originalUrl: varchar('original_url', { length: 255 }).notNull(),
  type: varchar('type', { enum: ['image', 'video'], length: 255 }).notNull(),
  localPath: text('local_path').notNull().unique(),
  taskId: integer('task_id')
    .notNull()
    .references(() => tasks.id, { onDelete: 'cascade', onUpdate: 'cascade' })
})

export const attachmentsRelations = relations(attachments, ({ one }) => ({
  task: one(tasks, {
    fields: [attachments.taskId],
    references: [tasks.id]
  })
}))
