import type { DbType } from '@database'

import {
  create,
  fetch,
  fetchActiveTasks,
  fetchBugsForUser,
  fetchByUserId,
  fetchReviewsForUser,
  getByWeeekId,
  update
} from './methods'

export class TaskRepository {
  constructor(protected db: DbType) {
    this.db = db
  }

  getByWeeekId = getByWeeekId

  create = create

  updateByWeeekId = update

  fetch = fetch
  fetchByUserId = fetchByUserId

  fetchActiveTasks = fetchActiveTasks
  fetchBugsForUser = fetchBugsForUser
  fetchReviewsForUser = fetchReviewsForUser
}
