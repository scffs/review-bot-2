import { eq } from 'drizzle-orm'

import type { Tx } from '@database'

import type { TaskMessageRepository } from './repository'
import { taskMessages } from './schema'
import type { InsertTaskMessage, TaskMessage } from './type'

/**
 * Получение сообщений задачи по ID
 */
export async function getByTaskId(
  this: TaskMessageRepository,
  taskId: number,
  tx?: Tx
): Promise<TaskMessage[]> {
  const executor = tx ?? this.db
  return executor.query.taskMessages.findMany({
    where: eq(taskMessages.taskId, taskId)
  })
}

/**
 * Создание записи сообщения задачи
 */
export async function createTaskMessage(
  this: TaskMessageRepository,
  taskMessage: InsertTaskMessage,
  tx?: Tx
): Promise<TaskMessage> {
  const executor = tx ?? this.db
  const [newTaskMessage] = await executor
    .insert(taskMessages)
    .values(taskMessage)
    .returning()
  return newTaskMessage
}

/**
 * Удаление всех сообщений задачи по ID
 */
export async function deleteTaskMessagesByTaskId(
  this: TaskMessageRepository,
  taskId: number,
  tx?: Tx
): Promise<void> {
  const executor = tx ?? this.db
  await executor.delete(taskMessages).where(eq(taskMessages.taskId, taskId))
}
