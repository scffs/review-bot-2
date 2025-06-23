import { and, eq } from 'drizzle-orm'

import type { Tx } from '@database'

import type { ReviewStatRepository } from '../repository.ts'
import { reviewStats } from '../schema.ts'
import type { InsertReviewStat, ReviewStat } from '../type.ts'

/**
 * Найти статистику по MR и пользователю
 */
export async function getByMrReviewAndUser(
  this: ReviewStatRepository,
  mrReviewId: number,
  userId: number,
  tx?: Tx
): Promise<ReviewStat | undefined> {
  const executor = tx ?? this.db
  return executor.query.reviewStats.findFirst({
    where: and(
      eq(reviewStats.mrReviewId, mrReviewId),
      eq(reviewStats.userId, userId)
    )
  })
}

/**
 * Получить все записи статистики по одному MR
 */
export async function getByMrReviewId(
  this: ReviewStatRepository,
  mrReviewId: number,
  tx?: Tx
): Promise<ReviewStat[]> {
  const executor = tx ?? this.db
  return executor.query.reviewStats.findMany({
    where: eq(reviewStats.mrReviewId, mrReviewId)
  })
}

/**
 * Создать новую запись статистики
 */
export async function create(
  this: ReviewStatRepository,
  data: InsertReviewStat,
  tx?: Tx
): Promise<ReviewStat> {
  const executor = tx ?? this.db

  const result = await executor
    .insert(reviewStats)
    .values(data)
    .onConflictDoUpdate({
      target: [reviewStats.mrReviewId, reviewStats.userId],
      set: {
        commentsCount: data.commentsCount
      }
    })
    .returning()

  return result[0]
}

/**
 * Обновить количество комментариев в записи статистики
 */
export async function update(
  this: ReviewStatRepository,
  id: number,
  commentsCount: number,
  tx?: Tx
): Promise<ReviewStat> {
  const executor = tx ?? this.db
  const [updated] = await executor
    .update(reviewStats)
    .set({ commentsCount })
    .where(eq(reviewStats.id, id))
    .returning()
  return updated
}

/**
 * Удалить все записи статистики для указанного MR
 */
export async function deleteByMrReviewId(
  this: ReviewStatRepository,
  mrReviewId: number,
  tx?: Tx
): Promise<void> {
  const executor = tx ?? this.db
  await executor
    .delete(reviewStats)
    .where(eq(reviewStats.mrReviewId, mrReviewId))
}
