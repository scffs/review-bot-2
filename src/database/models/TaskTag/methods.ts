import {
  type InsertTaskTag,
  type TaskTag,
  type TaskTagRepository,
  taskTags
} from '@database'
import type { Tx } from '@database'
import { eq } from 'drizzle-orm'

/**
 * Создает связь "задача - тег"
 */
export async function createTaskTag(
  this: TaskTagRepository,
  taskTag: InsertTaskTag,
  tx?: Tx
): Promise<TaskTag> {
  const executor = tx ?? this.db
  const [newTaskTag] = await executor
    .insert(taskTags)
    .values(taskTag)
    .returning()

  return newTaskTag
}

/**
 * Удаляет все теги для указанной задачи
 */
export async function deleteTaskTagsByTaskId(
  this: TaskTagRepository,
  taskId: number,
  tx?: Tx
): Promise<void> {
  const executor = tx ?? this.db
  await executor.delete(taskTags).where(eq(taskTags.taskId, taskId))
}

/**
 * Получает все теги, связанные с задачей
 */
export async function getByTaskId(
  this: TaskTagRepository,
  taskId: number,
  tx?: Tx
): Promise<TaskTag[]> {
  const executor = tx ?? this.db
  return executor.query.taskTags.findMany({
    where: eq(taskTags.taskId, taskId)
  })
}
