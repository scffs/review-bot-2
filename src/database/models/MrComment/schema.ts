import { relations } from 'drizzle-orm'
import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core'
import { z } from 'zod'

import { mrReviews } from '../MrReview'
import { users } from '../User'

export const mrComments = pgTable('mr_comments', {
  id: serial('id').primaryKey(),
  commentId: integer('comment_id').notNull(),
  commentLink: varchar('comment_link', { length: 255 }).notNull(),
  assignedUserId: integer('assigned_user_id')
    .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' })
    .notNull(),
  mrReviewId: integer('mr_review_id')
    .references(() => mrReviews.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
    .notNull()
})

export const mrCommentsRelations = relations(mrComments, ({ one }) => ({
  mrReview: one(mrReviews, {
    fields: [mrComments.mrReviewId],
    references: [mrReviews.id]
  }),
  assignedUser: one(users, {
    fields: [mrComments.assignedUserId],
    references: [users.id]
  })
}))

export const mrCommentSchema = z.object({
  id: z.number(),
  link: z.string()
})
