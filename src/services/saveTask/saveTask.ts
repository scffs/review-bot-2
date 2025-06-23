import {
  assigneeHandler,
  attachmentHandler,
  messageHandler,
  mrReviewHandler,
  tagHandler,
  taskHandler,
  testHandler,
  withRelatedData
} from './methods'

/**
 *
 * Этот класс разработан для удобной и модульной работы с данными задач, позволяя сохранять:
 * - саму задачу
 * - вложения
 * - теги
 * - исполнителей
 * - сообщения
 * - ревью Merge Request'ов
 * - тестирование
 */
export class SaveTask {
  /**
   * Метод для сохранения полной задачи и связанных данных.
   */
  withRelatedData = withRelatedData

  /**
   * Метод для базового сохранения самой задачи (основная информация).
   */
  taskHandler = taskHandler

  /**
   * Метод для сохранения вложений, связанных с задачей.
   */
  attachmentHandler = attachmentHandler

  /**
   * Метод для сохранения тегов, связанных с задачей.
   */
  tagHandler = tagHandler

  /**
   * Метод для сохранения информации об исполнителях задачи.
   */
  assigneeHandler = assigneeHandler

  /**
   * Метод для обработки и сохранения сообщений/заметок, связанных с задачей.
   */
  messageHandler = messageHandler

  /**
   * Метод для обработки и сохранения информации о Merge Request'е,
   * связанном с задачей (включая ревью).
   */
  mrReviewHandler = mrReviewHandler

  /**
   * Метод для обработки и сохранения информации о тестах задачи.
   */
  testHandler = testHandler
}

export const saveTask = new SaveTask()
