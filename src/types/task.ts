import type { ReviewFields } from '../clients/weeek'

export type TaskFieldsForSummary = Pick<
  ReviewFields,
  | 'title'
  | 'taskUrl'
  | 'mrUrl'
  | 'mrId'
  | 'isEmergency'
  | 'assignees'
  | 'mr'
  | 'tests'
> & { isCompleted?: boolean }
