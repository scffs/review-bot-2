import type { WeeekTag } from '../../types.ts'

export interface GetTagsResponse {
  success?: boolean
  tags?: WeeekTag[]
}
