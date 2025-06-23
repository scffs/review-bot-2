import type { Task } from '../../../../../clients/weeek'

import { filterByExtensions } from './filterExtensions.ts'

export const filterAttachments = (
  attachment: Task['attachments'],
  extension: string[]
) => {
  if (!attachment || !attachment?.length) return
  return attachment
    .filter(
      (attachment) =>
        filterByExtensions([attachment.name], extension).length > 0
    )
    .map((attachment) => attachment.url)
}
