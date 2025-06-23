import { and, eq, exists } from 'drizzle-orm'

import {
  type BugTask,
  type TaskRepository,
  type Tx,
  type UserId,
  assignees,
  tasks,
  testDetails,
  tests
} from '@database'

export async function fetchBugsForUser(
  this: TaskRepository,
  userId: UserId,
  tx?: Tx
): Promise<BugTask[]> {
  const executor = tx ?? this.db

  const results = await executor.query.tasks.findMany({
    where: and(
      // Только незавершенные задачи
      eq(tasks.isCompleted, false),
      // Пользователь — исполнитель
      exists(
        executor
          .select({})
          .from(assignees)
          .where(
            and(eq(assignees.taskId, tasks.id), eq(assignees.userId, userId))
          )
      ),
      // Есть незавершенные тестовые детали
      exists(
        executor
          .select({})
          .from(tests)
          .innerJoin(testDetails, eq(testDetails.testId, tests.id))
          .where(
            and(eq(tests.taskId, tasks.id), eq(testDetails.isCompleted, false))
          )
      )
    ),
    with: {
      assignees: true,
      tests: {
        with: {
          testDetails: true
        }
      }
    }
  })

  return results.map((task) => ({
    id: task.id,
    title: task.title,
    taskUrl: task.taskUrl,
    assignees: task.assignees.map((a) => ({ userId: a.userId })),
    unresolvedTestDetails: task.tests
      .flatMap((t) => t.testDetails.filter((td) => !td.isCompleted))
      .map((td) => ({ name: td.name, link: td.link }))
  }))
}
