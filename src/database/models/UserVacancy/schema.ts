import { relations } from 'drizzle-orm'
import { integer, pgEnum, pgTable, unique } from 'drizzle-orm/pg-core'
import { z } from 'zod'

import { users } from '../User'

export const userVacancySchema = z.enum([
  'Frontend',
  'Backend',
  'DevOps',
  'Project Manager',
  'Pixi',
  'Fullstack',
  'Docs',
  'Technical Director'
])

export const vacancyEnum = pgEnum('vacancy', [
  'Frontend',
  'Backend',
  'DevOps',
  'Project Manager',
  'Pixi',
  'Fullstack',
  'Docs',
  'Technical Director'
])

export const userVacancies = pgTable(
  'user_vacancies',
  {
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' })
      .notNull(),
    vacancy: vacancyEnum('vacancy').notNull()
  },
  (table) => [unique().on(table.userId, table.vacancy)]
)

export const userVacanciesRelations = relations(userVacancies, ({ one }) => ({
  user: one(users, {
    fields: [userVacancies.userId],
    references: [users.id]
  })
}))
