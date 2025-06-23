import { relations } from 'drizzle-orm'
import { integer, pgTable, serial } from 'drizzle-orm/pg-core'

import { mrReviews } from '../MrReview'
import { users } from '../User'

export const mrCommentedUsers = pgTable('mr_commented_users', {
  id: serial('id').primaryKey(),
  mrReviewId: integer('mr_review_id')
    .references(() => mrReviews.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
    .notNull(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' })
    .notNull()
})

export const mrCommentedUsersRelations = relations(
  mrCommentedUsers,
  ({ one }) => ({
    mrReview: one(mrReviews, {
      fields: [mrCommentedUsers.mrReviewId],
      references: [mrReviews.id]
    }),
    user: one(users, {
      fields: [mrCommentedUsers.userId],
      references: [users.id]
    })
  })
)
