import { filters } from '@mtcute/dispatcher'

import type { RegistrationScene } from '../scene.ts'

import { prompts, stepOrder } from '../constants.ts'
import { navKb } from '../keyboard.ts'

/**
 * Регистрирует обработчики callback-запросов для сцены регистрации.
 * Обработчики реагируют на нажатия кнопок "EXIT", "BACK" и "FORWARD".
 */
export function registerCallbackHandlers(this: RegistrationScene) {
  /**
   * Обработчик для кнопки "EXIT".
   * Отменяет регистрацию, отправляет сообщение пользователю,
   * удаляет состояние сцены и завершает её.
   */
  this.scene.onCallbackQuery(filters.equals('EXIT'), async (ctx, state) => {
    await ctx.client.sendText(ctx.chat.id, 'Регистрация отменена') // Сообщение об отмене
    await state.delete() // Удаляем сохранённое состояние регистрации
    await state.exit() // Выходим из сцены
  })

  /**
   * Обработчик для кнопки "BACK".
   * Переходит к предыдущему шагу регистрации,
   * обновляет сообщение с соответствующим текстом и клавиатурой.
   */
  this.scene.onCallbackQuery(filters.equals('BACK'), async (ctx, state) => {
    const s = await state.get() // Получаем текущее состояние регистрации

    if (!s) {
      return // Если состояние отсутствует, выходим из обработчика
    }

    const cur = s.$step ?? 0 // Текущий шаг (по умолчанию 0)
    const prev = Math.max(cur - 1, 0) // Вычисляем предыдущий шаг, не меньше 0

    await this.scene.goToStep(state, prev) // Переходим к предыдущему шагу

    if (prev === 0) {
      return // Если это первый шаг, дополнительного обновления не требуется
    }

    const key = stepOrder[prev - 1] // Получаем ключ шага из порядка шагов
    const val = s[key] // Текущее значение на этом шаге

    // Формируем текст с подсказкой и текущим значением (если есть)
    const text = `${prompts[key]}${val ? ` (текущее: ${val})` : ''}`

    // Обновляем сообщение с новым текстом и клавиатурой навигации
    await ctx.editMessage({ text, replyMarkup: navKb(prev, Boolean(val)) })
  })

  /**
   * Обработчик для кнопки "FORWARD".
   * Переходит к следующему шагу регистрации,
   * обновляет сообщение с соответствующим текстом и клавиатурой.
   */
  this.scene.onCallbackQuery(filters.equals('FORWARD'), async (ctx, state) => {
    const s = await state.get() // Получаем текущее состояние регистрации

    if (!s) {
      return // Если состояние отсутствует, выходим из обработчика
    }

    const cur = s.$step ?? 0 // Текущий шаг (по умолчанию 0)
    const next = Math.min(cur + 1, stepOrder.length) // Вычисляем следующий шаг, не больше максимума

    if (next === 0) {
      return // Если следующий шаг равен 0 (маловероятно), выходим
    }

    await this.scene.goToStep(state, next) // Переходим к следующему шагу

    const key = stepOrder[next - 1] // Получаем ключ следующего шага
    const val = s[key] // Текущее значение на этом шаге

    // Формируем текст с подсказкой и текущим значением (если есть)
    const text = `${prompts[key]}${val ? ` (текущее: ${val})` : ''}`

    // Обновляем сообщение с новым текстом и клавиатурой навигации
    await ctx.editMessage({ text, replyMarkup: navKb(next, Boolean(val)) })
  })
}
