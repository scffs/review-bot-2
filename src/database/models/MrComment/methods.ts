import { eq } from 'drizzle-orm'

import type { Tx } from '@database'

import type { MrCommentRepository } from './repository'
import { mrComments } from './schema'
import type { MrComment, MrCommentId } from './type'

/**
 * Создает новый комментарий MR-ревью
 */
export async function create(
  this: MrCommentRepository,
  data: Omit<MrComment, 'id'>,
  tx?: Tx
): Promise<MrComment> {
  const executor = tx ?? this.db
  const [newComment] = await executor
    .insert(mrComments)
    .values(data)
    .returning()
  return newComment
}

/**
 * Получает все комментарии для указанного MR-ревью
 */
export async function findByMrReviewId(
  this: MrCommentRepository,
  mrReviewId: number,
  tx?: Tx
): Promise<MrComment[]> {
  const executor = tx ?? this.db
  return executor.query.mrComments.findMany({
    where: eq(mrComments.mrReviewId, mrReviewId)
  })
}

/**
 * Удаляет все комментарии для указанного MR-ревью
 */
export async function deleteByMrReviewId(
  this: MrCommentRepository,
  mrReviewId: number,
  tx?: Tx
): Promise<void> {
  const executor = tx ?? this.db
  await executor.delete(mrComments).where(eq(mrComments.mrReviewId, mrReviewId))
}

/**
 * Обновляет комментарий MR-ревью по его ID
 */
export async function update(
  this: MrCommentRepository,
  id: MrCommentId,
  data: Partial<Omit<MrComment, 'id'>>,
  tx?: Tx
): Promise<MrComment> {
  const executor = tx ?? this.db
  const [updatedComment] = await executor
    .update(mrComments)
    .set(data)
    .where(eq(mrComments.id, id))
    .returning()
  return updatedComment
}
