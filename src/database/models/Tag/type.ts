import type { InferSelectModel } from 'drizzle-orm'
import { z } from 'zod'

import type { tagTypePgEnum, tags } from './schema.ts'

export type Tag = InferSelectModel<typeof tags>
export type TagValueType = (typeof tagTypePgEnum.enumValues)[number]

export const tagTypeEnum = z.enum([
  'Fullstack',
  'DevOps',
  'Backend',
  'Frontend',
  'Pixi',
  'Docs',
  'Emergency',
  'WithoutTesting',
  'WithoutMediaTesting',
  'TLReview',
  'Bug'
])

export type TagType = z.infer<typeof tagTypeEnum>
