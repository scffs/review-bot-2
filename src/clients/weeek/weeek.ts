import { CONFIG } from '@config'

import {
  getCompletedTasks,
  getTagById,
  getTags,
  getTaskById,
  getTasksInReview,
  makeRequest
} from './methods'

/**
 * Сервис для работы с Weeek API.
 * Предоставляет методы для получения задач, тегов и другой информации из системы Weeek.
 */
export class Weeek {
  /**
   * Базовый URL для API Weeek.
   * Получается из конфигурации приложения.
   */
  readonly baseURL: string

  /**
   * Заголовки HTTP-запросов, включая токен авторизации.
   * Используются при каждом запросе к API.
   */
  protected readonly headers: Record<string, string>

  /**
   * Таймаут для HTTP-запросов в миллисекундах.
   * По истечении этого времени запрос будет прерван.
   */
  protected readonly timeout: number

  /**
   * Создает экземпляр сервиса Weeek.
   * Инициализирует базовый URL, заголовки и таймаут из конфигурации.
   */
  constructor() {
    this.baseURL = CONFIG.weeek.apiUrl // Базовый URL API из конфигурации
    this.headers = {
      Authorization: `Bearer ${CONFIG.weeek.apiToken}`, // Токен авторизации
      'Content-Type': 'application/json' // Тип содержимого - JSON
    }
    this.timeout = 10000 // 10 секунд таймаут для запросов
  }

  /**
   * Базовый метод для выполнения HTTP-запросов к API Weeek.
   * Импортирован из отдельного файла для лучшей организации кода.
   */
  makeRequest = makeRequest

  /**
   * Выполняет GET-запрос к API Weeek.
   *
   * @param url - Относительный путь API (без базового URL)
   * @param params - Параметры запроса, которые будут добавлены в URL как query-параметры
   * @returns Promise с результатом запроса типа T
   */
  public async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    return this.makeRequest('GET', url, undefined, params)
  }

  /**
   * Получение списка задач из Weeek API.
   * Возвращает задачи из указанной в конфигурации доски и колонки.
   */
  getTasksInReview = getTasksInReview
  getCompletedTasks = getCompletedTasks

  /**
   * Получение тегов из Weeek API.
   * Возвращает все доступные теги проекта.
   */
  getTags = getTags

  /**
   * Получение задачи по ID.
   * Возвращает детальную информацию о конкретной задаче.
   */
  getTaskById = getTaskById

  /**
   * Получение тега по ID в Weeek.
   * Возвращает тип тега из базы данных по его ID в Weeek.
   */
  getTagById = getTagById
}

/**
 * Глобальный экземпляр сервиса Weeek для использования во всем приложении.
 * Позволяет избежать создания множества экземпляров сервиса.
 */
export const weeek = new Weeek()
