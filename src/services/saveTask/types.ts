import type { ReviewFields } from 'clients/weeek'

/**
 * Данные для сохранения задачи
 */
export interface SaveTaskData {
  /** Пути к медиа-файлам */
  messageMediaPaths: string[]
  /** Текст подписи к сообщению */
  messageCaption: string
  /** Идентификаторы сообщений */
  messageIds?: number[]
  /** Поля задачи */
  fields: ReviewFields
  /** Время создания в миллисекундах */
  createdAt: number
  isCompleted?: boolean
}
