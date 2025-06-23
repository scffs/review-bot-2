import { logger } from '@utils'

import { di } from '@di'

import type { TeamMember } from '@database'
import type { MrField } from 'clients/weeek'

export const getMrComments = async (
  mrId: number,
  mrUrl: string,
  assignees: TeamMember[]
): Promise<MrField['comments']> => {
  const threads = await di.gitlab.getMrThreads(mrId)

  // Фильтруем обсуждения, оставляя только те, что содержат комментарии к коду (DiffNote).
  // Это нужно, чтобы сосредоточиться на код-ревью, игнорируя общие замечания к merge request.
  const userComments = threads.filter((discussion) =>
    discussion.notes?.some((note) => note.type === 'DiffNote')
  )

  const peopleCommented: Set<number> = new Set()

  for (const comments of userComments) {
    for (const note of comments.notes ?? []) {
      if (note.type === 'DiffNote') peopleCommented.add(note.author.id)
    }
  }

  // Фильтруем неразрешенные обсуждения. Проверяется только первый комментарий в цепочке.
  // В GitLab статус "неразрешено" зависит от всех комментариев, так что это упрощение может быть неточным.
  const unresolvedUserComments = userComments.filter(
    (comment) => !comment.notes?.[0].resolved
  )

  const actionsNeeded: {
    assigned: TeamMember
    comments: { id: number; link: string }[]
  }[] = []

  // Функция добавляет задачу в actionsNeeded: кому-то нужно ответить на комментарий.
  // Ссылки формируются для удобного перехода к комментарию в интерфейсе GitLab.
  function addNeededAction(id: number, assigned: TeamMember) {
    const comment = { id, link: `${mrUrl}#note_${id}` }
    const action = actionsNeeded.find(
      (item) => item.assigned.gitlabId === assigned.gitlabId
    )
    if (action) {
      action.comments.push(comment)
    } else {
      actionsNeeded.push({ assigned, comments: [comment] })
    }
  }

  for (const comment of unresolvedUserComments) {
    if (!comment.notes?.length) {
      continue
    }

    comment.notes = comment.notes?.filter((item) => !item.system)

    const userId = comment.notes?.[0].author.id

    if (!userId) {
      continue
    }

    const user = await di.user.getByGitlabId(userId)

    // Если автор комментария не найден в базе, логируем ошибку и пропускаем.
    // Это предотвращает сбои, но может скрыть проблемы с синхронизацией данных.
    if (!user) {
      logger.error(`Комментарий от неавторизованного автора: ${userId}`)
      continue
    }

    const userVacancies = await di.userVacancy.findByUserId(user.id)
    const vacancies = userVacancies.map((uv) => uv.vacancy)

    const author: TeamMember = {
      gitlabId: user.gitlabId,
      weeekId: user.weeekId,
      telegramLink: `https://t.me/${user.telegramUsername}`,
      vacancy: vacancies,
      name: user.name
    }

    const lastComment = comment.notes[comment.notes.length - 1]

    // Логика определения, кто должен ответить:
    // - Если последний комментарий от автора обсуждения, отвечают все assignees.
    // - Если от другого человека, отвечает автор обсуждения.
    // Это отличается от типичного подхода, где автор кода отвечает на замечания.
    if (lastComment.author.id === author.gitlabId) {
      for (const assigned of assignees) {
        addNeededAction(lastComment.id, assigned)
      }
    } else {
      addNeededAction(lastComment.id, author)
    }
  }

  const commentedUsers = await Promise.all(
    [...peopleCommented].map(async (gitlabId) => {
      const user = await di.user.getByGitlabId(gitlabId)

      if (!user) {
        logger.warn({ gitlabId }, 'Пользователь не найден в БД')
        return null
      }

      const userVacancies = await di.userVacancy.findByUserId(user.id)
      const vacancies = userVacancies.map((uv) => uv.vacancy)

      return {
        gitlabId: user.gitlabId,
        weeekId: user.weeekId,
        telegramLink: `https://t.me/${user.telegramUsername}`,
        vacancy: vacancies,
        name: user.name
      }
    })
  )

  return {
    total: userComments.length,
    unresolved: unresolvedUserComments.length,
    actionsNeeded,
    peopleCommented: commentedUsers.filter(
      (user): user is TeamMember => user !== null
    )
  }
}
