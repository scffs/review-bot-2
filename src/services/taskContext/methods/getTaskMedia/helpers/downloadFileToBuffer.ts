import { GOOGLE_COOKIE } from '@config'
import type { Logger } from '@utils'

// Скачиваем файл по частям и логируем прогресс
export const downloadFileToBuffer = async (
  url: string,
  log?: Logger
): Promise<Uint8Array> => {
  const response = await Bun.fetch(url, {
    method: 'GET',
    headers: {
      accept: '*/*',
      cookie: GOOGLE_COOKIE
    }
  })

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`)
  }

  const contentLength = response.headers.get('content-length')
  const total = contentLength ? Number.parseInt(contentLength, 10) : Number.NaN

  const reader = response.body?.getReader()

  if (!reader) {
    throw new Error('Invalid Reader')
  }

  let received = 0
  const chunks: Uint8Array[] = []
  let lastLogTime = Date.now()

  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }

    chunks.push(value)
    received += value.length

    const now = Date.now()

    if (now - lastLogTime >= 5000) {
      if (!Number.isNaN(total)) {
        const percent = ((received / total) * 100).toFixed(2)
        log?.debug({ percent: `${percent}%` }, 'Прогресс загрузки')
      } else {
        log?.debug({ received }, 'Загружено байт')
      }

      lastLogTime = now
    }
  }

  // Финальный лог
  log?.info(
    { size: `${(received / 1024 / 1024).toFixed(2)}mb` },
    'Загрузка завершена'
  )

  // Собираем единый буфер
  const buffer = new Uint8Array(received)

  let offset = 0
  for (const chunk of chunks) {
    buffer.set(chunk, offset)
    offset += chunk.length
  }

  return buffer
}
