import { md } from '@mtcute/bun'
import { PropagationAction, filters } from '@mtcute/dispatcher'
import { z } from 'zod'

import type { DispatcherWithStorage } from '../../bot.ts'
import { isAllowedToExecute } from '../../middlewares'

import { getAnalyticMessage } from './handler/handler.ts'
import { AnalyticType } from './types'

/**
 * Схема валидации параметров команды аналитики
 * - type: тип аналитики (PERSONAL, TEAM, REVIEWS, TASKS)
 * - userId: необязательный идентификатор пользователя (число)
 */
const AnalyticCommandSchema = z.object({
  type: z.nativeEnum(AnalyticType).default(AnalyticType.PERSONAL),
  userId: z.number().optional()
})

/**
 * Регистрация обработчика команды /analytic в диспетчере.
 *
 * @param dp - объект диспетчера с поддержкой хранилища
 *
 * Функция слушает новые сообщения с командой 'analytic'.
 * Далее проверяет права пользователя (только admin может выполнять).
 * Парсит параметры команды с помощью схемы валидации.
 * Вызывает получение и форматирование сообщения аналитики.
 * Отправляет результат пользователю.
 * Обрабатывает ошибки валидации и другие ошибки с информированием пользователя.
 */
export const registerAnalytic = (dp: DispatcherWithStorage) => {
  dp.onNewMessage(filters.command('analytic'), async (ctx) => {
    // Проверяем, разрешено ли пользователю выполнять команду
    const propagationAction = await isAllowedToExecute(dp.deps.user.role, [
      'admin'
    ])

    // Прерываем выполнение, если доступ запрещён
    if (propagationAction === PropagationAction.Stop) {
      return
    }

    try {
      // Парсим параметры команды из текста сообщения
      const params = AnalyticCommandSchema.parse({
        type: ctx.command[1],
        userId: ctx.command[2] ? Number(ctx.command[2]) : undefined
      })

      // Получаем аналитическое сообщение (включая данные и форматирование)
      const message = await getAnalyticMessage(
        dp.deps.db.db,
        params,
        dp.deps.user.id
      )

      // Отправляем отформатированный ответ в чат
      await ctx.answerText(md(message), { disableWebPreview: true })
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Если ошибка валидации - сообщаем корректные параметры
        const errorMessage = `Некорректные параметры команды. Доступные типы аналитики:\n${Object.values(
          AnalyticType
        )
          .map((t) => `- ${t}`)
          .join('\n')}`
        await ctx.answerText(md(errorMessage))
      } else {
        // Логируем ошибку и информируем пользователя
        console.error('Analytic command error:', error)
        await ctx.answerText(md('Произошла ошибка при получении аналитики'))
      }
    }
  })
}
