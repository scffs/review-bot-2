import { eq } from 'drizzle-orm'

import {
  type TaskRepository,
  type TaskWithRelations,
  type Tx,
  tasks
} from '@database'

export async function fetch(
  this: TaskRepository,
  data?: {
    isCompleted?: boolean
    offset?: number
    limit?: number
  },
  tx?: Tx
): Promise<TaskWithRelations[]> {
  const executor = tx ?? this.db

  const filter =
    data?.isCompleted !== undefined
      ? { where: eq(tasks.isCompleted, data.isCompleted) }
      : undefined

  const results = await executor.query.tasks.findMany({
    ...filter,
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
    },
    ...(typeof data?.offset === 'number' ? { offset: data.offset } : {}),
    ...(typeof data?.limit === 'number' ? { limit: data.offset } : {})
  })

  if (!results.length) {
    return []
  }

  return results.map((result) => ({
    ...result,
    tags: result.taskTags || [],
    attachments: result.attachments || [],
    messages: result.taskMessages || [],
    assignees: result.assignees || [],
    mrReview: result.mrReviews?.[0] || null,
    test: result.tests?.[0] || null
  }))
}
