import type { MessageContext } from '@mtcute/dispatcher'

import type { Field, RegistrationForm } from '../../types'
import { schemas } from '../../validation.ts'

export type Success<K extends Field> = {
  success: true
  data: RegistrationForm[K]
}
type Failure = { success: false }

export async function validateFieldInput<K extends Field>(
  ctx: MessageContext,
  field: K
): Promise<Success<K> | Failure> {
  const txt = ctx.text?.trim() ?? ''
  const schema = schemas[field]
  const parsed = schema.safeParse(txt)

  if (!parsed.success) {
    await ctx.replyText(parsed.error.errors[0].message)
    return { success: false }
  }

  return { success: true, data: parsed.data }
}
