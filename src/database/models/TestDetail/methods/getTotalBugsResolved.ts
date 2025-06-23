import { and, count, eq } from 'drizzle-orm'

import {
  type TestDetailRepository,
  type Tx,
  assignees,
  testDetails,
  tests
} from '@database'

export async function getTotalBugsResolved(
  this: TestDetailRepository,
  userId: number,
  tx?: Tx
): Promise<number> {
  const executor = tx ?? this.db

  const [row] = await executor
    .select({
      totalBugs: count(testDetails.id)
    })
    .from(testDetails)
    .innerJoin(tests, eq(testDetails.testId, tests.id))
    .innerJoin(assignees, eq(assignees.taskId, tests.taskId))
    .where(and(eq(assignees.userId, userId), eq(testDetails.isCompleted, true)))

  return Number(row?.totalBugs ?? 0)
}
