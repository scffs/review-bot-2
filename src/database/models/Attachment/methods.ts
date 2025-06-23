import { eq } from 'drizzle-orm'

import type { Tx } from '@database'

import type { AttachmentRepository } from './repository'

import { attachments } from './schema'
import type { Attachment, InsertAttachment } from './type'

/**
 * Создает новую запись вложения
 */
export async function create(
  this: AttachmentRepository,
  attachment: InsertAttachment,
  tx?: Tx
): Promise<Attachment> {
  const executor = tx ?? this.db
  const [newAttachment] = await executor
    .insert(attachments)
    .values(attachment)
    .returning()

  return newAttachment
}

/**
 * Удаляет вложения по идентификатору задачи
 */
export async function deleteByTaskId(
  this: AttachmentRepository,
  taskId: number,
  tx?: Tx
): Promise<void> {
  const executor = tx ?? this.db
  await executor.delete(attachments).where(eq(attachments.taskId, taskId))
}

/**
 * Получает вложения по идентификатору задачи
 */
export async function getByTaskId(
  this: AttachmentRepository,
  taskId: number,
  tx?: Tx
): Promise<Attachment[]> {
  const executor = tx ?? this.db
  return executor.query.attachments.findMany({
    where: eq(attachments.taskId, taskId)
  })
}

/**
 * Находит вложения-сироты (ссылки на несуществующие задачи)
 */
export async function findOrphaned(
  this: AttachmentRepository,
  tx?: Tx
): Promise<Attachment[]> {
  const executor = tx ?? this.db
  const rows = await executor.query.attachments.findMany({
    where: (attachments, { isNotNull }) => isNotNull(attachments.taskId),
    with: { task: true }
  })

  return rows
    .filter((row) => row.task === null)
    .map(({ task, ...attachment }) => attachment)
}

/**
 * Удаляет вложение по его идентификатору
 */
export async function deleteById(
  this: AttachmentRepository,
  id: number,
  tx?: Tx
): Promise<void> {
  const executor = tx ?? this.db
  await executor.delete(attachments).where(eq(attachments.id, id))
}

/**
 * Получает все локальные пути вложений
 */
export async function getAllLocalPaths(
  this: AttachmentRepository,
  tx?: Tx
): Promise<string[]> {
  const executor = tx ?? this.db
  const rows = await executor.query.attachments.findMany({
    columns: { localPath: true }
  })

  return rows.map((r) => r.localPath)
}
