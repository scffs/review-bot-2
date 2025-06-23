// @ts-nocheck
import { afterEach, beforeEach, describe, expect, it, jest } from 'bun:test'

import { logger } from '@utils'

import { getStartMessage } from './handler.ts'

describe('getStartMessage', () => {
  let formatSpy: jest.SpyInstance
  let errorSpy: jest.SpyInstance

  beforeEach(() => {
    formatSpy = jest.spyOn(require('../formatters'), 'getFormattedStartText')
    errorSpy = jest.spyOn(logger, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('возвращает результат форматирования, если нет ошибок', async () => {
    const fake = { text: 'Hi' }
    formatSpy.mockReturnValueOnce(fake)
    const user = { id: 2, name: 'Bob', vacancy: 'Tester' }
    const res = await getStartMessage(user)
    expect(formatSpy).toHaveBeenCalledWith(user)
    expect(res).toBe(fake)
    expect(errorSpy).not.toHaveBeenCalled()
  })

  it('ловит ошибку при выбросе и логирует её, возвращая undefined', async () => {
    const err = new Error('boom')
    formatSpy.mockImplementationOnce(() => {
      throw err
    })
    const user = { id: 3, name: 'Carol', vacancy: 'Manager' }
    const res = await getStartMessage(user)
    expect(formatSpy).toHaveBeenCalledWith(user)
    expect(errorSpy).toHaveBeenCalledWith(
      err,
      'Ошибка в обработке команды /start'
    )
    expect(res).toBeUndefined()
  })
})
