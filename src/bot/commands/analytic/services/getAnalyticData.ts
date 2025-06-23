import {
  assignees,
  mrReviewers,
  mrReviews,
  reviewStats,
  tasks,
  testDetails,
  tests,
  users
} from '@database'
import { di } from '@di'
import { avg, count, eq, sql, sum } from 'drizzle-orm'
import { getAllComments } from '../../../../database/models/ReviewStats/methods'
import {
  type AnalyticDataParams,
  type AnalyticStats,
  AnalyticType,
  type DrizzleClient
} from '../types'

/**
 * Главная функция получения аналитических данных.
 * Делегирует получение конкретных данных по типу аналитики.
 *
 * @param db - клиент базы данных Drizzle
 * @param params - параметры запроса аналитики (тип, userId)
 * @returns Promise с агрегированными статистиками
 */
export const getAnalyticData = async (
  db: DrizzleClient,
  params: AnalyticDataParams
): Promise<AnalyticStats> => {
  const { type, userId } = params

  switch (type) {
    case AnalyticType.PERSONAL:
      return getPersonalAnalytics(db, userId)
    case AnalyticType.TEAM:
      return getTeamAnalytics(db)
    case AnalyticType.REVIEWS:
      return getReviewsAnalytics(db, userId)
    case AnalyticType.TASKS:
      return getTasksAnalytics(db, userId)
    default:
      throw new Error('Неизвестный тип аналитики')
  }
}

/**
 * Получение персональной аналитики по конкретному пользователю.
 * Считает количество завершённых и открытых задач, а также ревью пользователя.
 */
async function getPersonalAnalytics(
  db: DrizzleClient,
  userId: number
): Promise<AnalyticStats> {
  // Получаем все задачи, назначенные пользователю
  const userTasks = await db
    .select()
    .from(tasks)
    .leftJoin(assignees, eq(assignees.taskId, tasks.id))
    .where(eq(assignees.userId, userId))

  // Получаем все ревью, проведённые пользователем
  const userReviews = await db
    .select()
    .from(mrReviews)
    .leftJoin(mrReviewers, eq(mrReviewers.mrReviewId, mrReviews.id))
    .where(eq(mrReviewers.userId, userId))

  return {
    type: AnalyticType.PERSONAL,
    userStats: {
      completedTasks: userTasks.filter((t) => t.tasks?.isCompleted).length,
      openTasks: userTasks.filter((t) => !t.tasks?.isCompleted).length,
      reviewsGiven: userReviews.length,
      commentsLeft: await di.reviewStat.getAllComments(userId)
    }
  }
}

type ExtendedStats = {
  userId: number
  name: string
  completedTasks: number
  commentsLeft?: number
  bugsClosed?: number
}

/**
 * Получение аналитики по команде.
 * Считает общее количество завершённых и открытых задач,
 * среднее время ревью, а также топ 5 исполнителей.
 */
