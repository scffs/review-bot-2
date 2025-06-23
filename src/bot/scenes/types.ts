import type {
  MessageContext,
  UpdateState,
  WizardSceneAction
} from '@mtcute/dispatcher'

export type SceneStepHandler<State extends object> = (
  msg: MessageContext,
  state: UpdateState<State>
) => Promise<WizardSceneAction | number>
