import { DB_URL } from '@config'
import { logger } from '@utils'
import { type NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

import * as schema from './models'

export type Tx = NodePgDatabase<typeof schema>
export type DbType = Tx & { $client: Pool }

export class DatabaseService {
  private readonly pool: Pool
  public db: DbType

  constructor(connectionString: string) {
    this.pool = new Pool({ connectionString })
    this.db = drizzle(this.pool, { schema })
  }

  public async connect() {
    try {
      await this.pool.connect()
      logger.debug('Успешное подключение к БД')
    } catch (e) {
      logger.error(e, 'Неудачное подключение к БД')
      throw e
    }
  }

  public async disconnect() {
    await this.pool.end()
    logger.debug('Успешное отключение от БД')
  }

  // Функция для работы с транзакциями через drizzle-orm
  public async transaction<T>(callback: (tx: Tx) => Promise<T>): Promise<T> {
    return this.db.transaction(async (tx) => {
      try {
        return callback(tx)
      } catch (error) {
        tx.rollback()
        logger.error(error, 'Ошибка в транзакции, откат')
        throw error
      }
    })
  }
}

export const db = new DatabaseService(DB_URL)
