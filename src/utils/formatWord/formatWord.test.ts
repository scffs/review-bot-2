import { describe, expect, it } from 'bun:test'

import { formatWord } from './formatWord'

describe('formatWord', () => {
  it('должен возвращать форму для единственного числа (1)', () => {
    expect(formatWord(1, 'комментарий', 'комментария', 'комментариев')).toBe(
      'комментарий'
    )
    expect(formatWord(21, 'комментарий', 'комментария', 'комментариев')).toBe(
      'комментарий'
    )
    expect(formatWord(101, 'комментарий', 'комментария', 'комментариев')).toBe(
      'комментарий'
    )
  })

  it('должен возвращать форму для чисел 2-4', () => {
    expect(formatWord(2, 'комментарий', 'комментария', 'комментариев')).toBe(
      'комментария'
    )
    expect(formatWord(22, 'комментарий', 'комментария', 'комментариев')).toBe(
      'комментария'
    )
    expect(formatWord(42, 'комментарий', 'комментария', 'комментариев')).toBe(
      'комментария'
    )
  })

  it('должен возвращать форму для множественного числа (0, 5-20)', () => {
    expect(formatWord(5, 'комментарий', 'комментария', 'комментариев')).toBe(
      'комментариев'
    )
    expect(formatWord(15, 'комментарий', 'комментария', 'комментариев')).toBe(
      'комментариев'
    )
    expect(formatWord(25, 'комментарий', 'комментария', 'комментариев')).toBe(
      'комментариев'
    )
    expect(formatWord(100, 'комментарий', 'комментария', 'комментариев')).toBe(
      'комментариев'
    )
    expect(formatWord(105, 'комментарий', 'комментария', 'комментариев')).toBe(
      'комментариев'
    )
  })

  it('должен корректно обрабатывать исключения для чисел 11-14', () => {
    expect(formatWord(11, 'комментарий', 'комментария', 'комментариев')).toBe(
      'комментариев'
    )
    expect(formatWord(12, 'комментарий', 'комментария', 'комментариев')).toBe(
      'комментариев'
    )
    expect(formatWord(13, 'комментарий', 'комментария', 'комментариев')).toBe(
      'комментариев'
    )
    expect(formatWord(14, 'комментарий', 'комментария', 'комментариев')).toBe(
      'комментариев'
    )
  })

  it('должен возвращать форму для чисел, заканчивающихся на 1 (но исключая 11)', () => {
    expect(formatWord(31, 'комментарий', 'комментария', 'комментариев')).toBe(
      'комментарий'
    )
    expect(formatWord(41, 'комментарий', 'комментария', 'комментариев')).toBe(
      'комментарий'
    )
  })
})
