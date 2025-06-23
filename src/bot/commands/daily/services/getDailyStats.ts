import { di } from '@di'

export const getDailyStats = async (userId: number) => {
  // Параллельно запрашиваем баги и задачи на ревью
  const [bugs, reviews] = await Promise.all([
    di.task.fetchBugsForUser(userId),
    di.task.fetchReviewsForUser(userId)
  ])

  // Возвращаем данные в одном объекте
  return { bugs, reviews }
}
