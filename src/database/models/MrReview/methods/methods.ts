import { eq } from 'drizzle-orm'

import type { Tx } from '@database'

import type { MrReviewRepository } from '../repository.ts'
import { mrReviews } from '../schema.ts'
import type { MrReview } from '../type.ts'

/**
 * Получает MR-ревью по идентификатору задачи
 */
export async function getByTaskId(
  this: MrReviewRepository,
  taskId: number,
  tx?: Tx
): Promise<MrReview | undefined> {
  const executor = tx ?? this.db
  return executor.query.mrReviews.findFirst({
    where: eq(mrReviews.taskId, taskId)
  })
}

/**
 * Создает MR-ревью
 */
export async function createMrReview(
  this: MrReviewRepository,
  data: Omit<MrReview, 'id'>,
  tx?: Tx
): Promise<MrReview> {
  const executor = tx ?? this.db
  const [newMrReview] = await executor
    .insert(mrReviews)
    .values(data)
    .returning()
  return newMrReview
}

/**
 * Обновляет MR-ревью
 */
export async function updateMrReview(
  this: MrReviewRepository,
  id: number,
  data: Partial<Omit<MrReview, 'id'>>,
  tx?: Tx
): Promise<MrReview> {
  const executor = tx ?? this.db
  const [updatedMrReview] = await executor
    .update(mrReviews)
    .set(data)
    .where(eq(mrReviews.id, id))
    .returning()
  return updatedMrReview
}

/**
 * Удаляет все MR-ревью для указанной задачи
 */
export async function deleteMrReviewsByTaskId(
  this: MrReviewRepository,
  taskId: number,
  tx?: Tx
): Promise<void> {
  const executor = tx ?? this.db
  await executor.delete(mrReviews).where(eq(mrReviews.taskId, taskId))
}

/**
 * Получает MR-ревью с комментариями, комментирующими и ревьюерами по ID задачи
 */
export async function getWithRelatedDataByTaskId(
  this: MrReviewRepository,
  taskId: number,
  tx?: Tx
) {
  const executor = tx ?? this.db
  return executor.query.mrReviews.findFirst({
    where: (mrReviews, { eq }) => eq(mrReviews.taskId, taskId),
    with: {
      comments: {
        with: {
          assignedUser: {
            with: { vacancy: true }
          }
        }
      },
      commentedUsers: {
        with: {
          user: { with: { vacancy: true } }
        }
      },
      reviewers: {
        with: {
          user: { with: { vacancy: true } }
        }
      }
    }
  })
}
