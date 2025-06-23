import { eq } from 'drizzle-orm'

import type { Tx, UserId } from '@database'

import type { UserVacancyRepository } from './repository'
import { userVacancies } from './schema'
import type { UserVacancy } from './type'
import type { InsertUserVacancy } from './type'

export async function findByUserId(
  this: UserVacancyRepository,
  userId: UserId,
  tx?: Tx
): Promise<UserVacancy[]> {
  const executor = tx ?? this.db
  return executor.query.userVacancies.findMany({
    where: eq(userVacancies.userId, userId)
  })
}

export async function create(
  this: UserVacancyRepository,
  data: InsertUserVacancy,
  tx?: Tx
): Promise<UserVacancy> {
  const executor = tx ?? this.db

  const [newUserVacancy] = await executor
    .insert(userVacancies)
    .values(data)
    .returning()

  return newUserVacancy
}
