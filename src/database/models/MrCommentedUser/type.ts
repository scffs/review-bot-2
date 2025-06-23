import type { InferSelectModel } from 'drizzle-orm'

import type { mrCommentedUsers } from './schema.ts'

export type MrCommentedUser = InferSelectModel<typeof mrCommentedUsers>
export type MrCommentedUserId = MrCommentedUser['id']
