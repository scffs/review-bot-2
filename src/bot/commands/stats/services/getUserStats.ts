import { di } from '@di'

import type { UserStats } from '../types.ts'

export async function getUserStats(userId: number): Promise<UserStats> {
  const topAddition = await di.mrReview.getTopAdditionsTask(userId)
  const topDeletion = await di.mrReview.getTopDeletionsTask(userId)
  const topChanges = await di.mrReview.getTopChangedFilesTask(userId)

  const allData = await di.mrReview.getStatsForAllTime(userId)

  const topCommentsTask = await di.reviewStat.getTopCommentsTask(userId)
  const totalComments = await di.reviewStat.getAllComments(userId)

  const totalBugs = await di.testDetail.getTotalBugsResolved(userId)
  const topBugs = await di.testDetail.getTopBugsTask(userId)

  return {
    ...allData,
    totalBugsResolved: totalBugs,
    totalComments: totalComments,
    topCommentTask: topCommentsTask,
    topAdditionsTask: topAddition,
    topDeletionsTask: topDeletion,
    topBugTask: topBugs,
    topFilesChangedTask: topChanges
  }
}
