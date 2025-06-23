import type { TaskWithRelations } from '@database'
import type { ReviewFields } from '../../clients/weeek'

/**
 * Контекст обработки задачи
 * Содержит все необходимые данные для работы с задачей
 */
export interface TaskProcessingContext {
  /** Идентификатор задачи в системе */
  taskId: number
  /** Существующая задача из БД (если есть) */
  taskFromDb: TaskWithRelations | undefined
  /** Поля задачи из Weeek */
  fields: ReviewFields
  /** Идентификаторы связанных сообщений */
  messageIds: number[]
  /** Текст подписи к сообщению */
  messageCaption: string
  /** Пути к медиа-файлам */
  messageMediaPaths: string[]
}
