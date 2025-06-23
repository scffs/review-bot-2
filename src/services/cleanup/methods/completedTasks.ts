import path from 'node:path'

import { di } from '@di'

import { CONFIG, MEDIA_DIR } from '@config'
import { logger } from '@utils'

import type { Cleanup } from '../cleanup.ts'

/**
 * Обрабатывает завершенные задачи и удаляет их данные.
 * @returns {Promise<void>} Promise, который разрешается после обработки всех задач
 */
export async function completedTasks(this: Cleanup): Promise<void> {
  // Получение всех активных задач из базы данных
  const allTasks = await di.task.fetchActiveTasks()

  // Обработка каждой задачи из базы данных
  for (const dbTask of allTasks) {
    const task = await this.weeekApi.getTaskById(dbTask.weeekId)

    if (task?.boardColumnId === CONFIG.weeek.reviewColumnId) {
      continue
    }

    // Логирование найденной неактивной задачи
    logger.info({ taskId: dbTask.weeekId }, 'Найдена задача для удаления')

    try {
      // Получение полных данных задачи из базы данных
      const taskData = await di.task.getByWeeekId(dbTask.weeekId)
      if (!taskData) {
        continue
      }

      // Удаление сообщений из Telegram и базы данных
      for (const msg of taskData.messages) {
        try {
          // Удаление сообщения из Telegram
          await di.bot.deleteMessage(CONFIG.chatId, msg.messageId)
        } catch (error) {
          // Логирование ошибки, если не удалось удалить сообщение
          logger.warn(
            { messageId: msg.messageId },
            'Не удалось удалить сообщение из Telegram'
          )
        }
      }

      // Удаление записей о сообщениях из базы данных
      await di.taskMessage.deleteByTaskId(taskData.id)

      // Удаление файлов вложений с сервера и из базы данных
      for (const attachment of taskData.attachments) {
        try {
          // Формирование полного пути к файлу
          const filePath = path.join(MEDIA_DIR, attachment.localPath)
          await Bun.file(filePath).delete()
        } catch (error) {
          // logger.warn(
          //   { attachmentPath: attachment.localPath },
          //   'Не удалось удалить файл вложения'
          // )
        }
      }
      await di.attachment.deleteByTaskId(taskData.id)

      // Помечаем задачу как завершенную
      await di.task.updateByWeeekId(taskData.weeekId, {
        isCompleted: true,
        completedAt: new Date()
      })

      logger.info(
        { taskId: dbTask.weeekId },
        'Задача помечена как завершенная, сообщения и файлы удалены'
      )
    } catch (error) {
      logger.error(
        { taskId: dbTask.weeekId, error },
        'Произошла ошибка при удалении данных задачи'
      )
    }
  }
}
