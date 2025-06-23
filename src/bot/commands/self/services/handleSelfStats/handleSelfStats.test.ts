// Импортируем инструменты для тестирования из bun:test и зависимости из проекта
// @ts-nocheck отключает проверку типов TS в этом файле (например, для быстрого прототипирования)
import { beforeEach, describe, expect, it, jest } from 'bun:test'
import { di } from '@di'
import { handleSelfStats } from '../index.ts'

// Группа тестов для функции handleSelfStats
describe('handleSelfStats', () => {
  const userId = 123 // Используем фиктивный ID пользователя для тестов

  // Перед каждым тестом восстанавливаем все шпионские объекты (spy), чтобы тесты были независимы
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  // Первый тест: проверяем поведение при наличии более чем limit задач, чтобы проверить пагинацию и флаг hasNextPage
  it('возвращает корректные данные при наличии более чем limit задач (hasNextPage=true)', async () => {
    // Создаем массив из 10 задач: задачи с чётным индексом — выполненные (isCompleted=true),
    // с нечётным — в тестировании (isCompleted=false)
    const allTasks = Array.from({ length: 10 }, (_, i) => ({
      isCompleted: i % 2 === 0
    }))

    // Создаем шпион на метод fetchByUserId, чтобы контролировать его поведение
    // Если вызов идет без параметров offset и limit — возвращаем все задачи (10)
    // Если вызывается с offset=0 и limit=6 — возвращаем первые 6 задач из allTasks
    const fetchSpy = jest
      .spyOn(di.task, 'fetchByUserId')
      .mockImplementation((id, offset, limit) => {
        if (offset == null && limit == null) {
          return Promise.resolve(allTasks)
        }
        // Проверяем, что при втором вызове offset=0 и limit=6
        expect(offset).toBe(0)
        expect(limit).toBe(6)
        return Promise.resolve(allTasks.slice(0, 6))
      })

    // Вызываем тестируемую функцию
    const result = await handleSelfStats(userId)

    // Проверяем, что метод fetchByUserId вызвался ровно два раза (один для подсчёта, другой для страницы)
    expect(fetchSpy).toHaveBeenCalledTimes(2)

    // Проверяем, что общее количество задач соответствует 10
    expect(result.totalCount).toBe(10)
    // Проверяем, что количество выполненных задач — 5 (четные индексы)
    expect(result.completed).toHaveLength(5)
    // Проверяем, что задач в статусе "в тестировании" тоже 5 (нечетные индексы)
    expect(result.inTesting).toHaveLength(5)

    // Проверяем, что есть следующая страница (hasNextPage=true), так как всего задач больше, чем размер страницы
    expect(result.hasNextPage).toBe(true)
    // Проверяем, что tasksPage содержит первые 5 задач из первых 6 (исключая последний элемент, видимо по логике handleSelfStats)
    expect(result.tasksPage).toHaveLength(5)
    expect(result.tasksPage).toEqual(allTasks.slice(0, 5))
  })

  // Второй тест: проверяем поведение при малом количестве задач (меньше лимита), чтобы hasNextPage был false
  it('возвращает корректные данные при небольшом числе задач (hasNextPage=false)', async () => {
    // Создаем массив из 3 задач, все они не выполнены (isCompleted=false)
    const allTasks = [
      { isCompleted: false },
      { isCompleted: false },
      { isCompleted: false }
    ]
    // Мокаем fetchByUserId, чтобы всегда возвращать этот список из 3 задач
    jest.spyOn(di.task, 'fetchByUserId').mockResolvedValue(allTasks)

    // Вызываем функцию с page=1 и limit=5
    const result = await handleSelfStats(userId, /*page=*/ 1, /*limit=*/ 5)

    // Проверяем, что totalCount равен 3 (всего 3 задачи)
    expect(result.totalCount).toBe(3)
    // Проверяем, что выполненных задач нет
    expect(result.completed).toHaveLength(0)
    // Проверяем, что все 3 задачи в статусе "в тестировании"
    expect(result.inTesting).toHaveLength(3)

    // Проверяем, что флаг hasNextPage = false, так как задач меньше лимита
    expect(result.hasNextPage).toBe(false)
    // Проверяем, что tasksPage содержит все 3 задачи
    expect(result.tasksPage).toHaveLength(3)
    expect(result.tasksPage).toEqual(allTasks)
  })
})
