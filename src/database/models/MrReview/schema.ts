import {
  boolean,
  integer,
  pgTable,
  serial,
  smallint
} from 'drizzle-orm/pg-core'
import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

import { relations } from 'drizzle-orm'
import { mrCommentSchema, mrComments } from '../MrComment'
import { mrCommentedUsers } from '../MrCommentedUser'
import { mrReviewers } from '../MrReviewer'
import { tasks } from '../Task'
import { userSchema } from '../User'

export const mrReviews = pgTable('mr_reviews', {
  id: serial('id').primaryKey(),
  totalComments: smallint('total_comments').notNull().default(0),
  unresolvedComments: smallint('unresolved_comments').notNull().default(0),
  totalReviewers: smallint('total_reviewers').notNull().default(0),
  branchBehindBy: smallint('branch_behind_by').notNull().default(0),
  hasConflicts: boolean('has_conflicts').notNull().default(false),
  changedFilesCount: smallint('changed_files_count').default(0).notNull(),
  additions: integer('additions').default(0).notNull(),
  deletions: integer('deletions').default(0).notNull(),
  durationSeconds: integer('duration_seconds').default(0).notNull(),
  taskId: integer('task_id')
    .references(() => tasks.id, { onDelete: 'cascade', onUpdate: 'cascade' })
    .notNull()
})

export const mrReviewsRelations = relations(mrReviews, ({ one, many }) => ({
  task: one(tasks, {
    fields: [mrReviews.taskId],
    references: [tasks.id]
  }),
  reviewers: many(mrReviewers),
  comments: many(mrComments),
  commentedUsers: many(mrCommentedUsers)
}))

export const mrReviewSchema = createSelectSchema(mrReviews)
  .omit({
    id: true,
    taskId: true,
    totalComments: true,
    unresolvedComments: true,
    totalReviewers: true
  })
  .extend({
    branchBehindBy: z.number(), // Сколько коммитов отстает
    hasConflicts: z.boolean(), // Есть ли конфликты слияния
    comments: z.object({
      total: z.number(), // Общее количество комментариев
      unresolved: z.number(), // Количество неразрешённых комментариев
      actionsNeeded: z.array(
        // Массив действий, которые нужно выполнить
        z.object({
          assigned: userSchema, // Назначенный пользователь
          comments: z.array(mrCommentSchema).optional() // Массив комментариев
        })
      ),
      peopleCommented: z.array(userSchema) // Пользователи, которые оставили комментарии
    }),
    reviewers: z.object({
      total: z.number(), // Общее количество ревьюверов
      unresolved: z.array(
        // Массив ревьюверов, которые не ответили
        userSchema
      ),
      reviewNeeded: z.array(userSchema) // Ревьюверы, которые ещё должны пройти ревью
    })
  })
