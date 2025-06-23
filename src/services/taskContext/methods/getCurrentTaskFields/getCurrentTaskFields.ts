import type { TagType, TeamMember, Tx } from '@database'

import { CONFIG } from '@config'
import { di } from '@di'
import { logger } from '@utils'

import { type ReviewFields, type Task, weeek } from 'clients/weeek'

import { IMAGE_TYPES, VIDEO_TYPES } from './constants.ts'
import { filterAttachments, getMrComments, getMrReviewers } from './helpers'

// TODO: refactor

export async function getCurrentTaskFields(
  task: Task,
  tx?: Tx
): Promise<ReviewFields | undefined> {
  if (!task.id) {
    logger.error('ID задачи не найден')
    return
  }

  if (!task.userId) {
    logger.error('ID автора не найден')
    return
  }

  const user = await di.user.getByWeeekId(task.userId, tx)
  let assignees: TeamMember[] = []

  if (user) {
    const userVacancies = await di.userVacancy.findByUserId(user.id, tx)
    const vacancies = userVacancies.map((uv) => uv.vacancy)

    assignees = [
      {
        gitlabId: user.gitlabId,
        weeekId: user.weeekId,
        telegramLink: `https://t.me/${user.telegramUsername}`,
        vacancy: vacancies,
        name: user.name
      }
    ]
  }

  const tags: TagType[] = await Promise.all(
    task.tags?.map(async (tag: number) => {
      // Передаём ID тега из Weeek в метод для получения его из типа из БД.
      const tagValue = await weeek.getTagById(tag)
      return tagValue as TagType
    }) || []
  )

  // Достаём из кастомного поля
  let mrUrl: string | undefined = String(
    task.customFields?.filter((field) => field.name === 'MR')[0]?.value
  )

  const mrId = Number(mrUrl.split('/')[mrUrl.split('/').length - 1])
  const isMrUrlValid =
    /^https:\/\/gitlab\.kotbread\.ru\/kotbread\/gatto\/-\/merge_requests\/[\w\-]+$/.test(
      mrUrl
    )

  let mr: ReviewFields['mr'] = null
  // Убираем ссылку если не прошла валидация
  if (isMrUrlValid) {
    const mrInfo = await di.gitlab.getMrInfo(mrId)
    const mrComments = await getMrComments(mrId, mrUrl, assignees)
    const mrReviewers = await getMrReviewers(mrId, tags, assignees)

    // вот добавляем stats
    const stats = await di.gitlab.getMrSummaryStats(mrId)
    const durationSeconds =
      stats.duration.days * 86_400 +
      stats.duration.hours * 3_600 +
      stats.duration.minutes * 60 +
      stats.duration.seconds

    mr = {
      branchBehindBy: mrInfo.divergedCommitsCount,
      hasConflicts: mrInfo.hasConflicts,
      comments: mrComments,
      reviewers: mrReviewers,
      changedFilesCount: stats.changedFilesCount,
      additions: stats.additions,
      deletions: stats.deletions,
      durationSeconds
    }
  } else {
    mrUrl = undefined
  }

  let images = filterAttachments(task.attachments, IMAGE_TYPES)

  let videos = filterAttachments(task.attachments, VIDEO_TYPES)

  // убираем параметры, они только мешают
  images = images?.map((item) => {
    return item.split('?')[0]
  })

  // убираем параметры, они только мешают
  videos = videos?.map((item) => {
    return item.split('?')[0]
  })

  const taskUrl = `https://app.weeek.net/ws/${CONFIG.weeek.workspaceId}/project/${task.projectId}/board/${task.boardId}/m/task/${task.id}`

  const tests: ReviewFields['tests'] = {
    all: [],
    total: 0,
    unresolved: [],
    isNeeded: !(
      tags.includes('WithoutMediaTesting') || tags.includes('WithoutTesting')
    ),
    isCompleted: false,
    isStarted: false,
    taskUrl: null
  }

  if (tests.isNeeded) {
    const detailTasks = (
      await Promise.all(
        task.subTasks?.map(async (subId) => {
          const sub = await weeek.getTaskById(subId)

          return sub && sub.boardId === CONFIG.weeek.tests.boardId ? sub : null
        }) || []
      )
    ).filter((t): t is Task => t !== null)

    const hasTestTask = detailTasks.length > 0
    const firstDetail = detailTasks[0]

    if (hasTestTask) {
      const allDetails = (
        await Promise.all(
          detailTasks
            .flatMap(
              (sub) => sub.subTasks?.map((id) => ({ parent: sub, id })) || []
            )
            .map(async ({ id }) => {
              const bug = await weeek.getTaskById(id)

              if (!bug) {
                return null
              }
              return {
                name: bug.title || 'Без названия',
                link:
                  `https://app.weeek.net/ws/${CONFIG.weeek.workspaceId}` +
                  `/project/${bug.projectId}` +
                  `/board/${bug.boardId}` +
                  `/m/task/${bug.id}`,
                isCompleted: Boolean(bug.isCompleted)
              }
            })
        )
      ).filter(
        (t): t is { name: string; link: string; isCompleted: boolean } => !!t
      )

      tests.all = allDetails
      tests.total = allDetails.length
      tests.unresolved = allDetails
        .filter((t) => !t.isCompleted)
        .map(({ name, link }) => ({ name, link }))

      const isFinished = firstDetail.boardColumnId === 86

      tests.isStarted = isFinished || Boolean(allDetails.length)
      tests.isCompleted =
        (isFinished && allDetails.length === 0) ||
        allDetails.every((t) => t.isCompleted)

      if (firstDetail) {
        tests.taskUrl =
          `https://app.weeek.net/ws/${CONFIG.weeek.workspaceId}` +
          `/project/${firstDetail.projectId}` +
          `/board/${firstDetail.boardId}` +
          `/m/task/${firstDetail.id}`
      }
    }
  }

  // Срочная ли задача
  const isEmergency = tags.includes('Emergency')

  if (assignees.length > 1) {
    logger.fatal(assignees, 'assignees more than 1')
  }

  return {
    // Надеюсь вик обновят апи и воткнут туда массив исполнителей, а не одного... Пока так
    assignees,
    mrId: mrId,
    title: task.title || null,
    tags: tags || null,
    mrUrl: mrUrl || null,
    taskUrl,
    images: images || [],
    videos: videos || [],
    mr,
    tests,
    isEmergency
  }
}
