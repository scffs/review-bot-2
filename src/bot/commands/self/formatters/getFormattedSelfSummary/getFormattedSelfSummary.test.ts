// @ts-nocheck
import { afterEach, beforeEach, describe, expect, it, jest } from 'bun:test'

import { di } from '@di'

import * as utils from '../../keyboard'

import { getFormattedSelfSummary } from './getFormattedSelfSummary.ts'

describe('getFormattedSelfSummary', () => {
  const userId = 7
  const fakeUser = { id: userId, name: 'Alice' }
  let getByIdSpy: jest.SpyInstance
  let mainKbSpy: jest.SpyInstance

  beforeEach(() => {
    getByIdSpy = jest.spyOn(di.user, 'getById')
    mainKbSpy = jest.spyOn(utils, 'createMainSelfKeyboard')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('возвращает текст и keyboard при существующем пользователе', async () => {
    // подготовка
    getByIdSpy.mockResolvedValueOnce(fakeUser)
    mainKbSpy.mockReturnValueOnce({ kb: 'main' })

    const stats = {
      completed: [1, 2],
      inTesting: [3],
      inProgress: []
    }

    const result = await getFormattedSelfSummary(stats, userId)

    // проверяем вызовы
    expect(getByIdSpy).toHaveBeenCalledWith(userId)
    expect(mainKbSpy).toHaveBeenCalledWith(userId)

    // текст
    expect(result.text).toContain('Краткая статистика твоих задач:')
    expect(result.text).toContain('✅ Завершено: 2')
    expect(result.text).toContain('🧪 В тестировании: 1')

    // keyboard
    expect(result.keyboard).toEqual({ kb: 'main' })
  })

  it('кидает ошибку, если пользователь не найден', async () => {
    getByIdSpy.mockResolvedValueOnce(null)

    await expect(
      getFormattedSelfSummary(
        { completed: [], inTesting: [], inProgress: [] },
        userId
      )
    ).rejects.toThrow('Пользователь не найден')
  })
})
