import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'

import type { Vacancy } from '../UserVacancy'

import type { users } from './schema'

export type User = InferSelectModel<typeof users>
export type InsertUser = InferInsertModel<typeof users>
export type UserId = User['id']
export type UserWeeekId = User['weeekId']
export type UserGitlabId = User['gitlabId']
export type UserTelegramId = User['telegramId']

export interface UserWithVacancies extends User {
  vacancy: Vacancy[]
}
