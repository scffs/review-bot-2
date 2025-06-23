import type { DbType } from '../../database'

import {
  count,
  create,
  deleteUser,
  findAll,
  getByGitlabId,
  getById,
  getByTelegramId,
  getByTelegramUserName,
  getByWeeekId,
  getGitlabIdById,
  update
} from './methods'

/**
 * @description Репозиторий для работы с моделью пользователя
 */
export class UserRepository {
  constructor(protected db: DbType) {
    this.db = db
  }

  getById = getById

  getByTelegramId = getByTelegramId
  getByTelegramUserName = getByTelegramUserName

  getByGitlabId = getByGitlabId

  getByWeeekId = getByWeeekId

  create = create

  update = update

  delete = deleteUser

  findAll = findAll

  count = count
  getGitlabIdById = getGitlabIdById
}
