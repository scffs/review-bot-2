import type { Task, TaskWithRelations, Tx } from '@database'

import { di } from '@di'

import type { SaveTaskData } from '../types.ts'

/**
 * Создает или обновляет задачу в базе данных
 *
 * @param {number} weeekId - Идентификатор задачи в системе Weeek
 * @param {SaveTaskData} data - Данные для сохранения
 * @param {TaskWithRelations | undefined} taskFromDb - Существующая задача из БД (если есть)
 * @param tx
 * @returns {Promise<Task>} Созданная или обновленная задача
 * @throws {Error} Если не удалось создать/обновить задачу
 */
export async function taskHandler(
  weeekId: number,
  data: Omit<SaveTaskData, 'messageMediaPaths'>,
  taskFromDb: TaskWithRelations | undefined,
  tx?: Tx
): Promise<Task> {
  const task = taskFromDb
    ? await di.task.updateByWeeekId(
        taskFromDb.weeekId,
        {
          messageCaption: data.messageCaption,
          createdAt: new Date(data.createdAt),
          title: data.fields.title || 'Untitled',
          taskUrl: data.fields.taskUrl || '',
          isEmergency: data.fields.isEmergency || false,
          mrId: data.fields.mrId || null,
          mrUrl: data.fields.mrUrl || null
        },
        tx
      )
    : await di.task.create(
        {
          weeekId,
          title: data.fields.title || 'Untitled',
          taskUrl: data.fields.taskUrl || '',
          isEmergency: data.fields.isEmergency || false,
          messageCaption: data.messageCaption,
          createdAt: new Date(data.createdAt),
          isCompleted: Boolean(data.isCompleted),
          mrId: data.fields.mrId || null,
          mrUrl: data.fields.mrUrl || null,
          completedAt: null
        },
        tx
      )

  if (!task) {
    throw new Error(`Failed to create/update task with weeekId ${weeekId}`)
  }

  return task
}
