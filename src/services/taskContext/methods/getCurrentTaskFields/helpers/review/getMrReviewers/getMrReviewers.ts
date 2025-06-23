import { z } from 'zod'

import {
  type TagType,
  type TeamMember,
  type Vacancies,
  type Vacancy,
  teamMemberSchema,
  userVacancySchema
} from '@database'

import { di } from '@di'

import type { MrField } from 'clients/weeek'

import { addByGitlabId, removeByGitlabId } from './helpers.ts'

// const reviewerSchema = z.object({
//   name: z.string(),
//   link: z.string().url()
// })

const reviewersResultSchema = z.object({
  total: z.number(),
  unresolved: z.array(teamMemberSchema),
  reviewNeeded: z.array(teamMemberSchema)
})

export const getMrReviewers = async (
  mrId: number,
  tags: TagType[],
  assignees: TeamMember[]
): Promise<MrField['reviewers']> => {
  // Получаем список утверждающих для merge request
  const approvers = await di.gitlab.getApprovers(mrId)
  // Получаем список комментаторов для merge request
  const commentators = await di.gitlab.getCommentators(mrId)

  // Удаляем из списков утверждающих и комментаторов тех, кто уже назначен на задачу
  for (const assigned of assignees) {
    removeByGitlabId(approvers, assigned)
    removeByGitlabId(commentators, assigned)
  }

  // Инициализируем пустой массив для хранения ревьюверов
  const reviewers: TeamMember[] = []
  // Проверяем, является ли тег одним из интересующих нас (Frontend, Backend, Pixi, Docs, Fullstack)
  const vacancies = [
    'Frontend',
    'Backend',
    'Pixi',
    'DevOps',
    'Fullstack'
  ] as TagType[]

  // Проходим по тегам задачи
  for (const tag of tags) {
    if (!vacancies.includes(tag)) {
      continue
    }

    // Получаем всех пользователей из базы данных
    const users = await di.user.findAll()
    // Преобразуем пользователей в объекты TeamMember, включая их вакансии
    const teamMembers: TeamMember[] = await Promise.all(
      users.map(async (user) => {
        const userVacancies = await di.userVacancy.findByUserId(user.id)

        const vacancies = userVacancies.map((uv) => {
          // Валидируем каждую вакансию
          return userVacancySchema.parse(uv.vacancy)
        })

        return teamMemberSchema.parse({
          gitlabId: user.gitlabId,
          weeekId: user.weeekId,
          telegramLink: `https://t.me/${user.telegramUsername}`,
          vacancy: vacancies,
          name: user.name
        })
      })
    )

    // Фильтруем членов команды по тегу и добавляем их в список reviewers
    const isFullstack = tag === 'Fullstack'
    const fullVacs = ['Backend', 'Frontend'] as Vacancies[]

    for (const member of teamMembers) {
      const isMemberNeeded = isFullstack
        ? // @ts-ignore
          member.vacancy.some((v) => fullVacs.includes(v))
        : member.vacancy.includes(tag as Vacancy)

      if (isMemberNeeded) {
        addByGitlabId(reviewers, member)
      }
    }
  }

  // Добавляем комментаторов в список reviewers
  for (const commentator of commentators) {
    addByGitlabId(reviewers, commentator)
  }

  // Добавляем утверждающих в список reviewers
  for (const approver of approvers) {
    addByGitlabId(reviewers, approver)
  }

  // Удаляем из списка reviewers тех, кто уже назначен на задачу
  for (const assigned of assignees) {
    removeByGitlabId(reviewers, assigned)
  }

  // Инициализируем массив для тех, кто еще не утвердил merge request
  const reviewNeeded: TeamMember[] = []

  // Формируем список тех, кто еще не утвердил merge request
  for (const item of reviewers) {
    if (!approvers.find((member) => member.gitlabId === item.gitlabId)) {
      addByGitlabId(reviewNeeded, item)
    }
  }

  // Возвращаем объект с информацией о ревьюверах
  const result = {
    total: reviewers.length,
    unresolved: reviewers
      .filter(
        (reviewer) => !approvers.some((a) => a.gitlabId === reviewer.gitlabId)
      )
      .map((reviewer) =>
        teamMemberSchema.parse({
          gitlabId: reviewer.gitlabId,
          weeekId: reviewer.weeekId,
          telegramLink: reviewer.telegramLink,
          vacancy: reviewer.vacancy,
          name: reviewer.name
        })
      ),
    reviewNeeded
  }

  return reviewersResultSchema.parse(result)
}
