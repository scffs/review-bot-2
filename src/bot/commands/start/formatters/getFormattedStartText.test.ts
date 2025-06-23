// @ts-nocheck
import { describe, expect, it } from 'bun:test'

import { getFormattedStartText } from './getFormattedStartText.ts'

describe('getFormattedStartText', () => {
  it('форматирует приветственное сообщение правильно', () => {
    const user = { id: 1, name: 'Alice', vacancy: 'Developer' }
    const text = getFormattedStartText(user)

    expect(text).toContain('Привет, 👤 Alice')
    expect(text).toContain('Твоя должность – Developer')
    expect(text).toContain('/start — приветственное сообщение')
    expect(text).toContain('/self — посмотреть свою статистику')
    expect(text).toContain('/daily — посмотреть краткую сводку')
  })
})
