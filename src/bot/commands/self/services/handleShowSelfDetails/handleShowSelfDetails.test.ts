// @ts-nocheck
import { afterEach, beforeEach, describe, expect, it, jest } from 'bun:test'

import * as utils from '@utils'

import * as formatters from '../../formatters'

import * as statsModule from '../handleSelfStats/handleSelfStats.ts'
import { handleShowSelfDetails } from './handleShowSelfDetails.ts'

describe('handleShowSelfDetails', () => {
  let statsSpy: jest.SpyInstance
  let formatTaskSpy: jest.SpyInstance
  let formatDetailedSpy: jest.SpyInstance

  beforeEach(() => {
    statsSpy = jest.spyOn(statsModule, 'handleSelfStats')
    formatTaskSpy = jest.spyOn(utils, 'getFormattedTask')
    formatDetailedSpy = jest.spyOn(formatters, 'formatDetailedStats')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('должен вызывать зависимости и возвращать результат для корректного номера страницы', async () => {
    const pageStr = '2'
    const databaseUserId = 10
    const tasksPage = [{ id: 'a' }, { id: 'b' }]
    const fakeStats = {
      tasksPage,
      totalCount: 12
    }
    statsSpy.mockResolvedValueOnce(fakeStats)

    formatTaskSpy.mockReturnValueOnce('fmt:a').mockReturnValueOnce('fmt:b')

    const fakeResult = { text: 'DETAILS', keyboard: { nav: true } }
    formatDetailedSpy.mockReturnValueOnce(fakeResult)

    const result = await handleShowSelfDetails({
      page: pageStr,
      databaseUserId
    })

    const currentPage = 2
    expect(statsSpy).toHaveBeenCalledWith(databaseUserId, currentPage, 5)
    expect(formatTaskSpy).toHaveBeenNthCalledWith(1, tasksPage[0])
    expect(formatTaskSpy).toHaveBeenNthCalledWith(2, tasksPage[1])

    const totalPages = Math.ceil(fakeStats.totalCount / 5)
    expect(formatDetailedSpy).toHaveBeenCalledWith(
      ['fmt:a', 'fmt:b'],
      currentPage,
      totalPages,
      databaseUserId
    )

    // Новый объект, поэтому toEqual
    expect(result).toEqual(fakeResult)
  })

  it('по нечисловой или нулевой строке страницы всегда берёт страницу 1', async () => {
    const databaseUserId = 5
    const fakeStats = {
      tasksPage: [],
      totalCount: 3
    }
    // возвращаем один раз и для всех вызовов
    statsSpy.mockResolvedValue(fakeStats)
    formatTaskSpy.mockReturnValue('unused')
    formatDetailedSpy.mockReturnValue({ text: 'T', keyboard: {} })

    const badPages = ['0', '-1', 'abc', '']
    for (const bad of badPages) {
      const result = await handleShowSelfDetails({
        page: bad,
        databaseUserId
      })

      // всегда page=1
      expect(statsSpy).toHaveBeenLastCalledWith(databaseUserId, 1, 5)
      const totalPages = Math.ceil(fakeStats.totalCount / 5)
      expect(formatDetailedSpy).toHaveBeenLastCalledWith(
        [],
        1,
        totalPages,
        databaseUserId
      )
      expect(result).toEqual({ text: 'T', keyboard: {} })

      // чистим, чтобы следующий bad начинал "с нуля"
      statsSpy.mockClear()
      formatDetailedSpy.mockClear()
      formatTaskSpy.mockClear()
    }
  })
})
