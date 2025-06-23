import { di } from '@di'
import { type Logger, deepEqual } from '@utils'

import type { TaskProcessingContext } from 'services/taskContext'

import { compareMediaFields } from '../compareMediaFields'

import { UpdateReason, isExpired } from './constants'
import { getMergeRequestData } from './getMergeRequestData'

/**
 * Проверяет необходимость обновления задачи
 *
 * Проверки:
 * 1. Сравнивает текущие поля с полями в БД
 * 2. Проверяет изменения в медиа-контенте
 * 3. Проверяет изменения в подписи к сообщению
 *
 * @param {TaskProcessingContext} context - Контекст обработки задачи
 * @param {Logger} log - Логгер для записи событий
 * @returns {Promise<boolean>} true если требуется обновление
 */
export async function checkForUpdates(
  context: TaskProcessingContext,
  log: Logger
): Promise<UpdateReason> {
  const { taskFromDb, fields, messageCaption, messageIds } = context

  // 1) Новая задача
  if (!taskFromDb) {
    log.info('Новая задача')
    return UpdateReason.NEW_TASK
  }

  // 2) Сообщения истекли или не созданы
  if (!messageIds.length) {
    log.debug('Нет предыдущих сообщений')
    return UpdateReason.NEW_TASK
  }
  if (isExpired(taskFromDb.createdAt)) {
    log.debug('Сообщения устарели (TTL)')
    return UpdateReason.EXPIRED_MESSAGES
  }

  // 3) Подпись изменилась
  if (taskFromDb.messageCaption !== messageCaption) {
    log.debug('Caption изменился')
    return UpdateReason.CAPTION_CHANGED
  }

  // 4) Медиа-поля изменились
  const mediaEqual = await compareMediaFields(taskFromDb.id, fields)
  if (!mediaEqual) {
    log.debug('Media fields изменились')
    return UpdateReason.MEDIA_CHANGED
  }

  const mrReview = taskFromDb?.mrReview
    ? await getMergeRequestData(taskFromDb.id)
    : null
  const formattedReview = { ...mrReview }

  if (formattedReview) {
    // biome-ignore lint: Нам надо именно удалить ключ
    // @ts-ignore
    delete fields.mr?.durationSeconds
    // biome-ignore lint: Нам надо именно удалить ключ
    delete formattedReview.durationSeconds
    // biome-ignore lint: Нам надо именно удалить ключ
    delete formattedReview.id
    // biome-ignore lint: Нам надо именно удалить ключ
    delete formattedReview.taskId
  }

  // Получаем из БД запись tests вместе с деталями (testDetails)
  const dbTests = await di.test.getWithDetailsByTaskId(taskFromDb.id)

  // Приводим к Partial — теперь поля id и taskId считаются опциональными,
  const formattedTests = dbTests
    ? ({ ...dbTests } as Partial<typeof dbTests> & {
        all: any
        unresolved: any
      })
    : undefined

  if (formattedTests) {
    // biome-ignore lint: Нам надо именно удалить ключ
    delete formattedTests.id
    // biome-ignore lint: Нам надо именно удалить ключ
    delete formattedTests.taskId

    // Строим полный массив all с флагом isCompleted
    const all = (formattedTests.testDetails ?? []).map((d) => ({
      name: d.name,
      link: d.link,
      isCompleted: d.isCompleted
    }))

    // Из него — массив только unresolved
    const unresolved = all
      .filter((t) => !t.isCompleted)
      .map(({ name, link }) => ({ name, link }))

    // biome-ignore lint: Нам надо именно удалить ключ
    delete formattedTests.testDetails
    formattedTests.all = all
    formattedTests.unresolved = unresolved
  }

  const taskFields = {
    title: fields.title,
    taskUrl: fields.taskUrl,
    isEmergency: fields.isEmergency,
    mrId: fields.mrId || null,
    mrUrl: fields.mrUrl || null,
    mr: fields.mr,
    tests: fields.tests
  }

  const existingFields = {
    title: taskFromDb.title,
    taskUrl: taskFromDb.taskUrl,
    isEmergency: taskFromDb.isEmergency,
    mrId: taskFromDb.mrId || null,
    mrUrl: taskFromDb.mrUrl || null,
    mr: {
      branchBehindBy: formattedReview?.branchBehindBy,
      hasConflicts: formattedReview?.hasConflicts,
      comments: formattedReview?.comments,
      changedFilesCount: formattedReview?.changedFilesCount,
      additions: formattedReview?.additions,
      deletions: formattedReview?.deletions,
      reviewers: formattedReview?.reviewers
    },
    tests: formattedTests ?? fields.tests
  }

  if (!taskFields.mr) {
    // @ts-ignore
    existingFields.mr = null
  }

  if (!deepEqual(existingFields, taskFields)) {
    log.info('Поля задачи изменились')
    return UpdateReason.FIELDS_CHANGED
  }

  log.info('Обновление не требуется')
  return UpdateReason.NONE
}
