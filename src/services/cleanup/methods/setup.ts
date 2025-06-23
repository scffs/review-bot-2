import { logger, withTimeOut } from '@utils'

import type { Cleanup } from '../cleanup.ts'
import { CLEANUP_TELEGRAM_INTERVAL } from '../config.ts'

/**
 * Метод для запуска очистки
 */
export async function setup(this: Cleanup): Promise<void> {
  try {
    await this.orphanedAttachments()
    await this.unreferencedOnDisk()

    logger.info('Очистка завершена успешно')

    withTimeOut(async () => {
      await this.completedTasks()
    }, CLEANUP_TELEGRAM_INTERVAL)
  } catch (err) {
    logger.error(err, 'Ошибка в процессе очистки')
  }
}
