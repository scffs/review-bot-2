import { BotKeyboard } from '@mtcute/bun'

import { SelfKeyboardActions } from './constants.ts'
import { SelfButtonCallback } from './selfButtonCallback.ts'

export function createMainSelfKeyboard(userId: number) {
  return BotKeyboard.builder()
    .push(
      BotKeyboard.callback(
        '🔄 Обновить',
        SelfButtonCallback.build({
          action: SelfKeyboardActions.Refresh,
          userId: userId.toString(),
          page: '1'
        })
      ),
      BotKeyboard.callback(
        '📊 Подробно',
        SelfButtonCallback.build({
          action: SelfKeyboardActions.Details,
          userId: userId.toString(),
          page: '1'
        })
      )
    )
    .asInline()
}

export function createBackSelfKeyboard(userId: number) {
  return BotKeyboard.builder()
    .push(
      BotKeyboard.callback(
        '🔙 Назад',
        SelfButtonCallback.build({
          action: SelfKeyboardActions.BackToMenu,
          userId: userId.toString(),
          page: '1'
        })
      )
    )
    .asInline()
}

export function createSelfPaginationKeyboard(
  userId: number,
  page: number,
  totalPages: number
) {
  const kb = BotKeyboard.builder()

  // 1-й ряд: стрелки назад/вперёд
  const row: ReturnType<typeof BotKeyboard.callback>[] = []

  if (page > 1) {
    row.push(
      BotKeyboard.callback(
        '⬅️',
        SelfButtonCallback.build({
          action: SelfKeyboardActions.Details,
          userId: userId.toString(),
          page: (page - 1).toString()
        })
      )
    )
  }

  if (page < totalPages) {
    row.push(
      BotKeyboard.callback(
        '➡️',
        SelfButtonCallback.build({
          action: SelfKeyboardActions.Details,
          userId: userId.toString(),
          page: (page + 1).toString()
        })
      )
    )
  }

  if (row.length) {
    kb.push(...row)
  }

  // 2-й ряд: всегда назад в главное меню
  kb.push(
    BotKeyboard.callback(
      '◀️ Назад к меню',
      SelfButtonCallback.build({
        action: SelfKeyboardActions.BackToMenu,
        userId: userId.toString(),
        page: '1'
      })
    )
  )

  return kb.asInline()
}
