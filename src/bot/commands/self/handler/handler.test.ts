// @ts-nocheck
import { afterEach, beforeEach, describe, expect, it, jest } from 'bun:test'

import * as formatters from '../formatters'
import * as services from '../services'

import { getSelfMessage } from './handler'

describe('getSelfMessage', () => {
  const userId = 99
  let handleStatsSpy: jest.SpyInstance
  let formatSummarySpy: jest.SpyInstance

  beforeEach(() => {
    handleStatsSpy = jest.spyOn(services, 'handleSelfStats')
    formatSummarySpy = jest.spyOn(formatters, 'getFormattedSelfSummary')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('должен получить статистику и вернуть отформатированную сводку', async () => {
    const fakeStats = { foo: 'bar' }
    handleStatsSpy.mockResolvedValueOnce(fakeStats)

    const fakeSummary = { text: 'Привет!', keyboard: { ok: true } }
    formatSummarySpy.mockReturnValueOnce(fakeSummary)

    const result = await getSelfMessage(userId)
    expect(handleStatsSpy).toHaveBeenCalledWith(userId)
    expect(formatSummarySpy).toHaveBeenCalledWith(fakeStats, userId)
    expect(result).toBe(fakeSummary)
  })
})
