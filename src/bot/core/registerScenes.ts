import type { DispatcherWithStorage } from '@bot'

import { registrationScene } from '../scenes'

/**
 * Регистрация сцен для бота.
 */
export const registerScenes = (dp: DispatcherWithStorage) => {
  registrationScene.setup(dp)
}
