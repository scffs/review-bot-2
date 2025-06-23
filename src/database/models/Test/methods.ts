import { eq } from 'drizzle-orm'

import type { Tx } from '@database'

import type { TestRepository } from './repository'

import { tests } from './schema'
import type { InsertTest } from './type'
import type { Test } from './type'

/**
 * Получает запись тестов по идентификатору задачи
 */
export async function getByTaskId(
  this: TestRepository,
  taskId: number,
  tx?: Tx
): Promise<Test | undefined> {
  const executor = tx ?? this.db
  return executor.query.tests.findFirst({
    where: eq(tests.taskId, taskId)
  })
}

/**
 * Создает новую запись тестов для задачи
 */
export async function createTest(
  this: TestRepository,
  data: InsertTest,
  tx?: Tx
): Promise<Test> {
  const executor = tx ?? this.db
  const [newTest] = await executor.insert(tests).values(data).returning()
  return newTest
}

/**
 * Обновляет существующую запись тестов
 */
export async function updateTest(
  this: TestRepository,
  id: number,
  data: Partial<InsertTest>,
  tx?: Tx
): Promise<Test> {
  const executor = tx ?? this.db
  const [updatedTest] = await executor
    .update(tests)
    .set(data)
    .where(eq(tests.id, id))
    .returning()
  return updatedTest
}

/**
 * Удаляет запись тестов по идентификатору задачи
 */
export async function deleteTestsByTaskId(
  this: TestRepository,
  taskId: number,
  tx?: Tx
): Promise<void> {
  const executor = tx ?? this.db
  await executor.delete(tests).where(eq(tests.taskId, taskId))
}

/**
 * Получает запись тестов вместе с деталями по идентификатору задачи
 */
export async function getWithDetailsByTaskId(
  this: TestRepository,
  taskId: number,
  tx?: Tx
) {
  const executor = tx ?? this.db
  return executor.query.tests.findFirst({
    where: eq(tests.taskId, taskId),
    with: { testDetails: true }
  })
}
