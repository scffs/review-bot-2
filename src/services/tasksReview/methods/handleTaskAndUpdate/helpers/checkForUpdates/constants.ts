export const MESSAGE_TTL_MS = 24 * 60 * 60 * 1000 // 24 часа

export const UpdateReason = {
  NONE: 'none',
  NEW_TASK: 'new_task',
  EXPIRED_MESSAGES: 'expired_messages',
  CAPTION_CHANGED: 'caption_changed',
  MEDIA_CHANGED: 'media_changed',
  FIELDS_CHANGED: 'fields_changed'
} as const

export type UpdateReason = (typeof UpdateReason)[keyof typeof UpdateReason]

export function isExpired(createdAt?: Date | null): boolean {
  return !!createdAt && Date.now() - createdAt.getTime() >= MESSAGE_TTL_MS
}
