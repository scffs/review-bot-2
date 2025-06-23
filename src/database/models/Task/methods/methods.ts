import { eq } from 'drizzle-orm'

import { type TaskRepository, type Tx, tasks } from '@database'

import type { Task } from '../type.ts'

export async function fetchActiveTasks(this: TaskRepository, tx?: Tx) {
  const executor = tx ?? this.db

  return executor.query.tasks.findMany({
    where: eq(tasks.isCompleted, false)
  })
}

// Создать новую задачу
export async function create(
  this: TaskRepository,
  taskData: Omit<Task, 'id'>,
  tx?: Tx
): Promise<Task> {
  const executor = tx ?? this.db

  const [newTask] = await executor.insert(tasks).values(taskData).returning()
  return newTask
}

// Обновить задачу
export async function update(
  this: TaskRepository,
  weeekId: number,
  taskData: Partial<Omit<Task, 'id'>>,
  tx?: Tx
): Promise<Task> {
  const executor = tx ?? this.db

  const [updatedTask] = await executor
    .update(tasks)
    .set(taskData)
    .where(eq(tasks.weeekId, weeekId))
    .returning()

  return updatedTask
}
