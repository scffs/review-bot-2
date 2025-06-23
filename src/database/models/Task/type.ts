import type { InferSelectModel } from 'drizzle-orm'

import type { Assignee } from '../Assignee'
import type { Attachment } from '../Attachment'
import type { MrReview } from '../MrReview'
import type { TaskMessage } from '../TaskMessage'
import type { TaskTag } from '../TaskTag'
import type { TestWithRelation } from '../Test'

import type { tasks } from './schema'

export type Task = InferSelectModel<typeof tasks>

export type TaskWithRelations = Task & {
  tags: TaskTag[]
  attachments: Attachment[]
  mrReview: MrReview | null
  test: TestWithRelation | null
  // tests: TestWithRelation[] | null
  assignees: Assignee[]
  messages: TaskMessage[]
}

export type ReviewTask = {
  id: number
  title: string
  taskUrl: string | null
  mrUrl: string
  needsReview: boolean
  commentsToRespond: { id: number; link: string }[]
}

export type BugTask = {
  id: number
  title: string
  taskUrl: string | null
  assignees: { userId: number }[]
  unresolvedTestDetails: { name: string; link: string }[]
}
