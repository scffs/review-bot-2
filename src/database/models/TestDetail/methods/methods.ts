import { eq } from 'drizzle-orm'

import type { Tx } from '@database'

import type { TestDetailRepository } from '../repository.ts'
import { testDetails } from '../schema.ts'
import type { TestDetail, TestId } from '../type.ts'

/**
 * Создает детализацию теста
 */
export async function create(
  this: TestDetailRepository,
  data: Omit<TestDetail, 'id'>,
  tx?: Tx
): Promise<TestDetail> {
  const executor = tx ?? this.db
  const [newTestDetail] = await executor
    .insert(testDetails)
    .values(data)
    .returning()
  return newTestDetail
}

/**
 * Получает детализации по идентификатору теста
 */
export async function findByTestId(
  this: TestDetailRepository,
  testId: TestId,
  tx?: Tx
): Promise<TestDetail[]> {
  const executor = tx ?? this.db
  return executor.query.testDetails.findMany({
    where: eq(testDetails.testId, testId)
  })
}

/**
 * Удаляет детализации по идентификатору теста
 */
export async function deleteByTestId(
  this: TestDetailRepository,
  testId: TestId,
  tx?: Tx
): Promise<void> {
  const executor = tx ?? this.db
  await executor.delete(testDetails).where(eq(testDetails.testId, testId))
}
