import { and, asc, desc, eq, exists } from 'drizzle-orm'

import {
  type TaskRepository,
  type TaskWithRelations,
  type Tx,
  type UserId,
  assignees,
  tasks
} from '@database'

export async function fetchByUserId(
  this: TaskRepository,
  userId: UserId,
  offset?: number,
  limit?: number,
  tx?: Tx
): Promise<TaskWithRelations[]> {
  // Используем переданную транзакцию (если есть), иначе — обычное подключение к БД
  const executor = tx ?? this.db

  // Выполняем запрос к таблице tasks
  const results = await executor.query.tasks.findMany({
    // 1. Фильтрация: выбираем задачи, где пользователь назначен исполнителем
    where: exists(
      executor
        .select({})
        .from(assignees)
        .where(
          and(eq(assignees.taskId, tasks.id), eq(assignees.userId, userId))
        )
    ),

    // 2. Сортировка задач
    orderBy: [
      asc(tasks.isCompleted), // сначала невыполненные (false), затем выполненные (true)
      desc(tasks.completedAt), // среди выполненных — самые свежие выше
      desc(tasks.weeekId) // внутри группы — новые недели выше старых
    ],

    // 3. Пагинация: задаём offset и limit, если они переданы
    ...(typeof offset === 'number' ? { offset } : {}),
    ...(typeof limit === 'number' ? { limit } : {}),

    // 4. Загрузка связанных сущностей (аналог LEFT JOIN)
    with: {
      taskTags: true, // теги задачи
      attachments: true, // вложения
      mrReviews: true, // merge request ревью
      tests: { with: { testDetails: true } }, // тесты + их детали
      assignees: true, // исполнители
      taskMessages: true // сообщения в задаче
    }
  })

  // 5. Постобработка: нормализуем связанные сущности,
  // чтобы избежать undefined/null в дальнейшем использовании
  return results.map((r) => ({
    ...r,
    tags: r.taskTags || [],
    attachments: r.attachments || [],
    messages: r.taskMessages || [],
    assignees: r.assignees || [],
    mrReview: r.mrReviews?.[0] || null,
    test: r.tests?.[0] || null
  }))
}
