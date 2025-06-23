import path from 'node:path'

import { MEDIA_DIR } from '@config'
import type { TagType } from '@database'
import type { Logger } from '@utils'

import type { ReviewFields } from 'clients/weeek'

import { convertAndCompressArrayBuffer, downloadFileToBuffer } from './helpers'

export const getTaskMedia = async (
  fields: ReviewFields,
  taskId: number,
  log?: Logger
): Promise<string[]> => {
  const mediaPaths: string[] = []

  const images = fields.images
  const videos = fields.videos

  // Обработка видео
  for (const [index, video] of videos.entries()) {
    if (mediaPaths.length >= 10) {
      break
    }

    const buffer = await downloadFileToBuffer(video, log)
    const converted = await convertAndCompressArrayBuffer(buffer, log)

    const fileName = `task_${taskId}_video_${index}.mp4`
    const filePath = path.join(MEDIA_DIR, fileName)

    await Bun.write(filePath, converted)
    mediaPaths.push(filePath)
  }

  // Обработка изображений
  for (const [index, image] of images.entries()) {
    if (mediaPaths.length >= 10) {
      break
    }

    const buffer = await downloadFileToBuffer(image, log)
    const fileName = `task_${taskId}_image_${index}.jpg`
    const filePath = path.join(MEDIA_DIR, fileName)

    await Bun.write(filePath, buffer)
    mediaPaths.push(filePath)
  }

  // Заглушка, если нет медиа
  if (mediaPaths.length === 0) {
    const hasTag = (tagToCheck: TagType) =>
      fields.tags?.some((tag) => tag === tagToCheck)

    const placeholderPath = hasTag('Emergency')
      ? path.join(__dirname, './assets/mrgancyplaceholder.jpg')
      : path.join(__dirname, './assets/mrplaceholder.jpg')

    const fileName = `task_${taskId}_placeholder.jpg`
    const filePath = path.join(MEDIA_DIR, fileName)

    await Bun.write(filePath, Bun.file(placeholderPath))
    mediaPaths.push(filePath)
  }

  return mediaPaths
}
