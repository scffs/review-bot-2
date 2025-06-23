import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import type { z } from 'zod'

import {
  type userVacancies,
  type userVacancySchema,
  vacancyEnum
} from './schema'

export type UserVacancy = InferSelectModel<typeof userVacancies>
export type InsertUserVacancy = InferInsertModel<typeof userVacancies>

export type Vacancy = (typeof vacancyEnum.enumValues)[number]

export type Vacancies = z.infer<typeof userVacancySchema>

export const FrontendVacancy = [vacancyEnum.enumValues[0]]
