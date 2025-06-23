import { relations } from 'drizzle-orm'
import { boolean, integer, pgTable, serial } from 'drizzle-orm/pg-core'

import { mrReviews } from '../MrReview'
import { users } from '../User'

export const mrReviewers = pgTable('mr_reviewers', {
  id: serial('id').primaryKey(),
  isApproved: boolean('is_approved').default(false).notNull(),
  mrReviewId: integer('mr_review_id')
    .notNull()
    .references(() => mrReviews.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade'
    }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' })
})

export const mrReviewersRelations = relations(mrReviewers, ({ one }) => ({
  mrReview: one(mrReviews, {
    fields: [mrReviewers.mrReviewId],
    references: [mrReviews.id]
  }),
  user: one(users, {
    fields: [mrReviewers.userId],
    references: [users.id]
  })
}))
