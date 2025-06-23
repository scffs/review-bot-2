import type { Weeek } from '../weeek.ts'

/**
 * Базовый метод для выполнения HTTP-запросов к API Weeek.
 * Поддерживает различные HTTP-методы и обрабатывает таймауты.
 *
 * @param method - HTTP-метод запроса (GET, POST, PUT, DELETE)
 * @param url - Относительный путь API (без базового URL)
 * @param data - Данные для отправки в теле запроса (для POST, PUT)
 * @param params - Параметры запроса для добавления в URL (для GET)
 * @returns Promise с результатом запроса типа T
 * @throws Error при неудачном запросе или таймауте
 */
export async function makeRequest<T>(
  this: Weeek, // Контекст метода - экземпляр WeeekService
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  data?: any,
  params?: Record<string, any>
): Promise<T> {
  // Формирование полного URL с базовым адресом
  let fullUrl = `${this.baseURL}${url}`

  // Добавление query-параметров для GET-запросов
  if (params && method === 'GET') {
    const queryParams = new URLSearchParams(params).toString()
    // Добавляем параметры к URL
    fullUrl += `?${queryParams}`
  }

  // Создание контроллера для возможности прерывания запроса по таймауту
  const controller = new AbortController()
  // Установка таймера для прерывания запроса
  const id = setTimeout(() => controller.abort(), this.timeout)

  // Выполнение HTTP-запроса с использованием Bun.fetch
  const response = await Bun.fetch(fullUrl, {
    method, // HTTP-метод
    headers: this.headers, // Заголовки с авторизацией
    body: data ? JSON.stringify(data) : undefined, // Тело запроса (если есть)
    signal: controller.signal // Сигнал для прерывания запроса
  })

  // Очистка таймера после получения ответа
  clearTimeout(id)

  if (!response.ok) {
    throw new Error(
      `HTTP error! Status: ${response.status} ${response.statusText}, url: ${fullUrl}`
    )
  }

  return (await response.json()) as Promise<T>
}
