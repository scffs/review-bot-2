import type { DbType } from '@database'
import { create, findByUserId } from './methods'

export class UserVacancyRepository {
  constructor(protected db: DbType) {
    this.db = db
  }

  findByUserId = findByUserId
  create = create
}
