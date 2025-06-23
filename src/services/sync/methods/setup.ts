import { withTimeOut } from '@utils'

import { SYNC_CHECK_INTERVAL } from '../config'
import type { Sync } from '../sync'

let started = false

export function setup(this: Sync): void {
  if (started) {
    throw new Error('Менеджер синхронизации уже запущен')
  }

  started = true

  withTimeOut(async () => {
    await this.tagsWithWeeek()
  }, SYNC_CHECK_INTERVAL)
}