export async function getTeamAnalytics(
  db: DrizzleClient
): Promise<AnalyticStats> {
  // Считаем количество всех завершённых задач в команде
  const [{ totalCompleted }] = await db
    .select({ totalCompleted: count().as('totalCompleted') })
    .from(tasks)
    .where(eq(tasks.isCompleted, true))

  // Считаем количество всех открытых задач
  const [{ totalOpen }] = await db
    .select({ totalOpen: count().as('totalOpen') })
    .from(tasks)
    .where(eq(tasks.isCompleted, false))

  // Среднее время ревью в секундах
  const [{ avgReviewTimeSeconds }] = await db
    .select({
      avgReviewTimeSeconds: avg(mrReviews.durationSeconds).as(
        'avgReviewTimeSeconds'
      )
    })
    .from(mrReviews)

  // Общее количество закрытых багов
  const [{ totalResolvedBugs }] = await db
    .select({
      totalResolvedBugs: count(testDetails.id).as('totalResolvedBugs')
    })
    .from(testDetails)
    .innerJoin(tests, eq(testDetails.testId, tests.id))
    .where(eq(testDetails.isCompleted, true))

  // Общее количество ревью-комментариев
  const [{ totalReviewComments }] = await db
    .select({
      totalReviewComments: sum(reviewStats.commentsCount).as(
        'totalReviewComments'
      )
    })
    .from(reviewStats)

  // Переводим среднее время ревью в часы (округляем вверх)
  const avgReviewTimeHours = Math.ceil(Number(avgReviewTimeSeconds || 0) / 3600)

  // Получаем список пользователей с количеством завершённых задач каждого
  const usersWithStats = await db
    .select({
      id: users.id,
      name: users.name,
      completedCount:
        sql`COUNT(*) FILTER (WHERE ${tasks.isCompleted} = TRUE)`.as(
          'completedCount'
        )
    })
    .from(users)
    .leftJoin(assignees, eq(users.id, assignees.userId))
    .leftJoin(tasks, eq(tasks.id, assignees.taskId))
    .groupBy(users.id)

  const usersMap = new Map<number, ExtendedStats>()

  for (const user of usersWithStats) {
    usersMap.set(user.id, {
      userId: user.id,
      name: user.name,
      completedTasks: Number(user.completedCount || 0)
    })
  }

  // Комментарии по каждому пользователю
  const userComments = await db
    .select({
      userId: users.id,
      comments: sum(reviewStats.commentsCount).as('comments')
    })
    .from(reviewStats)
    .innerJoin(users, eq(users.gitlabId, reviewStats.userId))
    .groupBy(users.id)

  // Закрытые баги по каждому пользователю
  const userBugs = await db
    .select({
      userId: assignees.userId,
      bugsClosed: count().as('bugsClosed')
    })
    .from(testDetails)
    .innerJoin(tests, eq(testDetails.testId, tests.id))
    .innerJoin(assignees, eq(tests.taskId, assignees.taskId))
    .where(eq(testDetails.isCompleted, true))
    .groupBy(assignees.userId)

  console.log('userComments', userComments)

  for (const c of userComments) {
    const entry = usersMap.get(c.userId)
    console.log('entry', entry)
    if (entry) entry.commentsLeft = Number(c.comments || 0)
  }

  for (const b of userBugs) {
    const entry = usersMap.get(b.userId)
    if (entry) entry.bugsClosed = Number(b.bugsClosed || 0)
  }

  // Сортируем по количеству завершённых задач и берём топ 5
  const topPerformers = Array.from(usersMap.values())
    .filter((u) => u.completedTasks > 0)
    .sort((a, b) => b.completedTasks - a.completedTasks)
    .slice(0, 5)

  return {
    type: AnalyticType.TEAM,
    teamStats: {
      totalCompletedTasks: Number(totalCompleted || 0),
      totalOpenTasks: Number(totalOpen || 0),
      avgReviewTime: avgReviewTimeHours,
      topPerformers: topPerformers,
      totalResolvedBugs: Number(totalResolvedBugs || 0),
      totalReviewComments: Number(totalReviewComments || 0)
    }
  }
}

/**
 * Получение аналитики по ревью пользователя.
 * Считает количество ревью, проведённых пользователем.
 */
async function getReviewsAnalytics(
  db: DrizzleClient,
  userId: number
): Promise<AnalyticStats> {
  const reviews = await db
    .select()
    .from(mrReviews)
    .leftJoin(mrReviewers, eq(mrReviewers.mrReviewId, mrReviews.id))
    .where(eq(mrReviewers.userId, userId))

  return {
    type: AnalyticType.REVIEWS,
    userStats: {
      completedTasks: 0,
      openTasks: 0,
      reviewsGiven: reviews.length,
      commentsLeft: 0
    }
  }
}

/**
 * Получение аналитики по задачам пользователя.
 * Считает количество завершённых и открытых задач.
 */
async function getTasksAnalytics(
  db: DrizzleClient,
  userId: number
): Promise<AnalyticStats> {
  const userTasks = await db
    .select()
    .from(tasks)
    .leftJoin(assignees, eq(assignees.taskId, tasks.id))
    .where(eq(assignees.userId, userId))

  return {
    type: AnalyticType.TASKS,
    userStats: {
      completedTasks: userTasks.filter((t) => t.tasks.isCompleted).length,
      openTasks: userTasks.filter((t) => !t.tasks.isCompleted).length,
      reviewsGiven: 0,
      commentsLeft: 0
    }
  }
}
