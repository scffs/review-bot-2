import { Gitlab } from '@gitbeaker/rest'

import { GITLAB_HOST, GITLAB_TOKEN } from '@config'

import { getApprovers } from './methods/getApprovers.ts'
import { getCommentators } from './methods/getCommentators.ts'
import { getMrInfo } from './methods/getMrInfo.ts'
import { getMrReviewStats } from './methods/getMrReviewStats.ts'
import { getMrSummaryStats } from './methods/getMrSummaryStats.ts'
import { getMrThreads } from './methods/getMrThreads.ts'
import { getUserById } from './methods/getUserById.ts'

/**
 * Сервис для работы с GitLab API.
 * Предоставляет методы для взаимодействия с GitLab, такие как получение информации о MR,
 * получение списков аппруверов, комментаторов и обсуждений.
 */
export class GitLabService {
  /**
   * Экземпляр клиента GitLab API из библиотеки 'gitlab'.
   * Используется для выполнения запросов к API GitLab.
   */
  protected api

  /**
   * Создает экземпляр сервиса GitLab.
   * Инициализирует клиент API с использованием токена и хоста из конфигурации.
   */
  constructor() {
    // Инициализация клиента GitLab API с использованием токена и хоста
    this.api = new Gitlab({
      token: GITLAB_TOKEN, // Токен для аутентификации в GitLab API
      host: GITLAB_HOST // URL-адрес GitLab сервера
    })
  }

  // Методы сервиса, импортированные из отдельных файлов

  /**
   * Возвращает информацию о Merge Request, включая количество расходящихся коммитов и наличие конфликтов.
   */
  getMrInfo = getMrInfo

  /**
   * Возвращает список пользователей, одобривших Merge Request.
   */
  getApprovers = getApprovers

  /**
   * Возвращает все обсуждения (threads) для указанного Merge Request.
   */
  getMrThreads = getMrThreads

  /**
   * Возвращает список пользователей, оставивших комментарии в Merge Request.
   */
  getCommentators = getCommentators

  /**
   * Возвращает данные пользователя GitLab по его ID.
   */
  getUserById = getUserById

  /**
   * Возвращает статистику MR: время от создания до мерджа,
   * число файлов, добавленных/удалённых строк и коммитов.
   */
  getMrSummaryStats = getMrSummaryStats

  /**
   * Получает кол-во комментариев от пользователей.
   */
  getMrReviewStats = getMrReviewStats
}
