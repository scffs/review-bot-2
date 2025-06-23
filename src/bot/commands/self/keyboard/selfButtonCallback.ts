import { CallbackDataBuilder } from '@mtcute/dispatcher'

export const SelfButtonCallback = new CallbackDataBuilder(
  'self',
  'action',
  'userId',
  'page'
)
