import path from 'node:path'
import ffmpeg from 'fluent-ffmpeg'

import type { Logger } from '@utils'

export const convertAndCompressArrayBuffer = async (
  inputBuffer: Uint8Array,
  log?: Logger
): Promise<Uint8Array> => {
  const inputPath = path.join(__dirname, 'tmp_input')
  const outputPath = path.join(__dirname, 'tmp_output.mp4')

  // Запись временного файла
  await Bun.write(inputPath, inputBuffer)

  return new Promise((resolve, reject) => {
    let lastLogTime = Date.now()

    ffmpeg(inputPath)
      .output(outputPath)
      .videoCodec('libx264')
      .audioCodec('aac')
      .size('1080x?')
      .outputOptions([
        '-crf',
        '23',
        '-preset',
        'slow',
        '-b:v',
        '420k',
        '-b:a',
        '128k'
      ])
      .format('mp4')
      .on('progress', (progress) => {
        const now = Date.now()

        if (now - lastLogTime >= 5000) {
          log?.debug(
            {
              percent: progress.percent?.toFixed(2)
            },
            'Прогресс конвертации'
          )
          lastLogTime = now
        }
      })
      .on('end', async () => {
        try {
          const data = await Bun.file(outputPath).arrayBuffer()
          const outputBuffer = new Uint8Array(data)

          // Удаляем временные файлы
          try {
            await Bun.file(inputPath).delete()
            await Bun.file(outputPath).delete()
          } catch (e) {
            log?.error(
              { e },
              'ошибка удаления временных файлов. Работа продолджается'
            )
          }
          log?.info('Конвертация завершена')
          resolve(outputBuffer)
        } catch (err) {
          reject(err)
        }
      })
      .on('error', (err) => {
        log?.error(err, 'Ошибка ffmpeg')
        reject(err)
      })
      .run()
  })
}
