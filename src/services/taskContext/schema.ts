import { z } from 'zod'

import { mrReviewSchema } from 'database/models/MrReview/schema'
import { tagTypeEnum } from 'database/models/Tag'
import { testsSchema } from 'database/models/Test/schema'
import { userSchema } from 'database/models/User/schema'

export const taskFieldsSchema = z
  .object({
    mrUrl: z.string().url().optional().nullable(), // URL для MR (необязательное поле)
    images: z.array(z.string().url()), // Ссылки на изображения
    videos: z.array(z.string().url()), // Ссылки на видео
    assignees: z.array(userSchema),
    tags: z.array(tagTypeEnum.nullable()).nullable(), // Теги для MR
    mr: mrReviewSchema.nullable(), // Информация о ревью (может быть null)
    tests: testsSchema, // Схема для тестов
    isEmergency: z.boolean() // Флаг экстренности MR
  })
  .partial({
    mrUrl: true, // необязательное поле для URL MR
    tags: true, // необязательное поле для тегов
    mr: true // необязательное поле для MR
  })
