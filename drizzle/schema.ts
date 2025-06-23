import { sql } from 'drizzle-orm'
import {
  bigint,
  boolean,
  foreignKey,
  integer,
  pgEnum,
  pgTable,
  serial,
  smallint,
  text,
  timestamp,
  unique,
  varchar
} from 'drizzle-orm/pg-core'

export const role = pgEnum('role', ['admin', 'user', 'manager'])
export const tagType = pgEnum('tag_type', [
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
export const vacancy = pgEnum('vacancy', [
  'Frontend',
  'Backend',
  'DevOps',
  'Project Manager',
  'Pixi',
  'Fullstack',
  'Docs',
  'Technical Director'
])

export const mrReviews = pgTable(
  'mr_reviews',
  {
    id: serial().primaryKey().notNull(),
    totalComments: smallint('total_comments').default(0).notNull(),
    unresolvedComments: smallint('unresolved_comments').default(0).notNull(),
    totalReviewers: smallint('total_reviewers').default(0).notNull(),
    branchBehindBy: smallint('branch_behind_by').default(0).notNull(),
    hasConflicts: boolean('has_conflicts').default(false).notNull(),
    changedFilesCount: smallint('changed_files_count').default(0).notNull(),
    additions: integer().default(0).notNull(),
    deletions: integer().default(0).notNull(),
    durationSeconds: integer('duration_seconds').default(0).notNull(),
    taskId: integer('task_id').notNull()
  },
  (table) => [
    foreignKey({
      columns: [table.taskId],
      foreignColumns: [tasks.id],
      name: 'mr_reviews_task_id_tasks_id_fk'
    })
      .onUpdate('cascade')
      .onDelete('cascade')
  ]
)

export const attachments = pgTable(
  'attachments',
  {
    id: serial().primaryKey().notNull(),
    originalUrl: varchar('original_url', { length: 255 }).notNull(),
    type: varchar().notNull(),
    localPath: text('local_path').notNull(),
    taskId: integer('task_id').notNull()
  },
  (table) => [
    foreignKey({
      columns: [table.taskId],
      foreignColumns: [tasks.id],
      name: 'attachments_task_id_tasks_id_fk'
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    unique('attachments_local_path_unique').on(table.localPath)
  ]
)

export const taskTags = pgTable(
  'task_tags',
  {
    taskId: integer('task_id').notNull(),
    tagId: integer('tag_id').notNull()
  },
  (table) => [
    foreignKey({
      columns: [table.taskId],
      foreignColumns: [tasks.id],
      name: 'task_tags_task_id_tasks_id_fk'
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.tagId],
      foreignColumns: [tags.id],
      name: 'task_tags_tag_id_tags_id_fk'
    })
      .onUpdate('cascade')
      .onDelete('restrict'),
    unique('task_tags_task_id_tag_id_unique').on(table.taskId, table.tagId)
  ]
)

export const reviewStats = pgTable(
  'review_stats',
  {
    id: serial().primaryKey().notNull(),
    mrReviewId: integer('mr_review_id').notNull(),
    userId: integer('user_id').notNull(),
    commentsCount: integer('comments_count').default(0).notNull(),
    createdAt: timestamp('created_at', { mode: 'string' })
      .defaultNow()
      .notNull()
  },
  (table) => [
    foreignKey({
      columns: [table.mrReviewId],
      foreignColumns: [mrReviews.id],
      name: 'review_stats_mr_review_id_mr_reviews_id_fk'
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.gitlabId],
      name: 'review_stats_user_id_users_gitlab_id_fk'
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    unique('review_stats_mr_review_id_user_id_unique').on(
      table.mrReviewId,
      table.userId
    )
  ]
)

export const taskMessages = pgTable(
  'task_messages',
  {
    id: serial().primaryKey().notNull(),
    messageId: integer('message_id').notNull(),
    type: varchar().notNull(),
    taskId: integer('task_id').notNull()
  },
  (table) => [
    foreignKey({
      columns: [table.taskId],
      foreignColumns: [tasks.id],
      name: 'task_messages_task_id_tasks_id_fk'
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    unique('task_messages_message_id_unique').on(table.messageId)
  ]
)

export const tags = pgTable(
  'tags',
  {
    id: serial().primaryKey().notNull(),
    type: tagType().notNull(),
    weeekId: integer('weeek_id')
  },
  (table) => [
    unique('tags_type_unique').on(table.type),
    unique('tags_weeek_id_type_unique').on(table.type, table.weeekId),
    unique('tags_weeek_id_unique').on(table.weeekId)
  ]
)

export const mrComments = pgTable(
  'mr_comments',
  {
    id: serial().primaryKey().notNull(),
    commentId: integer('comment_id').notNull(),
    commentLink: varchar('comment_link', { length: 255 }).notNull(),
    assignedUserId: integer('assigned_user_id').notNull(),
    mrReviewId: integer('mr_review_id').notNull()
  },
  (table) => [
    foreignKey({
      columns: [table.assignedUserId],
      foreignColumns: [users.id],
      name: 'mr_comments_assigned_user_id_users_id_fk'
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.mrReviewId],
      foreignColumns: [mrReviews.id],
      name: 'mr_comments_mr_review_id_mr_reviews_id_fk'
    })
      .onUpdate('cascade')
      .onDelete('cascade')
  ]
)

export const mrCommentedUsers = pgTable(
  'mr_commented_users',
  {
    id: serial().primaryKey().notNull(),
    mrReviewId: integer('mr_review_id').notNull(),
    userId: integer('user_id').notNull()
  },
  (table) => [
    foreignKey({
      columns: [table.mrReviewId],
      foreignColumns: [mrReviews.id],
      name: 'mr_commented_users_mr_review_id_mr_reviews_id_fk'
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'mr_commented_users_user_id_users_id_fk'
    })
      .onUpdate('cascade')
      .onDelete('cascade')
  ]
)

export const mrReviewers = pgTable(
  'mr_reviewers',
  {
    id: serial().primaryKey().notNull(),
    isApproved: boolean('is_approved').default(false).notNull(),
    mrReviewId: integer('mr_review_id').notNull(),
    userId: integer('user_id').notNull()
  },
  (table) => [
    foreignKey({
      columns: [table.mrReviewId],
      foreignColumns: [mrReviews.id],
      name: 'mr_reviewers_mr_review_id_mr_reviews_id_fk'
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'mr_reviewers_user_id_users_id_fk'
    })
      .onUpdate('cascade')
      .onDelete('cascade')
  ]
)

export const tests = pgTable(
  'tests',
  {
    id: serial().primaryKey().notNull(),
    total: integer().default(0).notNull(),
    taskUrl: varchar('task_url', { length: 255 }).default(sql`NULL`),
    isNeeded: boolean('is_needed').default(false).notNull(),
    isStarted: boolean('is_started').default(false).notNull(),
    isCompleted: boolean('is_completed').default(false).notNull(),
    taskId: integer('task_id').notNull()
  },
  (table) => [
    foreignKey({
      columns: [table.taskId],
      foreignColumns: [tasks.id],
      name: 'tests_task_id_tasks_id_fk'
    })
      .onUpdate('cascade')
      .onDelete('cascade')
  ]
)

export const testDetail = pgTable(
  'test_detail',
  {
    id: serial().primaryKey().notNull(),
    name: varchar({ length: 255 }).notNull(),
    link: varchar({ length: 255 }).notNull(),
    isCompleted: boolean('is_completed').notNull(),
    testId: integer('test_id').notNull()
  },
  (table) => [
    foreignKey({
      columns: [table.testId],
      foreignColumns: [tests.id],
      name: 'test_detail_test_id_tests_id_fk'
    })
      .onUpdate('cascade')
      .onDelete('cascade')
  ]
)

export const users = pgTable(
  'users',
  {
    id: serial().primaryKey().notNull(),
    name: varchar({ length: 255 }).notNull(),
    lastName: varchar('last_name', { length: 255 }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    telegramId: bigint('telegram_id', { mode: 'number' }).notNull(),
    telegramUsername: varchar('telegram_username', { length: 32 }).notNull(),
    gitlabId: integer('gitlab_id').notNull(),
    weeekId: varchar('weeek_id').notNull(),
    birthday: timestamp({ mode: 'string' }).notNull(),
    role: role().notNull()
  },
  (table) => [
    unique('users_telegram_id_unique').on(table.telegramId),
    unique('users_telegram_username_unique').on(table.telegramUsername),
    unique('users_gitlab_id_unique').on(table.gitlabId),
    unique('users_weeek_id_unique').on(table.weeekId)
  ]
)

export const userVacancies = pgTable(
  'user_vacancies',
  {
    userId: integer('user_id').notNull(),
    vacancy: vacancy().notNull()
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'user_vacancies_user_id_users_id_fk'
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    unique('user_vacancies_user_id_vacancy_unique').on(
      table.userId,
      table.vacancy
    )
  ]
)

export const tasks = pgTable(
  'tasks',
  {
    id: serial().primaryKey().notNull(),
    title: varchar({ length: 255 }).notNull(),
    weeekId: integer('weeek_id').notNull(),
    mrId: integer('mr_id'),
    mrUrl: varchar('mr_url', { length: 255 }),
    taskUrl: varchar('task_url', { length: 255 }),
    isEmergency: boolean('is_emergency').default(false).notNull(),
    messageCaption: text('message_caption').notNull(),
    createdAt: timestamp('created_at', { mode: 'string' }),
    isCompleted: boolean('is_completed').default(false).notNull(),
    completedAt: timestamp('completed_at', { mode: 'string' })
  },
  (table) => [unique('tasks_weeek_id_unique').on(table.weeekId)]
)

export const assignees = pgTable(
  'assignees',
  {
    id: serial().primaryKey().notNull(),
    taskId: integer('task_id').notNull(),
    userId: integer('user_id').notNull()
  },
  (table) => [
    foreignKey({
      columns: [table.taskId],
      foreignColumns: [tasks.id],
      name: 'assignees_task_id_tasks_id_fk'
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'assignees_user_id_users_id_fk'
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    unique('assignees_task_id_user_id_unique').on(table.taskId, table.userId)
  ]
)
