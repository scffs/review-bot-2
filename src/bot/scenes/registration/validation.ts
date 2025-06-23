import { type ZodTypeAny, z } from 'zod'

import { roleEnumZod } from '@database'
import { INT32_MAX } from '@utils'

import type { Field } from './types.ts'

export const schemas: Record<Field, ZodTypeAny> = {
  name: z
    .string({
      required_error: 'Имя обязательно',
      invalid_type_error: 'Имя должно быть строкой'
    })
    .min(1, 'Имя не может быть пустым'),

  lastName: z
    .string({
      required_error: 'Фамилия обязательна',
      invalid_type_error: 'Фамилия должна быть строкой'
    })
    .min(1, 'Фамилия не может быть пустой'),

  telegramId: z.coerce
    .number({
      required_error: 'Telegram ID обязателен',
      invalid_type_error: 'Telegram ID должен быть числом'
    })
    .int('Telegram ID должен быть целым числом')
    .positive('Telegram ID должен быть положительным')
    .min(1, 'Telegram ID должен быть не менее 1'),

  gitlabId: z.coerce
    .number({
      required_error: 'GitLab ID обязателен',
      invalid_type_error: 'GitLab ID должен быть числом'
    })
    .int('GitLab ID должен быть целым числом')
    .positive('GitLab ID должен быть положительным')
    .max(INT32_MAX, `GitLab ID слишком большой — не более ${INT32_MAX}`),

  telegramUsername: z
    .string()
    .min(5, {
      message: 'Телеграмм username должен содержать не менее 5 символов'
    })
    .regex(/^[a-zA-Z0-9_]{5,32}$/, {
      message:
        'Телеграмм username может включать только буквы, цифры и нижнее подчеркивание, и должен быть длиной от 5 до 32 символов'
    }),

  weeekId: z
    .string({
      required_error: 'Weeek ID обязателен',
      invalid_type_error: 'Weeek ID должен быть строкой'
    })
    .uuid('Weeek ID должен быть валидным UUID'),

  birthday: z
    .string({
      required_error: 'Дата рождения обязательна',
      invalid_type_error: 'Дата рождения должна быть строкой'
    })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Формат даты: YYYY-MM-DD'),

  role: z.nativeEnum(roleEnumZod.enum, {
    errorMap: () => ({ message: 'Неверная роль. Введите одну из допустимых.' })
  }),

  vacancies: z
    .string({
      required_error: 'Список вакансий обязателен',
      invalid_type_error: 'Вакансии должны быть строкой'
    })
    .nonempty('Список вакансий не может быть пустым')
    .transform((s) => s.split(',').map((x) => x.trim()))
}
