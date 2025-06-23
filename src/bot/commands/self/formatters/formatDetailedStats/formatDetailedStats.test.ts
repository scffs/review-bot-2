// @ts-nocheck
import { afterEach, beforeEach, describe, expect, it, jest } from 'bun:test'

import type { TaskFieldsForSummary } from '@types'

import * as utils from '../../keyboard'
import * as detailsMod from '../getFormattedTaskDetails/getFormattedTaskDetails.ts'

import { formatDetailedStats } from './formatDetailedStats.ts'

describe('formatDetailedStats', () => {
  const userId = 13
  let detailsSpy: jest.SpyInstance
  let backKbSpy: jest.SpyInstance
  let pagKbSpy: jest.SpyInstance

  beforeEach(() => {
    detailsSpy = jest.spyOn(detailsMod, 'getFormattedTaskDetails')
    backKbSpy = jest.spyOn(utils, 'createBackSelfKeyboard')
    pagKbSpy = jest.spyOn(utils, 'createSelfPaginationKeyboard')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('форматирует одну страницу, когда totalPages = 1', () => {
    const tasksPage = [{ foo: 'bar' }, { foo: 'baz' }] as TaskFieldsForSummary[]

    // пусть детали для каждой задачи будут "1. A" и "2. B"
    detailsSpy.mockReturnValueOnce('1. A').mockReturnValueOnce('2. B')
    backKbSpy.mockReturnValue({ kb: 'back' })

    const { text, keyboard } = formatDetailedStats(tasksPage, 1, 1, userId)

    // проверяем детали
    expect(detailsSpy).toHaveBeenNthCalledWith(1, tasksPage[0], 1)
    expect(detailsSpy).toHaveBeenNthCalledWith(2, tasksPage[1], 2)

    // проверяем текст
    expect(text).toContain('📊 Детальная статистика (1/1):')
    expect(text).toContain('1. A')
    expect(text).toContain('2. B')

    // keyboard должен быть из backKb
    expect(backKbSpy).toHaveBeenCalledWith(userId)
    expect(keyboard).toEqual({ kb: 'back' })
  })

  it('форматирует страницу с пагинацией, когда totalPages > 1', () => {
    const tasksPage = [{}, {}] as TaskFieldsForSummary[]
    detailsSpy.mockReturnValueOnce('X').mockReturnValueOnce('Y')
    pagKbSpy.mockReturnValue({ kb: 'page', page: 2, total: 3 })

    const { text, keyboard } = formatDetailedStats(tasksPage, 2, 3, userId)

    // вызовы
    expect(detailsSpy).toHaveBeenCalledTimes(2)
    expect(pagKbSpy).toHaveBeenCalledWith(userId, 2, 3)

    // текст
    expect(text).toContain('📊 Детальная статистика (2/3):')
    expect(text).toContain('X')
    expect(text).toContain('Y')

    // keyboard
    expect(keyboard).toEqual({ kb: 'page', page: 2, total: 3 })
  })
})
