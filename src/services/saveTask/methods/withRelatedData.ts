import { logger } from '@utils'

import { type TaskWithRelations, db } from '@database'

import type { SaveTask } from '../saveTask'
import type { SaveTaskData } from '../types'

/**
 * Сохраняет или обновляет все данные, связанные с задачей, в одной транзакции
 * @param weeekTaskId - ID задачи
 * @param data - Данные задачи для сохранения
 * @param taskFromDb - Существующая задача из БД (для обновления)
 */
export async function withRelatedData(
  this: SaveTask,
  weeekTaskId: number,
  data: SaveTaskData,
  taskFromDb?: TaskWithRelations
): Promise<void> {
  await db.transaction(async (transaction) => {
    // Создаем или обновляем основную задачу
    const task = await this.taskHandler(
      weeekTaskId,
      data,
      taskFromDb,
      transaction
    )

    logger.info(task)

    // Подготовим обработчики в виде массива
    const operations = [
      this.attachmentHandler(
        task.id,
        { videos: data.fields.videos, images: data.fields.images },
        data.messageMediaPaths,
        transaction
      ),
      this.assigneeHandler(task.id, data.fields.assignees, transaction)
    ]

    // Добавим теги, если они есть
    if (data.fields.tags?.filter(Boolean).length) {
      operations.push(this.tagHandler(task.id, data.fields.tags, transaction))
    }

    // Обработка сообщений, MR и тестов по наличию данных
    if (data.messageIds) {
      operations.push(
        this.messageHandler(
          task.id,
          data.messageIds,
          data.messageMediaPaths,
          transaction
        )
      )
    }

    if (data.fields.mr && data.fields.mrId) {
      operations.push(
        this.mrReviewHandler(
          task.id,
          data.fields.mrId,
          data.fields.mr,
          transaction
        )
      )
    }

    if (data.fields.tests) {
      operations.push(this.testHandler(task.id, data.fields.tests, transaction))
    }

    // Выполняем все операции параллельно
    await Promise.all(operations)
  })
}
