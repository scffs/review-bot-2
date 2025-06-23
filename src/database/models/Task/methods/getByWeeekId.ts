import { eq } from 'drizzle-orm'

import {
  type TaskRepository,
  type TaskWithRelations,
  type Tx,
  tasks
} from '@database'

export async function getByWeeekId(
  this: TaskRepository,
  weeekTaskId: number,
  tx?: Tx
): Promise<TaskWithRelations | undefined> {
  const executor = tx ?? this.db

  const result = await executor.query.tasks.findFirst({
    where: eq(tasks.weeekId, weeekTaskId),
    with: {
      taskTags: true,
      attachments: true,
      mrReviews: true,
      tests: {
        with: {
          testDetails: true
        }
      },
      assignees: true,
      taskMessages: true
    }
  })

  if (!result) {
    return
  }

  return {
    ...result,
    tags: result.taskTags || [],
    attachments: result.attachments || [],
    messages: result.taskMessages || [],
    assignees: result.assignees || [],
    mrReview: result.mrReviews?.[0] || null,
    test: result.tests?.[0] || null
  }
}
