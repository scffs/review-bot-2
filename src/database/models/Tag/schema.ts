import { relations } from 'drizzle-orm'
import { integer, pgEnum, pgTable, serial, unique } from 'drizzle-orm/pg-core'

import { taskTags } from '../TaskTag'

export const tagTypePgEnum = pgEnum('tag_type', [
  'Fullstack',
  'DevOps',
  'Backend',
  'Frontend',
  'Pixi',
  'Docs',
  'Emergency',
  'WithoutTesting',
  'WithoutMediaTesting',
  'TLReview',
  'Bug'
])

export const tags = pgTable(
  'tags',
  {
    id: serial('id').primaryKey(),
    type: tagTypePgEnum('type').notNull().unique(),
    weeekId: integer('weeek_id').unique()
  },
  (table) => [unique().on(table.weeekId, table.type)]
)

export const tagsRelations = relations(tags, ({ many }) => ({
  taskTags: many(taskTags)
}))
