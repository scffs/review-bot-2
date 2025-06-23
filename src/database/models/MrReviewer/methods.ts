import { and, eq } from 'drizzle-orm'

import type { Tx } from '@database'

import type { MrReviewerRepository } from './repository'
import { mrReviewers } from './schema'
import type { MrReviewer, MrReviewerId } from './type'

/**
 * Создает нового ревьюера для MR
 */
export async function create(
  this: MrReviewerRepository,
  data: Omit<MrReviewer, 'id'>,
  tx?: Tx
): Promise<MrReviewer> {
  const executor = tx ?? this.db
  const [newReviewer] = await executor
    .insert(mrReviewers)
    .values(data)
    .returning()
  return newReviewer
}

/**
 * Получает всех ревьюеров по MR-ревью
 */
export async function findByMrReviewId(
  this: MrReviewerRepository,
  mrReviewId: number,
  tx?: Tx
): Promise<MrReviewer[]> {
  const executor = tx ?? this.db
  return executor.query.mrReviewers.findMany({
    where: eq(mrReviewers.mrReviewId, mrReviewId)
  })
}

/**
 * Удаляет всех ревьюеров по MR-ревью
 */
export async function deleteByMrReviewId(
  this: MrReviewerRepository,
  mrReviewId: number,
  tx?: Tx
): Promise<void> {
  const executor = tx ?? this.db
  await executor
    .delete(mrReviewers)
    .where(eq(mrReviewers.mrReviewId, mrReviewId))
}

/**
 * Обновляет данные ревьюера
 */
export async function update(
  this: MrReviewerRepository,
  id: MrReviewerId,
  data: Partial<Omit<MrReviewer, 'id'>>,
  tx?: Tx
): Promise<MrReviewer> {
  const executor = tx ?? this.db
  const [updatedReviewer] = await executor
    .update(mrReviewers)
    .set(data)
    .where(eq(mrReviewers.id, id))
    .returning()
  return updatedReviewer
}

/**
 * Получает невыполненных (неодобренных) ревьюеров по MR-ревью
 */
export async function findUnresolvedByMrReviewId(
  this: MrReviewerRepository,
  mrReviewId: number,
  tx?: Tx
): Promise<MrReviewer[]> {
  const executor = tx ?? this.db
  return executor.query.mrReviewers.findMany({
    where: and(
      eq(mrReviewers.mrReviewId, mrReviewId),
      eq(mrReviewers.isApproved, false)
    )
  })
}

/**
 * Находит ревьюера по MR-ревью и пользователю
 */
export async function findByMrReviewIdAndUserId(
  this: MrReviewerRepository,
  mrReviewId: number,
  userId: number,
  tx?: Tx
) {
  const executor = tx ?? this.db
  return executor.query.mrReviewers.findFirst({
    where: and(
      eq(mrReviewers.mrReviewId, mrReviewId),
      eq(mrReviewers.userId, userId)
    )
  })
}
