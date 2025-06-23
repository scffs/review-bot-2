import { md } from '@mtcute/bun'

import type { Logger } from '@utils'

import type { TaskProcessingContext } from 'services/taskContext'

import { UpdateReason } from '../helpers'

import { createMessageMedia } from './createMessageMedia'
import { deleteOldMessages } from './deleteOldMessages.ts'
import { handleCaptionUpdate } from './handleCaptionUpdate'
import { handleMediaUpdate } from './handleMediaUpdate'
import { handleNewTask } from './handleNewTask'

/**
 * Обрабатывает обновление задачи в чате
 *
 * Основные операции:
 * 1. Создает медиа-сообщения из указанных путей к файлам
 * 2. Добавляет подпись к первому медиа-элементу
 * 3. Обрабатывает различные сценарии:
 *    - Создание новой задачи
 *    - Обновление только подписи
 *    - Обновление медиа-контента
 *
 * @param {TaskProcessingContext} context - Контекст обработки задачи
 * @param {Logger} log - Логгер для записи событий
 * @param reason
 * @returns {Promise<void>}
 */
export async function processTaskUpdate(
  context: TaskProcessingContext,
  log: Logger,
  reason: UpdateReason
): Promise<void> {
  const { taskFromDb, messageIds, messageCaption, messageMediaPaths } = context

  const messageMedia = await createMessageMedia(messageMediaPaths)

  if (messageMedia.length > 0) {
    const firstMedia = messageMedia[0]
    if ('type' in firstMedia && ['photo', 'video'].includes(firstMedia.type)) {
      firstMedia.caption = md(`${messageCaption}`)
    }
  }

  switch (reason) {
    case UpdateReason.NEW_TASK:
    case UpdateReason.EXPIRED_MESSAGES:
      if (taskFromDb && messageIds.length) {
        await deleteOldMessages(taskFromDb.id, messageIds, log)
      }

      await handleNewTask(context, messageMedia, log)
      break

    case UpdateReason.MEDIA_CHANGED:
    case UpdateReason.FIELDS_CHANGED:
      await handleMediaUpdate(context, messageMedia, log)
      break

    case UpdateReason.CAPTION_CHANGED:
      await handleCaptionUpdate(context, log)
      break
    default:
      log.debug('processTaskUpdate вызвана без причины обновления')
      break
  }
}
