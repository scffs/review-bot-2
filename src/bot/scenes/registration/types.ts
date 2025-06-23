import type { roleEnumZod, userVacancySchema } from '@database'

import type { SceneStepHandler } from '../types.ts'

export type RegistrationForm = {
  name: string
  lastName: string
  telegramId: number
  telegramUsername: string
  gitlabId: number
  weeekId: string
  birthday: string
  role: keyof typeof roleEnumZod.enum
  vacancies: (keyof typeof userVacancySchema.enum)[]
}

export type RegistrationState = Partial<RegistrationForm> & {
  review?: boolean
}

export type RegisterSceneStepHandler = SceneStepHandler<RegistrationState>

export type Field = keyof RegistrationForm
