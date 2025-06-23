import type { TaskFieldsForSummary } from '@types'

import { di } from '@di'

import type { TaskWithRelations, UserId } from '@database'

export async function getAssigneesDetails(assignee: { userId: UserId }) {
  const user = await di.user.getById(assignee.userId)

  if (!user) {
    throw new Error('Неизвестный User ID')
  }

  return {
    gitlabId: user.gitlabId,
    weeekId: user.weeekId,
    telegramLink: `https://t.me/${user.telegramUsername}`,
    vacancy: user.vacancy,
    name: user.name
  }
}

export async function getFormattedTask(
  task: TaskWithRelations
): Promise<TaskFieldsForSummary> {
  // Получаем детали исполнителей
  const assigneesWithDetails = await Promise.all(
    (task.assignees || []).map(getAssigneesDetails)
  )

  // Обрабатываем тесты
  const formattedTests: TaskFieldsForSummary['tests'] = {
    total: 0,
    unresolved: [],
    isNeeded: false,
    all: [],

    isCompleted: false,
    isStarted: false,
    taskUrl: ''
  }

  if (task.test) {
    // Берём все детали из новой таблицы
    const details = await di.testDetail.findByTestId(task.test.id)
    formattedTests.all = details.map((d) => ({
      name: d.name,
      link: d.link,
      isCompleted: d.isCompleted
    }))
    formattedTests.unresolved = formattedTests.all.filter((d) => !d.isCompleted)
    formattedTests.total = formattedTests.all.length
    formattedTests.isNeeded = task.test.isNeeded
    formattedTests.isStarted = task.test.isStarted
    formattedTests.isCompleted = task.test.isCompleted
    formattedTests.taskUrl = task.test.taskUrl || ''
  }

  // Обрабатываем MR
  let formattedMr = null
  if (task.mrReview) {
    // Рецензенты
    const [unresolvedReviewers, reviewers] = await Promise.all([
      di.mrReviewer.findUnresolvedByMrReviewId(task.mrReview.id),
      di.mrReviewer.findByMrReviewId(task.mrReview.id)
    ])

    const reviewerUsers = await Promise.all(
      reviewers.map(async (reviewer) => {
        const user = await di.user.getById(reviewer.userId)
        if (!user) {
          throw new Error('Неизвестный User ID')
        }

        return {
          gitlabId: user.gitlabId,
          weeekId: user.weeekId,
          telegramLink: `https://t.me/${user.telegramUsername}`,
          vacancy: user.vacancy,
          name: user.name
        }
      })
    )

    // Комментарии
    const comments = await di.mrComment.findByMrReviewId(task.mrReview.id)
    const commentsByUser = new Map<UserId, { id: number; link: string }[]>()

    for (const comment of comments) {
      const userComments = commentsByUser.get(comment.assignedUserId) || []
      userComments.push({ id: comment.commentId, link: comment.commentLink })
      commentsByUser.set(comment.assignedUserId, userComments)
    }

    const actionsNeeded = await Promise.all(
      Array.from(commentsByUser.entries()).map(
        async ([userId, userComments]) => {
          const user = await di.user.getById(userId)
          if (!user) {
            throw new Error('Неизвестный User ID')
          }

          return {
            assigned: {
              gitlabId: user.gitlabId,
              weeekId: user.weeekId,
              telegramLink: `https://t.me/${user.telegramUsername}`,
              vacancy: user.vacancy,
              name: user.name
            },
            comments: userComments
          }
        }
      )
    )

    // Участники комментариев
    const commentedUsers = await di.mrCommentedUser.findByMrReviewId(
      task.mrReview.id
    )
    const peopleCommented = await Promise.all(
      commentedUsers.map(async (commenter) => {
        const user = await di.user.getById(commenter.userId)
        if (!user) {
          throw new Error('Неизвестный User ID')
        }

        return {
          gitlabId: user.gitlabId,
          weeekId: user.weeekId,
          telegramLink: `https://t.me/${user.telegramUsername}`,
          vacancy: user.vacancy,
          name: user.name
        }
      })
    )

    formattedMr = {
      branchBehindBy: task.mrReview.branchBehindBy,
      hasConflicts: task.mrReview.hasConflicts,
      changedFilesCount: task.mrReview.changedFilesCount || 0,
      additions: task.mrReview.additions || 0,
      deletions: task.mrReview.deletions || 0,
      durationSeconds: task.mrReview.durationSeconds || 0,

      comments: {
        total: task.mrReview.totalComments,
        unresolved: task.mrReview.unresolvedComments,
        actionsNeeded: actionsNeeded.filter(Boolean),
        peopleCommented: peopleCommented.filter(Boolean)
      },
      reviewers: {
        total: task.mrReview.totalReviewers,
        unresolved: await Promise.all(
          unresolvedReviewers.map(async (reviewer) => {
            const user = await di.user.getById(reviewer.userId)
            if (!user) {
              throw new Error('Неизвестный User ID')
            }

            const vacancies = user.vacancy

            return {
              gitlabId: user.gitlabId,
              weeekId: user.weeekId,
              telegramLink: `https://t.me/${user.telegramUsername}`,
              vacancy: vacancies,
              name: user.name
            }
          })
        ),
        reviewNeeded: reviewerUsers.filter(Boolean)
      }
    }
  }

  return {
    title: task.title,
    taskUrl: task.taskUrl,
    mrUrl: task.mrUrl,
    mrId: task.mrId,
    isEmergency: task.isEmergency,
    assignees: assigneesWithDetails,
    mr: formattedMr,
    tests: formattedTests,
    isCompleted: task.isCompleted
  }
}
