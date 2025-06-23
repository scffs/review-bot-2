import { relations } from 'drizzle-orm'
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar
} from 'drizzle-orm/pg-core'

import { assignees } from '../Assignee'
import { attachments } from '../Attachment'
import { mrReviews } from '../MrReview'
import { taskMessages } from '../TaskMessage'
import { taskTags } from '../TaskTag'
import { tests } from '../Test'

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  weeekId: integer('weeek_id').notNull().unique(),
  mrId: integer('mr_id'),
  mrUrl: varchar('mr_url', { length: 255 }),
  taskUrl: varchar('task_url', { length: 255 }),
  isEmergency: boolean('is_emergency').notNull().default(false),
  messageCaption: text('message_caption').notNull(),
  createdAt: timestamp('created_at'),
  isCompleted: boolean('is_completed').default(false).notNull(),
  completedAt: timestamp('completed_at')
})

export const tasksRelations = relations(tasks, ({ many }) => ({
  taskTags: many(taskTags),
  attachments: many(attachments),
  mrReviews: many(mrReviews),
  tests: many(tests),
  assignees: many(assignees),
  taskMessages: many(taskMessages)
}))
