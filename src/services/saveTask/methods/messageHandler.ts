import path from 'node:path'

import { di } from '@di'

import type { Tx } from '@database'

/**
 * Сохраняет сообщения задачи в базу данных.
 *
 * Функционал:
 * - Проверяет существующие сообщения
 * - При изменении количества или хотя бы одного messageId — удаляет и создает заново
 * - Определяет тип медиа (фото/видео) по расширению файла
 *
 * @param {number} taskId - Идентификатор задачи
 * @param {number[]} messageIds - ID сообщений, отправленных в Telegram
 * @param {string[]} messageMediaPaths - Пути до медиафайлов (для определения типа)
 * @param {Tx} [tx] - Необязательная транзакция базы данных
 * @returns {Promise<void>}
 */
export async function messageHandler(
  taskId: number,
  messageIds: number[],
  messageMediaPaths: string[],
  tx?: Tx
): Promise<void> {
  // Получаем уже сохранённые сообщения задачи из базы
  const existingMessages = await di.taskMessage.getByTaskId(taskId, tx)

  // Определяем, нужно ли пересоздать сообщения:
  // если изменилась длина массива или хотя бы один ID не совпадает
  const shouldRecreate =
    existingMessages.length !== messageIds.length ||
    existingMessages.some((msg, idx) => msg.messageId !== messageIds[idx])

  // Если данные отличаются — пересоздаем все сообщения
  if (shouldRecreate) {
    // Удаляем старые записи сообщений из базы
    await di.taskMessage.deleteByTaskId(taskId, tx)

    // Создаем новые записи сообщений, определяя тип медиа
    for (let i = 0; i < messageIds.length; i++) {
      const messageId = messageIds[i]
      const extension = path.extname(messageMediaPaths[i]).toLowerCase()

      // Сохраняем новое сообщение с типом media (video или photo)
      await di.taskMessage.create(
        {
          taskId,
          messageId,
          type: extension === '.mp4' ? 'video' : 'photo'
        },
        tx
      )
    }
  }
}
