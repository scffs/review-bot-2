import { db } from '@database'
import { di } from '@di'
import { logger } from '@utils'

import type { Task } from 'clients/weeek'

import { saveTask } from 'services/saveTask'
import { taskContext } from 'services/taskContext'

import type { CompletedTasks } from '../completedTasks'

/**
 * Сохраняет завершённую задачу в базу данных с обработкой MR, тестов и тегов.
 *
 * Шаги:
 * 1. Проверяет наличие задачи в БД
 * 2. Инициализирует контекст задачи
 * 3. Сохраняет задачу и связанные сущности:
 *    - Исполнители
 *    - Merge Request (и статистику MR)
 *    - Тесты
 *    - Теги
 * 4. Удаляет временные медиа-файлы
 *
 * Все операции выполняются в рамках одной транзакции.
 *
 * @param {Task} task - Завершённая задача из Weeek API
 * @returns {Promise<void>}
 */
export async function save(this: CompletedTasks, task: Task) {
  await db.transaction(async (transaction) => {
    if (!task.id) return

    const taskFromDb = await di.task.getByWeeekId(task.id, transaction)
    if (taskFromDb?.id) return // Задача уже существует

    try {
      // Инициализация контекста
      const context = await taskContext.initialize(task, logger, transaction)
      if (!context) return

      // Сохраняем саму задачу
      const taskFromDb = await saveTask.taskHandler(
        context.taskId,
        {
          messageCaption: context.messageCaption,
          fields: context.fields,
          createdAt: Date.now(),
          isCompleted: true
        },
        context.taskFromDb,
        transaction
      )

      // Сохраняем исполнителей
      await saveTask.assigneeHandler(
        taskFromDb.id,
        context.fields.assignees,
        transaction
      )

      // Если есть MR — сохраняем и его
      if (context.fields.mr && context.fields.mrId) {
        await saveTask.mrReviewHandler(
          taskFromDb.id,
          context.fields.mrId,
          context.fields.mr,
          transaction
        )

        // Получаем MR Review для сбора статистики
        const mrReviewFromDb = await di.mrReview.getByTaskId(
          taskFromDb.id,
          transaction
        )

        if (mrReviewFromDb?.id) {
          const stats = await di.gitlab.getMrReviewStats(context.fields.mrId)

          if (stats.length) {
            for (const s of stats) {
              const user = await di.user.getByGitlabId(s.userId, transaction)
              if (!user) {
                logger.debug({ gitlabId: s.userId }, 'Пользователь не найден')
                continue
              }

              try {
                const st = await di.reviewStat.create(
                  {
                    mrReviewId: mrReviewFromDb.id,
                    userId: s.userId,
                    commentsCount: s.commentsCount
                  },
                  transaction
                )

                if (st) {
                  console.log(st, 'MR статистика создана')
                } else {
                  console.log(
                    `MR статистика уже существует (mrReviewId=${mrReviewFromDb.id}, userId=${s.userId})`
                  )
                }
              } catch (err) {
                logger.error(err, 'Ошибка при создании MR статистики')
              }
            }
          }
        }
      }

      // Обработка тестов
      if (context.fields.tests) {
        await saveTask.testHandler(
          taskFromDb.id,
          context.fields.tests,
          transaction
        )
      }

      // Обработка тегов
      if (context.fields.tags?.filter(Boolean).length) {
        await saveTask.tagHandler(
          taskFromDb.id,
          context.fields.tags,
          transaction
        )
      }

      // Удаление временных медиафайлов
      context.messageMediaPaths.map((path) => Bun.file(path).delete())
      logger.info('Задача успешно сохранена', { id: context.taskId })
    } catch (err) {
      logger.error(err, 'Ошибка при создании ранее завершённых задач')
    }
  })
}
