import { RateLimitError } from '@mtcute/dispatcher'

import type { DispatcherWithStorage } from '@bot'
import { logger } from '@utils'

// Тип функции onError для получения типов получаемых параметров
type OnErrorHandler = NonNullable<
  Parameters<DispatcherWithStorage['onError']>[0]
>

export const errorMiddleware: OnErrorHandler = async (
  error,
  update,
  _state
): Promise<boolean> => {
  if (!(update.name === 'new_message' || update.name === 'callback_query')) {
    logger.error({ error }, `Ошибка в неизвестном событии: ${update.name}`)
    return false
  }

  // console.log(' update.data',  update.data.raw)
  const username = update.data.chat.username
  const log = logger.child({
    id: update.data.chat.id,
    username: username ? `@${username}` : 'Скрыт'
  })

  if (update.name === 'callback_query') {
    log.debug({ command: update.data.dataStr })
  }

  if (update.data.raw._ === 'message') {
    if (update.data.raw.entities?.length) {
      log.error(
        { message: update.data.raw.message },
        'Ошибка при выполнении команды'
      )
    }
  }

  if (error instanceof RateLimitError) {
    log.error({ reset: error.reset }, 'Достигнут rate-limit')
    return true
  }

  log.error(error, '❌ Необработанная ошибка в хендлере')

  return true
}
