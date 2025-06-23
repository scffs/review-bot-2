import { WizardScene } from '@mtcute/dispatcher'

import { registerCallbackHandlers } from './actions/registerCallbackHandlers.ts'
import { registerSteps } from './actions/registerSteps.ts'
import { setup } from './actions/setup.ts'

import type { RegistrationState } from './types.ts'

export class RegistrationScene {
  scene: WizardScene<RegistrationState>

  constructor() {
    this.scene = new WizardScene<RegistrationState>('/register')
  }

  registerCallbackHandlers = registerCallbackHandlers
  registerSteps = registerSteps
  setup = setup
}

export const registrationScene = new RegistrationScene()
