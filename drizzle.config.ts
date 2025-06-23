import { defineConfig } from 'drizzle-kit'

import { DB_URL } from './src/config'

export default defineConfig({
  // Какая СУБД используется
  dialect: 'postgresql',
  // Путь до описанной схемы БД таблиц
  schema: './src/database/models/*.ts',
  // Папка, которая будет использоваться для данных Drizzle
  out: './drizzle',
  // Данные для подключения к БД
  dbCredentials: {
    url: DB_URL
  }
})
