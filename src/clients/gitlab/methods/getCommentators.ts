import type { TeamMember } from '@database'

import { di } from '@di'

import { logger } from '@utils'

import type { GitLabService } from '../index.ts'

/**
 * Получение списка участников, оставивших комментарии в Merge Request.
 * Метод анализирует обсуждения MR, находит пользовательские комментарии
 * и формирует список комментаторов с их данными.
 *
 * @param mergeRequestId - ID Merge Request
 * @returns Promise, разрешающийся в массив членов команды, оставивших комментарии
 */
export async function getCommentators(
  this: GitLabService,
  mergeRequestId: number
): Promise<TeamMember[]> {
  try {
    // Получение всех обсуждений (threads) для указанного Merge Request
    const threads = await this.getMrThreads(mergeRequestId)

    // Фильтрация тредов, содержащих пользовательские комментарии (DiffNote)
    // DiffNote - это комментарии к изменениям кода, а не системные сообщения
    const userComments = threads.filter((discussion) =>
      discussion.notes?.some((note) => note.type === 'DiffNote')
    )

    const commentators: TeamMember[] = [] // Массив для хранения комментаторов

    // Проход по каждому треду с комментариями
    for (const comment of userComments) {
      const authorId = comment.notes?.[0].author.id // Получаем ID автора первого комментария в треде

      if (!authorId) {
        logger.fatal(authorId, 'Комментарий от неизвестного пользователя')
        continue
      }

      // Поиск автора комментария в базе данных по GitLab ID
      const author = await di.user.getByGitlabId(authorId)

      if (!author) {
        logger.fatal(author, 'Комментарий от неизвестного пользователя')
        continue
      }

      // Получаем вакансии пользователя из базы данных
      const userVacancies = await di.userVacancy.findByUserId(author.id)
      // Преобразуем в массив названий вакансий
      const vacancies = userVacancies.map((uv) => uv.vacancy)

      // Добавление автора в список комментаторов
      commentators.push({
        gitlabId: author.gitlabId,
        weeekId: author.weeekId,
        telegramLink: `https://t.me/${author.telegramUsername}`,
        vacancy: vacancies,
        name: author.name
      })
    }

    return commentators
  } catch (error) {
    logger.error(error, 'Ошибка при получении участников MR:')
    throw new Error('Не удалось получить список участников.')
  }
}
