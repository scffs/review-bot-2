import type { InferSelectModel } from 'drizzle-orm'

import type { mrComments } from './schema'

export type MrComment = InferSelectModel<typeof mrComments>
export type MrCommentId = MrComment['id']
