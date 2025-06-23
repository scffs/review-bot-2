import { z } from 'zod'

// Определение схемы для переменных окружения
const envSchema = z.object({
  DB_URL: z.string().min(1, 'DB_URL обязателен'),
  //
  API_ID: z
    .string()
    .transform(Number)
    .refine((val) => !Number.isNaN(val), {
      message: 'API_ID должен быть валидным числом'
    }),
  ADMIN_ID: z
    .string()
    .transform(Number)
    .refine((val) => !Number.isNaN(val), {
      message: 'ADMIN_ID должен быть валидным числом'
    }),
  API_HASH: z.string().min(1, 'API_HASH обязателен'),
  BOT_TOKEN: z.string().min(1, 'BOT_TOKEN обязателен'),
  //
  GITLAB_TOKEN: z.string().min(1, 'GITLAB_TOKEN обязателен'),
  GITLAB_HOST: z.string().min(1, 'GOOGLE_HOST обязателен'),
  GITLAB_PROJECT_NAME: z.string().min(1, 'GITLAB_PROJECT_NAME обязателен'),
  GITLAB_PROJECT_ID: z
    .string()
    .transform(Number)
    .refine((val) => !Number.isNaN(val), {
      message: 'GITLAB_PROJECT_ID должен быть валидным числом'
    }),
  //
  GOOGLE_COOKIE: z.string().min(1, 'GOOGLE_COOKIE обязателен'),
  //
  WEEEK_TOKEN: z.string().min(1, 'WEEEK_TOKEN обязателен'),
  WEEEK_PROJECT_ID: z
    .string()
    .transform(Number)
    .refine((val) => !Number.isNaN(val), {
      message: 'WEEEK_PROJECT_ID должен быть валидным числом'
    }),
  WEEEK_TESTS_BOARD_ID: z
    .string()
    .transform(Number)
    .refine((val) => !Number.isNaN(val), {
      message: 'WEEEK_TESTS_BOARD_ID должен быть валидным числом'
    }),
  REVIEW_WEEEK_COLUMN_ID: z
    .string()
    .transform(Number)
    .refine((val) => !Number.isNaN(val), {
      message: 'WEEEK_COLUMN_ID должен быть валидным числом'
    }),
  COMPLETED_WEEEK_COLUMN_ID: z
    .string()
    .transform(Number)
    .refine((val) => !Number.isNaN(val), {
      message: 'COMPLETED_WEEEK_COLUMN_ID должен быть валидным числом'
    }),
  WEEEK_BOARD_ID: z
    .string()
    .transform(Number)
    .refine((val) => !Number.isNaN(val), {
      message: 'WEEEK_BOARD_ID должен быть валидным числом'
    }),
  WEEEK_WORKSPACE_ID: z
    .string()
    .transform(Number)
    .refine((val) => !Number.isNaN(val), {
      message: 'WEEEK_WORKSPACE_ID должен быть валидным числом'
    }),
  //
  TELEGRAM_CHAT_ID: z
    .string()
    .transform(Number)
    .refine((val) => !Number.isNaN(val), {
      message: 'TELEGRAM_CHAT_ID должен быть валидным числом'
    })
})

// Получение переменных окружения из Bun.env
const env = process.env

// Валидация переменных окружения
const parsedEnv = envSchema.safeParse(env)

if (!parsedEnv.success) {
  console.error('Ошибки валидации:', parsedEnv.error.format())
  throw new Error('Некорректные переменные окружения')
}

// Экспорт валидированных переменных
export const {
  API_ID,
  API_HASH,
  BOT_TOKEN,
  GITLAB_TOKEN,
  GITLAB_HOST,
  DB_URL,
  WEEEK_TOKEN,
  ADMIN_ID,
  GOOGLE_COOKIE,
  GITLAB_PROJECT_NAME,
  COMPLETED_WEEEK_COLUMN_ID,
  GITLAB_PROJECT_ID,
  WEEEK_PROJECT_ID,
  REVIEW_WEEEK_COLUMN_ID,
  WEEEK_TESTS_BOARD_ID,
  WEEEK_WORKSPACE_ID,
  WEEEK_BOARD_ID,
  TELEGRAM_CHAT_ID
} = parsedEnv.data
