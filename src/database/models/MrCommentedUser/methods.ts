import { eq } from 'drizzle-orm'

import type { Tx } from '@database'

import type { MrCommentedUserRepository } from './repository'
import { mrCommentedUsers } from './schema'
import type { MrCommentedUser } from './type'

/**
 * Создает запись о пользователе, оставившем комментарий в MR-ревью
 */
export async function create(
  this: MrCommentedUserRepository,
  data: Omit<MrCommentedUser, 'id'>,
  tx?: Tx
): Promise<MrCommentedUser> {
  const executor = tx ?? this.db
  const [newCommentedUser] = await executor
    .insert(mrCommentedUsers)
    .values(data)
    .returning()
  return newCommentedUser
}

/**
 * Получает всех пользователей, оставивших комментарии для указанного MR-ревью
 */
export async function findByMrReviewId(
  this: MrCommentedUserRepository,
  mrReviewId: number,
  tx?: Tx
): Promise<MrCommentedUser[]> {
  const executor = tx ?? this.db
  return executor.query.mrCommentedUsers.findMany({
    where: eq(mrCommentedUsers.mrReviewId, mrReviewId)
  })
}

/**
 * Удаляет всех комментирующих пользователей для указанного MR-ревью
 */
export async function deleteByMrReviewId(
  this: MrCommentedUserRepository,
  mrReviewId: number,
  tx?: Tx
): Promise<void> {
  const executor = tx ?? this.db
  await executor
    .delete(mrCommentedUsers)
    .where(eq(mrCommentedUsers.mrReviewId, mrReviewId))
}
