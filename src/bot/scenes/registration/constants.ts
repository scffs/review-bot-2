import { roleEnumZod, userVacancySchema } from '@database'

import type { RegistrationForm } from './types.ts'

export const prompts: Record<keyof RegistrationForm, string> = {
  name: 'Введите имя:',
  lastName: 'Введите фамилию:',
  telegramId: 'Введите Telegram ID:',
  telegramUsername: 'Введите Telegram username:',
  gitlabId: 'Введите GitLab ID:',
  weeekId: 'Введите Weeek ID:',
  birthday: 'Введите дату рождения (YYYY-MM-DD):',
  role: `Введите роль (${Object.keys(roleEnumZod.enum).join(', ')}):`,
  vacancies: `Введите вакансии через запятую (${Object.keys(userVacancySchema.enum).join(', ')}):`
} as const

export const stepOrder: Array<keyof RegistrationForm> = [
  'name',
  'lastName',
  'telegramId',
  'telegramUsername',
  'gitlabId',
  'weeekId',
  'birthday',
  'role',
  'vacancies'
] as const
