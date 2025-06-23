import { beforeEach, describe, expect, it, jest } from 'bun:test'
import { WizardSceneAction } from '@mtcute/dispatcher'

import { type SceneConfig, createSceneSteps } from './createSceneSteps.ts'

describe('createSceneSteps', () => {
  type Form = { field1: string; field2: number }
  type State = { field1?: string; field2?: number }

  let ctx: any
  let state: any
  let config: any
  let steps: any

  beforeEach(() => {
    let internal: State | null = {}

    state = {
      get: jest.fn(() => Promise.resolve(internal)),
      merge: jest.fn((patch) => {
        internal = internal ? { ...internal, ...patch } : null
        return Promise.resolve()
      })
    }

    ctx = {
      answerText: jest.fn(() => Promise.resolve())
    }

    config = {
      fields: ['field1', 'field2'],
      promptField: jest.fn(() => Promise.resolve(WizardSceneAction.Next)),
      handleFieldInput: jest.fn(),
      navigateNextOrExit: jest.fn(),
      preChecks: {}
    } as SceneConfig<Form, State, keyof Form>

    steps = createSceneSteps<Form, State, keyof Form>(config)
  })

  it('должен выйти, когда state.get() возвращает null', async () => {
    state.get.mockResolvedValueOnce(null)

    const result = await steps[0](ctx, state)

    expect(ctx.answerText).toHaveBeenCalledWith(
      'Непредвиденная ошибка состояния. Попробуйте позже'
    )
    expect(result).toBe(WizardSceneAction.Exit)
  })

  it('должен остаться на шаге, когда handleFieldInput возвращает неуспех', async () => {
    state.get.mockResolvedValueOnce({})
    config.handleFieldInput.mockResolvedValueOnce({ success: false })

    const result = await steps[0](ctx, state)

    expect(result).toBe(WizardSceneAction.Stay)
  })

  it('должен остаться на шаге, когда preCheck возвращает false', async () => {
    state.get.mockResolvedValueOnce({})
    config.handleFieldInput.mockResolvedValueOnce({
      success: true,
      data: 'value1'
    })
    config.preChecks = { field1: jest.fn(() => Promise.resolve(false)) }

    const result = await steps[0](ctx, state)

    expect(config.preChecks.field1).toHaveBeenCalledWith(ctx, state, 'value1')
    expect(result).toBe(WizardSceneAction.Stay)
  })

  it('должен слить состояние и перейти к следующему шагу, когда preCheck отсутствует', async () => {
    state.get.mockResolvedValueOnce({})
    config.handleFieldInput.mockResolvedValueOnce({
      success: true,
      data: 'value1'
    })
    config.navigateNextOrExit.mockResolvedValueOnce(WizardSceneAction.Next)

    const result = await steps[0](ctx, state)

    expect(state.merge).toHaveBeenCalledWith({ field1: 'value1' })
    expect(config.navigateNextOrExit).toHaveBeenCalledWith(ctx, state, 1)
    expect(result).toBe(WizardSceneAction.Next)
  })

  it('должен вернуть действие из preCheck, когда он возвращает WizardSceneAction', async () => {
    state.get.mockResolvedValueOnce({})
    config.handleFieldInput.mockResolvedValueOnce({
      success: true,
      data: 'value1'
    })
    config.preChecks = {
      field1: jest.fn(() => Promise.resolve(WizardSceneAction.Exit))
    }

    const result = await steps[0](ctx, state)

    expect(config.preChecks.field1).toHaveBeenCalledWith(ctx, state, 'value1')
    expect(result).toBe(WizardSceneAction.Exit)
  })

  it('должен продолжить, когда preCheck возвращает true', async () => {
    state.get.mockResolvedValueOnce({})
    config.handleFieldInput.mockResolvedValueOnce({
      success: true,
      data: 'value1'
    })
    config.preChecks = { field1: jest.fn(() => Promise.resolve(true)) }
    config.navigateNextOrExit.mockResolvedValueOnce(WizardSceneAction.Next)

    const result = await steps[0](ctx, state)

    expect(config.preChecks.field1).toHaveBeenCalledWith(ctx, state, 'value1')
    expect(state.merge).toHaveBeenCalledWith({ field1: 'value1' })
    expect(config.navigateNextOrExit).toHaveBeenCalled()
    expect(result).toBe(WizardSceneAction.Next)
  })

  it('должен вернуть пустой массив шагов при отсутствии полей', () => {
    const emptyConfig = { ...config, fields: [] }
    const emptySteps = createSceneSteps<Form, State, keyof Form>(emptyConfig)

    expect(emptySteps).toHaveLength(0)
  })

  it('должен пройти два шага последовательно (интеграционный тест)', async () => {
    state.get.mockResolvedValue({})
    config.handleFieldInput
      .mockResolvedValueOnce({ success: true, data: 'v1' })
      .mockResolvedValueOnce({ success: true, data: 42 })
    config.navigateNextOrExit
      .mockResolvedValueOnce(WizardSceneAction.Next)
      .mockResolvedValueOnce(WizardSceneAction.Exit)

    const res1 = await steps[0](ctx, state)
    expect(res1).toBe(WizardSceneAction.Next)
    expect(state.merge).toHaveBeenCalledWith({ field1: 'v1' })

    const res2 = await steps[1](ctx, state)
    expect(res2).toBe(WizardSceneAction.Exit)
    expect(state.merge).toHaveBeenCalledWith({ field2: 42 })
  })
})
