import { eq } from 'drizzle-orm'

import type { Tx } from '@database'

import type { AssigneeRepository } from './repository'
import { assigneeInsertSchema, assigneeUpdateSchema, assignees } from './schema'
import type { Assignee, InsertAssignee } from './type'

/**
 * Создает нового исполнителя (assignee) для задачи.
 *
 * Входящие данные валидируются с помощью `assigneeInsertSchema`,
 * чтобы предотвратить сохранение некорректных или вредоносных данных в БД.
 *
 * @param {InsertAssignee} assignee - Данные для нового исполнителя
 * @param {Tx} [tx] - Опциональная транзакция базы данных
 * @returns {Promise<Assignee>} - Созданный исполнитель
 */
export async function create(
  this: AssigneeRepository,
  assignee: InsertAssignee,
  tx?: Tx
): Promise<Assignee> {
  // Валидация входящих данных по схеме вставки
  const parsed = assigneeInsertSchema.parse(assignee)
  const executor = tx ?? this.db

  // Вставка данных в таблицу assignees и возврат созданной записи
  const [newAssignee] = await executor
    .insert(assignees)
    .values(parsed)
    .returning()

  return newAssignee
}

/**
 * Обновляет существующего исполнителя.
 *
 * Входящие данные проходят валидацию по схеме обновления `assigneeUpdateSchema`.
 *
 * @param {number} id - ID исполнителя для обновления
 * @param {Partial<Assignee>} data - Данные для обновления
 * @param {Tx} [tx] - Опциональная транзакция
 * @returns {Promise<Assignee>} - Обновленная запись исполнителя
 */
export async function update(
  this: AssigneeRepository,
  id: number,
  data: Partial<Assignee>,
  tx?: Tx
): Promise<Assignee> {
  // Валидация частичных данных обновления
  const parsed = assigneeUpdateSchema.parse(data)
  const executor = tx ?? this.db

  // Обновление записи в таблице assignees по ID и возврат обновленной записи
  const [updatedAssignee] = await executor
    .update(assignees)
    .set(parsed)
    .where(eq(assignees.id, id))
    .returning()

  return updatedAssignee
}

/**
 * Удаляет исполнителя по его ID
 */
export async function deleteAssignee(
  this: AssigneeRepository,
  id: number,
  tx?: Tx
): Promise<void> {
  const executor = tx ?? this.db
  await executor.delete(assignees).where(eq(assignees.id, id))
}

/**
 * Удаляет всех исполнителей для указанной задачи
 */
export async function deleteByTaskId(
  this: AssigneeRepository,
  taskId: number,
  tx?: Tx
): Promise<void> {
  const executor = tx ?? this.db
  await executor.delete(assignees).where(eq(assignees.taskId, taskId))
}

/**
 * Получает всех исполнителей для указанной задачи
 */
export async function getByTaskId(
  this: AssigneeRepository,
  taskId: number,
  tx?: Tx
): Promise<Assignee[]> {
  const executor = tx ?? this.db
  return executor.query.assignees.findMany({
    where: eq(assignees.taskId, taskId)
  })
}
