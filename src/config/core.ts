import { WEEEK_API_URL } from './constants'

import {
  COMPLETED_WEEEK_COLUMN_ID,
  GITLAB_HOST,
  GITLAB_PROJECT_ID,
  GITLAB_TOKEN,
  REVIEW_WEEEK_COLUMN_ID,
  TELEGRAM_CHAT_ID,
  WEEEK_BOARD_ID,
  WEEEK_PROJECT_ID,
  WEEEK_TESTS_BOARD_ID,
  WEEEK_TOKEN,
  WEEEK_WORKSPACE_ID
} from './env'

export const CONFIG = {
  gitlab: {
    token: GITLAB_TOKEN,
    host: GITLAB_HOST,
    projectId: GITLAB_PROJECT_ID
  },
  weeek: {
    // ID всего пространства
    workspaceId: WEEEK_WORKSPACE_ID,
    apiUrl: WEEEK_API_URL,
    apiToken: WEEEK_TOKEN,
    // ID колонки "На ревью" (актуальные задачи)
    reviewColumnId: REVIEW_WEEEK_COLUMN_ID,
    // ID колонки "Завершено"
    completedColumnId: COMPLETED_WEEEK_COLUMN_ID,
    // ID доски "Dev Бэклог"
    boardId: WEEEK_BOARD_ID,
    projectId: WEEEK_PROJECT_ID,
    tests: {
      // ID доски "Test | Внутренее тестирование" для поиска подзадачи которая является задачей на тесты
      boardId: WEEEK_TESTS_BOARD_ID
    }
  },
  // ID чата для отправки сообщений о ревью
  chatId: TELEGRAM_CHAT_ID
}
