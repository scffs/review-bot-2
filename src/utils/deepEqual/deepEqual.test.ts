import { describe, expect, it } from 'bun:test'

import { deepEqual } from './deepEqual'

describe('deepEqual', () => {
  it('должен вернуть true для одинаковых примитивов', () => {
    expect(deepEqual(5, 5)).toBe(true)
    expect(deepEqual('test', 'test')).toBe(true)
    expect(deepEqual(null, null)).toBe(true)
  })

  it('должен вернуть false для разных примитивов', () => {
    expect(deepEqual(5, 10)).toBe(false)
    expect(deepEqual('a', 'b')).toBe(false)
    expect(deepEqual(null, undefined)).toBe(false)
  })

  it('должен вернуть true для одинаковых простых объектов', () => {
    expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true)
  })

  it('должен вернуть false при разном количестве ключей', () => {
    expect(deepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false)
  })

  it('должен вернуть false при разных значениях', () => {
    expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false)
  })

  it('должен вернуть false при отсутствии ключа во втором объекте', () => {
    expect(deepEqual({ a: 1 }, {})).toBe(false)
  })

  it('должен корректно сравнивать вложенные объекты', () => {
    expect(deepEqual({ a: { b: 2 }, c: 3 }, { a: { b: 2 }, c: 3 })).toBe(true)
  })

  it('должен возвращать false при разнице во вложенных объектах', () => {
    expect(deepEqual({ a: { b: 2 }, c: 3 }, { a: { b: 3 }, c: 3 })).toBe(false)
  })
})
