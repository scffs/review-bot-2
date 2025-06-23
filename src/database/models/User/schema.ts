import { relations } from 'drizzle-orm'
import {
  bigint,
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar
} from 'drizzle-orm/pg-core'
import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { assignees } from '../Assignee'
import { mrComments } from '../MrComment'
import { mrCommentedUsers } from '../MrCommentedUser'
import { mrReviewers } from '../MrReviewer'
import { userVacancies } from '../UserVacancy'

// Для БД
export const roleEnum = pgEnum('role', ['admin', 'user'])
// Для валидации в проекте
export const roleEnumZod = z.enum(['admin', 'user'])

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  telegramId: bigint('telegram_id', { mode: 'number' }).notNull().unique(),
  telegramUsername: varchar('telegram_username', { length: 32 })
    .notNull()
    .unique(),
  gitlabId: integer('gitlab_id').notNull().unique(),
  weeekId: varchar('weeek_id').notNull().unique(),
  birthday: timestamp('birthday').notNull(),
  role: roleEnum('role').notNull()
})

export const usersRelations = relations(users, ({ many }) => ({
  assignees: many(assignees),
  mrCommentedUsers: many(mrCommentedUsers),
  mrComments: many(mrComments),
  mrReviewers: many(mrReviewers),
  vacancy: many(userVacancies)
}))

// Для assignees / reviewers
export const userSchema = createSelectSchema(users)
  .pick({ gitlabId: true, weeekId: true, name: true })
  .extend({
    telegramLink: z.string().url(),
    vacancy: z.array(z.string())
  })
