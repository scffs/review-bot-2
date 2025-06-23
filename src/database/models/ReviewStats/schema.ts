import { relations } from 'drizzle-orm'
import {
  integer,
  pgTable,
  serial,
  timestamp,
  unique
} from 'drizzle-orm/pg-core'

import { mrReviews } from '../MrReview'
import { users } from '../User'

export const reviewStats = pgTable(
  'review_stats',
  {
    id: serial('id').primaryKey().notNull(),
    mrReviewId: integer('mr_review_id')
      .notNull()
      .references(() => mrReviews.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
      }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.gitlabId, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
      }),
    commentsCount: integer('comments_count').notNull().default(0),
    createdAt: timestamp('created_at', { mode: 'string' })
      .defaultNow()
      .notNull()
  },
  (table) => [unique().on(table.mrReviewId, table.userId)]
)

export const reviewStatsRelations = relations(reviewStats, ({ one }) => ({
  // Каждый reviewStat относится к одной записи в mr_reviews
  mrReview: one(mrReviews, {
    fields: [reviewStats.mrReviewId],
    references: [mrReviews.id]
  }),
  // Каждый reviewStat относится к одному пользователю
  user: one(users, {
    fields: [reviewStats.userId],
    references: [users.gitlabId]
  })
}))
