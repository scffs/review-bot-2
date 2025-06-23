import type { Tx } from '@database'

import { di } from '@di'

import type { TaskTests } from 'clients/weeek'

/**
 * Сохраняет данные тестирования в базу данных
 *
 * @param {number} taskId - Идентификатор задачи
 * @param tests
 * @param tx
 * @returns {Promise<void>}
 */
export async function testHandler(
  taskId: number,
  tests: TaskTests,
  tx?: Tx
): Promise<void> {
  const summary = {
    taskId,
    total: tests.total ?? 0,
    isNeeded: tests.isNeeded ?? false,
    isCompleted: tests.isCompleted ?? false,
    isStarted: tests.isStarted ?? false,
    taskUrl: tests.taskUrl ?? null
  }

  let testId: number
  const existingTest = await di.test.getByTaskId(taskId, tx)

  if (existingTest) {
    await di.test.update(existingTest.id, summary, tx)
    testId = existingTest.id

    // Удаляем старые нерешенные тесты перед добавлением новых
    await di.testDetail.deleteByTestId(testId, tx)
  } else {
    const newTest = await di.test.create(summary, tx)
    testId = newTest.id
  }

  // Сохраняем каждый тест (completed + unresolved)
  for (const t of tests.all ?? []) {
    await di.testDetail.create(
      {
        testId,
        name: t.name,
        link: t.link,
        isCompleted: t.isCompleted
      },
      tx
    )
  }
}
