import type { SnakeToCamel } from '@types'

import { CONFIG } from '@config'
import { logger } from '@utils'

import type { GitLabService } from '../index'

/**
 * Интерфейс, описывающий структуру ответа GitLab API для Merge Request.
 * Содержит информацию о количестве расходящихся коммитов и наличии конфликтов.
 */
interface GitlabMergeRequestResponse {
  /**
   * Количество коммитов, на которые целевая ветка опережает ветку MR.
   */
  diverged_commits_count: number

  /**
   * Флаг, указывающий на наличие конфликтов слияния.
   */
  has_conflicts: boolean
}

/**
 * Тип, преобразующий ключи из snake_case в camelCase для GitlabMergeRequestResponse.
 * Использует утилитарный тип SnakeToCamel для преобразования.
 */
type GitlabMergeRequest = SnakeToCamel<GitlabMergeRequestResponse>

/**
 * Получение информации о Merge Request.
 * Метод делает запрос к GitLab API для получения данных о MR,
 * включая количество расходящихся коммитов и наличие конфликтов.
 *
 * @param mergeRequestId - ID Merge Request
 * @returns Promise, разрешающийся в объект с информацией о MR в формате camelCase
 */
export async function getMrInfo(
  this: GitLabService,
  mergeRequestId: number
): Promise<GitlabMergeRequest> {
  try {
    // Получаем информацию о Merge Request через GitLab API
    const mergeRequest = await this.api.MergeRequests.show(
      CONFIG.gitlab.projectId, // ID проекта из конфигурации
      mergeRequestId, // ID Merge Request, переданный в параметре
      {
        includeDivergedCommitsCount: true // Запрашиваем информацию о расходящихся коммитах
      }
    )

    // Преобразуем ключи из snake_case в camelCase и возвращаем результат
    return {
      divergedCommitsCount: Number(mergeRequest.diverged_commits_count),
      hasConflicts: mergeRequest.has_conflicts
    }
  } catch (error) {
    logger.error(error, 'Ошибка при получении информации о MR: ')
    throw new Error('Не удалось получить информацию о MR.')
  }
}
