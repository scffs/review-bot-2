import { relations } from 'drizzle-orm'
import { integer, pgTable, unique } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'

import { tags } from '../Tag'
import { tasks } from '../Task'

export const taskTags = pgTable(
  'task_tags',
  {
    taskId: integer('task_id')
      .notNull()
      .references(() => tasks.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    tagId: integer('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'restrict', onUpdate: 'cascade' })
  },
  (table) => [unique().on(table.taskId, table.tagId)]
)

export const taskTagsRelations = relations(taskTags, ({ one }) => ({
  task: one(tasks, {
    fields: [taskTags.taskId],
    references: [tasks.id]
  }),
  tag: one(tags, {
    fields: [taskTags.tagId],
    references: [tags.id]
  })
}))

export const taskTagInsertSchema = createInsertSchema(taskTags)
