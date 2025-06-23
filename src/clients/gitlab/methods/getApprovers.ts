import type { TeamMember } from '@database'

import { di } from '@di'

import { logger } from '@utils'

import type { GitLabService } from '../index.ts'

/**
 * Получение списка пользователей, одобривших Merge Request.
 * Метод анализирует обсуждения MR, находит сообщения об одобрении
 * и формирует список аппруверов с их данными.
 *
 * @param mergeRequestId - ID Merge Request
 * @returns Promise, разрешающийся в массив членов команды, одобривших MR
 */
export async function getApprovers(
  this: GitLabService,
  mergeRequestId: number
): Promise<TeamMember[]> {
  try {
    // Получаем все обсуждения для указанного MR
    const threads = await this.getMrThreads(mergeRequestId)
    const approvers: TeamMember[] = [] // Массив для хранения аппруверов

    // Проходим по каждому обсуждению
    for (const item of threads) {
      if (!item.notes?.length) {
        continue
      }

      // Получаем информацию об авторе первой заметки в обсуждении
      const author = await di.user.getByGitlabId(item.notes[0].author.id)

      // Если автор не найден в базе данных, пропускаем его
      if (!author) {
        continue
      }

      // Если заметка содержит сообщение об отмене одобрения
      if (item.notes[0].body.includes('unapproved this merge request')) {
        // Ищем автора в списке аппруверов
        const approvedAuthor = approvers.find(
          (member) => member.gitlabId === author.gitlabId
        )
        // Если автор найден, удаляем его из списка аппруверов
        if (approvedAuthor) {
          const index = approvers.indexOf(approvedAuthor)
          approvers.splice(index, 1)
        }
        continue
      }

      // Если заметка содержит сообщение об одобрении
      if (item.notes[0].body.includes('approved this merge request')) {
        // Получаем вакансии пользователя из базы данных
        const userVacancies = await di.userVacancy.findByUserId(author.id)
        const vacancies = userVacancies.map((uv) => uv.vacancy)

        // Добавляем автора в список аппруверов
        approvers.push({
          gitlabId: author.gitlabId,
          weeekId: author.weeekId,
          telegramLink: `https://t.me/${author.telegramUsername}`,
          vacancy: vacancies,
          name: author.name
        })
      }
    }

    return approvers
  } catch (error) {
    logger.error(error, 'Ошибка при получении аппруверов MR:')
    throw new Error('Не удалось получить список аппруверов.')
  }
}
