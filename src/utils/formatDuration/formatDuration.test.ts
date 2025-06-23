import { describe, expect, it } from 'bun:test'
import { formatDuration } from './formatDuration'

describe('formatDuration', () => {
  it('должен корректно форматировать 0 секунд', () => {
    expect(formatDuration(0)).toBe('0с')
  })

  it('должен корректно форматировать секунды меньше минуты', () => {
    expect(formatDuration(5)).toBe('5с')
    expect(formatDuration(59)).toBe('59с')
  })

  it('должен корректно форматировать ровно 1 минуту', () => {
    expect(formatDuration(60)).toBe('1м')
  })

  it('должен корректно форматировать минуты и секунды', () => {
    expect(formatDuration(61)).toBe('1м 1с')
    expect(formatDuration(3599)).toBe('59м 59с')
  })

  it('должен корректно форматировать ровно 1 час', () => {
    expect(formatDuration(3600)).toBe('1ч')
  })

  it('должен корректно форматировать часы, минуты и секунды', () => {
    expect(formatDuration(3661)).toBe('1ч 1м 1с')
    expect(formatDuration(86399)).toBe('23ч 59м 59с')
  })

  it('должен корректно форматировать ровно 1 день', () => {
    expect(formatDuration(86400)).toBe('1д')
  })

  it('должен корректно форматировать дни, часы, минуты и секунды', () => {
    expect(formatDuration(90061)).toBe('1д 1ч 1м 1с')
    expect(formatDuration(2591999)).toBe('29д 23ч 59м 59с')
  })

  it('должен корректно форматировать ровно 1 месяц', () => {
    expect(formatDuration(2592000)).toBe('1мес')
  })

  it('должен корректно форматировать месяцы, дни, часы, минуты и секунды', () => {
    expect(formatDuration(2678464)).toBe('1мес 1д 1м 4с')
  })

  it('должен корректно форматировать ровно 3 месяца', () => {
    expect(formatDuration(7776000)).toBe('3мес')
  })
})
