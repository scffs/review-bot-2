import type { DbType } from '@database'
import { getFormattedAnalyticMessage } from '../formatters/getFormattedAnalitycMessage.ts'
import { getAnalyticData } from '../services/getAnalyticData.ts'
import type { AnalyticType } from '../types.ts'

/**
 * Функция получения итогового текстового сообщения аналитики.
 * Вызывает сервис получения статистики и форматировщик.
 *
 * @param db - база данных
 * @param params - параметры запроса аналитики
 * @param requestUserId - ID пользователя, сделавшего запрос (для подстановки по умолчанию)
 * @returns строка с отформатированной аналитикой
 */
export async function getAnalyticMessage(
  db: DbType,
  params: { type: AnalyticType; userId?: number },
  requestUserId: number
): Promise<string> {
  // Получаем статистику по аналитике (с учётом userId или дефолтного)
  const stats = await getAnalyticData(db, {
    type: params.type,
    userId: params.userId || requestUserId,
    requestUserId
  })

  // Форматируем сообщение и возвращаем
  return getFormattedAnalyticMessage(stats)
}
