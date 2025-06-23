import { md } from '@mtcute/bun' // Утилита для форматирования Markdown-текста
import { filters } from '@mtcute/dispatcher' // Фильтры для обработки входящих сообщений и callback-запросов

import type { DispatcherWithStorage } from '@bot' // Расширенный тип диспетчера с доступом к storage

import { getSelfMessage } from './handler' // Получение краткой сводки пользователя
import { SelfButtonCallback, SelfKeyboardActions } from './keyboard' // Определения кнопок и действий клавиатуры
import { getUserSelfDataWithKeyboard, handleShowSelfDetails } from './services' // Обработчики для подробного отображения данных

/**
 * Регистрирует команды и callback-действия, связанные с отображением данных пользователя ("self").
 * Используется диспетчер `dp`, предоставляемый mtcute.
 */
export const registerSelfCommand = (dp: DispatcherWithStorage) => {
  // Команда /self — выводит краткую сводку по задачам
  dp.onNewMessage(filters.command('self'), async (ctx, state) => {
    await state.rateLimit('self_command', 1, 1) // Ограничение частоты вызова
    const summary = await getSelfMessage(dp.deps.user.id)

    if (!summary) return

    await ctx.answerText(md(summary.text), {
      replyMarkup: summary.keyboard
    })
  })

  // Кнопка "Подробнее" — переключение на постраничное отображение
  dp.onCallbackQuery(
    SelfButtonCallback.filter({ action: SelfKeyboardActions.Details }),
    async (ctx, state) => {
      await state.rateLimit(SelfKeyboardActions.Details, 1, 1)

      const result = await handleShowSelfDetails({
        page: ctx.match.page,
        databaseUserId: dp.deps.user.id
      })

      if (!result) {
        await ctx.answer({})
        return
      }

      const oldMessage = await ctx.getMessage()
      if (oldMessage?.textWithEntities.text === result.text) {
        await ctx.answer({})
        return
      }

      await ctx.editMessage({
        text: md(result.text),
        replyMarkup: result.keyboard,
        disableWebPreview: true
      })
    }
  )

  // Кнопка "Обновить" — обновление краткой сводки
  dp.onCallbackQuery(
    SelfButtonCallback.filter({ action: SelfKeyboardActions.Refresh }),
    getUserSelfDataWithKeyboard
  )

  // Кнопка "Назад в меню" — возврат к краткой сводке
  dp.onCallbackQuery(
    SelfButtonCallback.filter({ action: SelfKeyboardActions.BackToMenu }),
    getUserSelfDataWithKeyboard
  )
}
