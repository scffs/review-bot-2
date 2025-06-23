import { eq } from 'drizzle-orm'

import type { Tx } from '@database'

import type { UserRepository } from './repository.ts'
import { users } from './schema.ts'
import type {
  InsertUser,
  User,
  UserGitlabId,
  UserId,
  UserTelegramId,
  UserWeeekId,
  UserWithVacancies
} from './type'

/**
 * Получить пользователя по ID с вакансиями
 */
export async function getById(
  this: UserRepository,
  userId: UserId,
  tx?: Tx
): Promise<UserWithVacancies | undefined> {
  const executor = tx ?? this.db
  const result = await executor.query.users.findFirst({
    where: eq(users.id, userId),
    with: { vacancy: true }
  })

  if (!result) {
    return undefined
  }

  return {
    ...result,
    vacancy: result.vacancy.map((uv) => uv.vacancy)
  }
}

/**
 * Получить пользователя по Weeek ID
 */
export async function getByWeeekId(
  this: UserRepository,
  userWeeekId: UserWeeekId,
  tx?: Tx
): Promise<User | undefined> {
  const executor = tx ?? this.db
  return executor.query.users.findFirst({
    where: eq(users.weeekId, userWeeekId)
  })
}

/**
 * Получить всех пользователей с опциональной пагинацией
 */
export async function findAll(
  this: UserRepository,
  limit?: number,
  offset?: number,
  tx?: Tx
): Promise<User[]> {
  const executor = tx ?? this.db
  return executor.query.users.findMany({
    limit: limit != null && limit >= 0 ? limit : undefined,
    offset: offset != null && offset >= 0 ? offset : undefined
  })
}

/**
 * Подсчитать всех пользователей
 */
export async function count(this: UserRepository, tx?: Tx): Promise<number> {
  const executor = tx ?? this.db
  const rows = await executor.query.users.findMany({
    columns: { id: true }
  })
  return rows.length
}

/**
 * Получить пользователя по Telegram ID с вакансиями
 */
export async function getByTelegramId(
  this: UserRepository,
  userTelegramId: UserTelegramId,
  tx?: Tx
): Promise<UserWithVacancies | undefined> {
  const executor = tx ?? this.db
  const result = await executor.query.users.findFirst({
    where: eq(users.telegramId, userTelegramId),
    with: { vacancy: true }
  })

  if (!result) {
    return undefined
  }

  return {
    ...result,
    vacancy: result.vacancy.map((uv) => uv.vacancy)
  }
}

/**
 * Получить пользователя по Telegram ID с вакансиями
 */
export async function getByTelegramUserName(
  this: UserRepository,
  telegramUsername: string,
  tx?: Tx
): Promise<UserWithVacancies | undefined> {
  const executor = tx ?? this.db
  const result = await executor.query.users.findFirst({
    where: eq(users.telegramUsername, telegramUsername),
    with: { vacancy: true }
  })

  if (!result) {
    return undefined
  }

  return {
    ...result,
    vacancy: result.vacancy.map((uv) => uv.vacancy)
  }
}

/**
 * Получить пользователя по GitLab ID
 */
export async function getByGitlabId(
  this: UserRepository,
  userGitLabId: UserGitlabId,
  tx?: Tx
): Promise<User | undefined> {
  const executor = tx ?? this.db
  return executor.query.users.findFirst({
    where: eq(users.gitlabId, userGitLabId)
  })
}

/**
 * Создать нового пользователя
 */
export async function create(
  this: UserRepository,
  user: InsertUser,
  tx?: Tx
): Promise<User> {
  const executor = tx ?? this.db
  const [newUser] = await executor.insert(users).values(user).returning()
  return newUser
}

/**
 * Обновить пользователя
 */
export async function update(
  this: UserRepository,
  userId: UserId,
  userData: Partial<Omit<User, 'id'>>,
  tx?: Tx
): Promise<User> {
  const executor = tx ?? this.db
  const [updatedUser] = await executor
    .update(users)
    .set(userData)
    .where(eq(users.id, userId))
    .returning()
  return updatedUser
}

/**
 * Удалить пользователя по ID
 */
export async function deleteUser(
  this: UserRepository,
  userId: UserId,
  tx?: Tx
): Promise<void> {
  const executor = tx ?? this.db
  await executor.delete(users).where(eq(users.id, userId))
}

/**
 * Получить только поле gitlabId по внутреннему users.id
 */
export async function getGitlabIdById(
  this: UserRepository,
  userId: number,
  tx?: Tx
): Promise<number | undefined> {
  const executor = tx ?? this.db
  const result = await executor.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { gitlabId: true }
  })

  return result?.gitlabId
}
