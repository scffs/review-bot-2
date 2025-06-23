import { BotKeyboard } from '@mtcute/bun'

// Клавиатура с одной кнопкой для отмены регистрации.
// При нажатии отправляется callback-запрос 'EXIT'.
export const cancelKb = BotKeyboard.inline([
  [BotKeyboard.callback('🚪', 'EXIT')]
])

/**
 * Формирует навигационную inline-клавиатуру для шагов регистрации.
 * @param step - текущий номер шага регистрации
 * @param hasValue - признак наличия введённого значения на текущем шаге
 * @returns inline-клавиатура с кнопками "назад", "вперёд" и "отмена"
 */
export function navKb(step: number, hasValue: boolean) {
  const kb = []

  // Если это не первый шаг, добавляем кнопку "назад"
  if (step > 1) {
    kb.push(BotKeyboard.callback('◀️', 'BACK'))
  }

  // Если на текущем шаге есть введённое значение, показываем кнопку "вперёд"
  if (hasValue) {
    kb.push(BotKeyboard.callback('▶️', 'FORWARD'))
  }

  // Кнопка отмены регистрации доступна всегда
  kb.push(BotKeyboard.callback('🚪', 'EXIT'))

  // Возвращаем клавиатуру с кнопками в одной строке
  return BotKeyboard.inline([kb])
}
