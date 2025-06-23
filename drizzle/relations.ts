import { relations } from 'drizzle-orm/relations'
import {
  assignees,
  attachments,
  mrCommentedUsers,
  mrComments,
  mrReviewers,
  mrReviews,
  reviewStats,
  tags,
  taskMessages,
  taskTags,
  tasks,
  testDetail,
  tests,
  userVacancies,
  users
} from './schema'

export const mrReviewsRelations = relations(mrReviews, ({ one, many }) => ({
  task: one(tasks, {
    fields: [mrReviews.taskId],
    references: [tasks.id]
  }),
  reviewStats: many(reviewStats),
  mrComments: many(mrComments),
  mrCommentedUsers: many(mrCommentedUsers),
  mrReviewers: many(mrReviewers)
}))

export const tasksRelations = relations(tasks, ({ many }) => ({
  mrReviews: many(mrReviews),
  attachments: many(attachments),
  taskTags: many(taskTags),
  taskMessages: many(taskMessages),
  tests: many(tests),
  assignees: many(assignees)
}))

export const attachmentsRelations = relations(attachments, ({ one }) => ({
  task: one(tasks, {
    fields: [attachments.taskId],
    references: [tasks.id]
  })
}))

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

export const tagsRelations = relations(tags, ({ many }) => ({
  taskTags: many(taskTags)
}))

export const reviewStatsRelations = relations(reviewStats, ({ one }) => ({
  mrReview: one(mrReviews, {
    fields: [reviewStats.mrReviewId],
    references: [mrReviews.id]
  }),
  user: one(users, {
    fields: [reviewStats.userId],
    references: [users.gitlabId]
  })
}))

export const usersRelations = relations(users, ({ many }) => ({
  reviewStats: many(reviewStats),
  mrComments: many(mrComments),
  mrCommentedUsers: many(mrCommentedUsers),
  mrReviewers: many(mrReviewers),
  userVacancies: many(userVacancies),
  assignees: many(assignees)
}))

export const taskMessagesRelations = relations(taskMessages, ({ one }) => ({
  task: one(tasks, {
    fields: [taskMessages.taskId],
    references: [tasks.id]
  })
}))

export const mrCommentsRelations = relations(mrComments, ({ one }) => ({
  user: one(users, {
    fields: [mrComments.assignedUserId],
    references: [users.id]
  }),
  mrReview: one(mrReviews, {
    fields: [mrComments.mrReviewId],
    references: [mrReviews.id]
  })
}))

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

export const testsRelations = relations(tests, ({ one, many }) => ({
  task: one(tasks, {
    fields: [tests.taskId],
    references: [tasks.id]
  }),
  testDetails: many(testDetail)
}))

export const testDetailRelations = relations(testDetail, ({ one }) => ({
  test: one(tests, {
    fields: [testDetail.testId],
    references: [tests.id]
  })
}))

export const userVacanciesRelations = relations(userVacancies, ({ one }) => ({
  user: one(users, {
    fields: [userVacancies.userId],
    references: [users.id]
  })
}))

export const assigneesRelations = relations(assignees, ({ one }) => ({
  task: one(tasks, {
    fields: [assignees.taskId],
    references: [tasks.id]
  }),
  user: one(users, {
    fields: [assignees.userId],
    references: [users.id]
  })
}))
