import { md } from '@mtcute/bun'

import { CONFIG } from '@config'
import type { Logger } from '@utils'

import { di } from '@di'

import { saveTask } from 'services/saveTask'
import type { TaskProcessingContext } from 'services/taskContext'

/**
 * Обрабатывает обновление подписи к сообщению задачи
 *
 * Действия:
 * 1. Редактирует текст первого сообщения
 * 2. Обновляет связанные данные в базе данных
 *
 * @param {TaskProcessingContext} context - Контекст обработки задачи
 * @param {Logger} log - Логгер для записи событий
 * @returns {Promise<void>}
 */
export async function handleCaptionUpdate(
  context: TaskProcessingContext,
  log: Logger
): Promise<void> {
  try {
    await di.bot.editMessage(
      CONFIG.chatId,
      context.messageIds[0],
      md(`${context.messageCaption}`)
    )
  } catch (err) {
    log.error({ err }, 'Ошибка редактирования')
  }

  await saveTask.withRelatedData(
    context.taskId,
    {
      messageMediaPaths: context.messageMediaPaths,
      messageCaption: context.messageCaption,
      messageIds: context.messageIds,
      fields: context.fields,
      createdAt: context.taskFromDb?.createdAt?.getTime() || Date.now()
    },
    context.taskFromDb
  )

  log.debug('Задача обновлена из-за изменений текста')
}
