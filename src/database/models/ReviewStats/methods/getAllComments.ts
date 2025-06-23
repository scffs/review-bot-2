import { eq, sum } from 'drizzle-orm'

import {
  type ReviewStatRepository,
  type Tx,
  UserRepository,
  reviewStats
} from '@database'

export async function getAllComments(
  this: ReviewStatRepository,
  userId: number,
  tx?: Tx
) {
  const db = tx ?? this.db

  const gitlabId = await new UserRepository(this.db).getGitlabIdById(userId, tx)
  if (gitlabId == null) {
    throw new Error(`User ${userId} not found`)
  }

  const [{ totalComments }] = await db
    .select({
      totalComments: sum(reviewStats.commentsCount).as('totalComments')
    })
    .from(reviewStats)
    .where(eq(reviewStats.userId, gitlabId))

  return Number(totalComments) ?? 0
}
