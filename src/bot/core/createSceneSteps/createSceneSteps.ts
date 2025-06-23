// @ts-nocheck
import {
  type MessageContext,
  type UpdateState,
  WizardSceneAction
} from '@mtcute/dispatcher'

/** Результат pre‑check’а */
export type PreCheckResult = boolean | WizardSceneAction

/** Подпись pre‑check‑хука для конкретного поля */
export type FieldPreCheck<Value, State extends object> = (
  ctx: MessageContext,
  state: UpdateState<State>,
  value: Value
) => Promise<PreCheckResult>

/**
 * Конфиг для одной «сцены»: какие поля, какие хуки,
 * и обёртки prompt/handleInput/navigate.
 */
export interface SceneConfig<
  Form,
  State extends object,
  Field extends keyof Form
> {
  fields: Field[]
  /** Опциональные pre‑check‑хуки по каждому полю */
  preChecks?: {
    [K in Field]?: FieldPreCheck<Form[K], State>
  }
  promptField: (
    ctx: MessageContext,
    state: UpdateState<State>,
    field: Field,
    step: number
  ) => Promise<WizardSceneAction>
  handleFieldInput: (
    ctx: MessageContext,
    field: Field
  ) => Promise<{ success: true; data: Form[Field] } | { success: false }>
  navigateNextOrExit: (
    ctx: MessageContext,
    state: UpdateState<State>,
    step: number
  ) => Promise<WizardSceneAction>
}

/**
 * Генерим массив шагов-обработчиков для всей формы.
 * Каждый шаг отвечает за обработку отдельного поля формы.
 */
export function createSceneSteps<
  Form,
  State extends object,
  Field extends keyof Form
>(
  config: SceneConfig<Form, State, Field>
): Array<
  (ctx: MessageContext, state: UpdateState<State>) => Promise<WizardSceneAction>
> {
  // Для каждого поля формы создаём отдельную функцию-обработчик шага
  return config.fields.map((field, index) => {
    return async function step(
      ctx: MessageContext,
      state: UpdateState<State>
    ): Promise<WizardSceneAction> {
      // Получаем текущее состояние пользователя
      const s = await state.get()

      // Если состояние отсутствует — сообщаем об ошибке и завершаем сцену
      if (!s) {
        await ctx.answerText(
          'Непредвиденная ошибка состояния. Попробуйте позже'
        )
        return WizardSceneAction.Exit
      }

      // Обрабатываем ввод пользователя для текущего поля
      // handleFieldInput валидирует и парсит данные
      const result = await config.handleFieldInput(ctx, field)

      // Если ввод невалиден — остаёмся на текущем шаге
      if (!result.success) {
        return WizardSceneAction.Stay
      }

      // Проверяем наличие дополнительной проверки (hook) для данного поля
      const hook = config.preChecks?.[field]
      if (hook) {
        // Выполняем дополнительную проверку с текущим контекстом, состоянием и данными
        const check = await hook(ctx, state, result.data)

        // Если проверка не пройдена — остаёмся на шаге
        if (check === false) {
          return WizardSceneAction.Stay
        }

        // Если проверка возвращает действие сцены (например, переход или выход) — возвращаем это действие
        if (check !== true) {
          return check
        }
      }

      // Сохраняем обработанные данные поля в состояние
      await state.merge({ [field]: result.data })

      // Переходим к следующему шагу (index + 1) или завершаем, если шагов больше нет
      return config.navigateNextOrExit(ctx, state, index + 1)
    }
  })
}
