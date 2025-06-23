import { relations } from 'drizzle-orm'
import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'

import { tasks } from '../Task'

export const taskMessages = pgTable('task_messages', {
  id: serial('id').primaryKey(),
  messageId: integer('message_id').unique().notNull(), // ID сообщения в Telegram
  type: varchar('type', { enum: ['photo', 'video'] }).notNull(), // Тип медиа
  taskId: integer('task_id')
    .notNull()
    .references(() => tasks.id, { onDelete: 'cascade', onUpdate: 'cascade' })
})

export const taskMessagesRelations = relations(taskMessages, ({ one }) => ({
  task: one(tasks, {
    fields: [taskMessages.taskId],
    references: [tasks.id]
  })
}))

export const taskMessageInsertSchema = createInsertSchema(taskMessages)
