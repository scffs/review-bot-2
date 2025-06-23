import { and, count, desc, eq } from 'drizzle-orm'

import {
  type TestDetailRepository,
  type Tx,
  assignees,
  tasks,
  testDetails,
  tests
} from '@database'

export async function getTopBugsTask(
  this: TestDetailRepository,
  userId: number,
  tx?: Tx
) {
  const executor = tx ?? this.db

  const [topBugTaskRow] = await executor
    .select({
      taskId: tests.taskId,
      taskUrl: tasks.taskUrl,
      bugsCount: count(testDetails.id)
    })
    .from(testDetails)
    .innerJoin(tests, eq(testDetails.testId, tests.id))
    .innerJoin(assignees, eq(assignees.taskId, tests.taskId))
    .innerJoin(tasks, eq(tasks.id, tests.taskId))
    .where(and(eq(assignees.userId, userId), eq(testDetails.isCompleted, true)))
    .groupBy(tests.taskId, tasks.taskUrl)
    .orderBy(desc(count(testDetails.id)))
    .limit(1)

  return topBugTaskRow
}
