import { describe, expect, it } from 'bun:test'

import { withTimeOut } from './withTimeOut'

describe('withTimeOut', () => {
  it('должен вызывать fn немедленно и затем с интервалом', async () => {
    let calls = 0
    const fn = async () => {
      calls++
    }

    const stop = withTimeOut(fn, 50)

    // ждём чуть больше 3 интервалов
    await new Promise((resolve) => setTimeout(resolve, 160))

    stop()

    expect(calls).toBeGreaterThanOrEqual(3)
    expect(calls).toBeLessThanOrEqual(4)
  })

  it('должен прекратить вызовы после stop', async () => {
    let calls = 0
    const fn = async () => {
      calls++
    }

    const stop = withTimeOut(fn, 30)

    await new Promise((resolve) => setTimeout(resolve, 90))
    stop()

    const before = calls
    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(calls).toBe(before)
  })
})
