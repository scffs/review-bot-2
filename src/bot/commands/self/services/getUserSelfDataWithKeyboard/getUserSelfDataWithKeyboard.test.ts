// @ts-nocheck
import { afterEach, beforeEach, describe, expect, it, jest } from 'bun:test'
import { md } from '@mtcute/bun'

import { di } from '@di'

import * as handlerModule from '../../handler'
import { SelfKeyboardActions } from '../../keyboard'
import { getUserSelfDataWithKeyboard } from '../index.ts'

describe('getUserSelfDataWithKeyboard', () => {
  const telegramId = 555
  let getByTelegramIdSpy: jest.SpyInstance
  let getSelfMessageSpy: jest.SpyInstance
  let state: any
  let ctx: any

  beforeEach(() => {
    getByTelegramIdSpy = jest.spyOn(di.user, 'getByTelegramId')
    getSelfMessageSpy = jest.spyOn(handlerModule, 'getSelfMessage')

    state = { rateLimit: jest.fn().mockResolvedValue(undefined) }
    ctx = {
      user: { id: telegramId },
      answer: jest.fn().mockResolvedValue(undefined),
      getMessage: jest.fn(),
      editMessage: jest.fn().mockResolvedValue(undefined)
    }
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('должен вызывать ctx.answer с пустым объектом, если пользователь не найден', async () => {
    getByTelegramIdSpy.mockResolvedValueOnce(null)

    await getUserSelfDataWithKeyboard(ctx, state)

    expect(state.rateLimit).toHaveBeenCalledWith(
      SelfKeyboardActions.Refresh,
      2,
      1
    )
    expect(getByTelegramIdSpy).toHaveBeenCalledWith(telegramId)
    expect(ctx.answer).toHaveBeenCalledWith({})
    expect(ctx.getMessage).not.toHaveBeenCalled()
    expect(ctx.editMessage).not.toHaveBeenCalled()
  })

  it('должен не обновлять сообщение и вызывать ctx.answer, если содержимое совпадает', async () => {
    const fakeUser = { id: 42 }
    getByTelegramIdSpy.mockResolvedValueOnce(fakeUser)

    const fakeSummary = { text: 'Same text', keyboard: { k: 1 } }
    getSelfMessageSpy.mockResolvedValueOnce(fakeSummary)

    ctx.getMessage.mockResolvedValueOnce({
      textWithEntities: { text: 'Same text' }
    })

    await getUserSelfDataWithKeyboard(ctx, state)

    expect(state.rateLimit).toHaveBeenCalledWith(
      SelfKeyboardActions.Refresh,
      2,
      1
    )
    expect(getByTelegramIdSpy).toHaveBeenCalledWith(telegramId)
    expect(getSelfMessageSpy).toHaveBeenCalledWith(fakeUser.id)
    expect(ctx.getMessage).toHaveBeenCalled()
    expect(ctx.answer).toHaveBeenCalledWith({})
    expect(ctx.editMessage).not.toHaveBeenCalled()
  })

  it('должен обновлять сообщение через ctx.editMessage, если содержимое изменилось', async () => {
    const fakeUser = { id: 99 }
    getByTelegramIdSpy.mockResolvedValueOnce(fakeUser)

    const fakeSummary = { text: 'New text', keyboard: { kb: true } }
    getSelfMessageSpy.mockResolvedValueOnce(fakeSummary)

    ctx.getMessage.mockResolvedValueOnce({
      textWithEntities: { text: 'Old text' }
    })

    await getUserSelfDataWithKeyboard(ctx, state)

    expect(state.rateLimit).toHaveBeenCalledWith(
      SelfKeyboardActions.Refresh,
      2,
      1
    )
    expect(getByTelegramIdSpy).toHaveBeenCalledWith(telegramId)
    expect(getSelfMessageSpy).toHaveBeenCalledWith(fakeUser.id)
    expect(ctx.getMessage).toHaveBeenCalled()
    expect(ctx.editMessage).toHaveBeenCalledWith({
      text: md(fakeSummary.text),
      replyMarkup: fakeSummary.keyboard
    })
    expect(ctx.answer).not.toHaveBeenCalled()
  })
})
