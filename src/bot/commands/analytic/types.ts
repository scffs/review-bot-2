import type { NodePgDatabase } from 'drizzle-orm/node-postgres'

import type * as schema from '../../../database/models'

export type DrizzleClient = NodePgDatabase<typeof schema>

export enum AnalyticType {
  TEAM = 'team',
  PERSONAL = 'personal',
  REVIEWS = 'reviews',
  TASKS = 'tasks'
}

export interface AnalyticDataParams {
  type: AnalyticType
  userId: number
  requestUserId: number
}

export interface AnalyticStats {
  type: AnalyticType
  userStats?: {
    completedTasks: number
    openTasks: number
    reviewsGiven: number
    commentsLeft: number
  }
  teamStats?: {
    totalCompletedTasks: number
    totalOpenTasks: number
    totalResolvedBugs: number
    totalReviewComments: number
    avgReviewTime: number
    topPerformers: Array<{
      commentsLeft: number
      bugsClosed: number
      userId: number
      name: string
      completedTasks: number
    }>
  }
}
