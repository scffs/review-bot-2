import { type InferInsertModel, eq } from 'drizzle-orm'

import type { TagRepository } from './repository'
import { tags } from './schema'
import type { Tag, TagValueType } from './type'

export async function getByWeeekId(
  this: TagRepository,
  weeekId: number
): Promise<Tag | undefined> {
  return this.db.query.tags.findFirst({
    where: eq(tags.weeekId, weeekId)
  })
}

export async function getTagByType(
  this: TagRepository,
  type: TagValueType
): Promise<Tag | undefined> {
  return this.db.query.tags.findFirst({ where: eq(tags.type, type) })
}

export async function create(
  this: TagRepository,
  data: InferInsertModel<typeof tags>
): Promise<Tag | undefined> {
  const result = await this.db.insert(tags).values(data).returning()

  return result[0]
}

export async function updateTag(
  this: TagRepository,
  id: number,
  data: Partial<Omit<Tag, 'id'>>
): Promise<Tag> {
  const [updatedTag] = await this.db
    .update(tags)
    .set(data)
    .where(eq(tags.id, id))
    .returning()
  return updatedTag
}

export async function deleteTag(
  this: TagRepository,
  id: number
): Promise<void> {
  await this.db.delete(tags).where(eq(tags.id, id))
}
