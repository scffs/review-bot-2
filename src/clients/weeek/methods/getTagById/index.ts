import { di } from '@di'
import type { Weeek } from '../../weeek.ts'

/**
 * Получение типа тега по его ID в Weeek.
 * Метод ищет тег в базе данных по его ID в Weeek и возвращает его тип.
 *
 * @param weeekId - ID тега в Weeek
 * @returns Promise, разрешающийся в строку с типом тега или null, если тег не найден
 */
export async function getTagById(
  this: Weeek,
  weeekId: number
): Promise<string | null> {
  const tag = await di.tag.getByWeeekId(weeekId)

  if (!tag) {
    return null
  }

  return tag.type
}
