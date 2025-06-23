import { describe, expect, it } from 'bun:test'

import type { TaskFieldsForSummary } from '@types'

import { getFormattedTaskDetails } from './getFormattedTaskDetails.ts'

describe('getFormattedTaskDetails', () => {
  const base: Partial<TaskFieldsForSummary> = {
    title: 'Task Title',
    taskUrl: 'http://task.url'
  }

  function makeTask(overrides: any): TaskFieldsForSummary {
    return {
      ...base,
      isCompleted: false,
      tests: {
        isNeeded: false,
        isCompleted: false,
        all: [],
        unresolved: []
      },
      ...overrides
    }
  }

  it('должен показывать, что тестирование не требуется, когда isNeeded false', () => {
    const task = makeTask({
      tests: { isNeeded: false }
    })
    const text = getFormattedTaskDetails(task, 1)
    expect(text).toContain('🚫 Тестирование не требуется')
  })

  it('должен отображать статус ожидания начала тестирования, если нужно тестирование, есть taskUrl, но нет тестов и задача в работе', () => {
    const task = makeTask({
      isCompleted: false,
      tests: {
        isNeeded: true,
        taskUrl: 'http://test.report',
        all: [],
        unresolved: []
      }
    })
    const text = getFormattedTaskDetails(task, 2)
    expect(text).toContain('🧪 Ожидаем начала тестирования')
  })

  it('должен отображать успешное тестирование без багов, когда total=0, задача завершена и tests.isCompleted=true', () => {
    const task = makeTask({
      isCompleted: true,
      tests: {
        isNeeded: true,
        taskUrl: 'http://test.report',
        all: [],
        unresolved: [],
        isCompleted: true
      }
    })
    const text = getFormattedTaskDetails(task, 3)
    expect(text).toContain('Тестирование пройдено без багов')
  })

  it('должен указывать, что тестирование не проводилось, если total=0, задача завершена, но tests.isCompleted=false', () => {
    const task = makeTask({
      isCompleted: true,
      tests: {
        isNeeded: true,
        taskUrl: 'http://test.report',
        all: [],
        unresolved: [],
        isCompleted: false
      }
    })
    const text = getFormattedTaskDetails(task, 4)
    expect(text).toContain('Тестирование не проводилось')
  })

  it('должен показывать устранение всех багов, когда есть баги, но все они исправлены', () => {
    const task = makeTask({
      tests: {
        isNeeded: true,
        taskUrl: 'http://test.report',
        all: [1, 2],
        unresolved: []
      }
    })
    const text = getFormattedTaskDetails(task, 5)
    expect(text).toContain('🧪 Все баги устранены | [2/2](http://test.report)')
  })

  it('должен включать ссылку на отчет при наличии unresolved багов и переданного taskUrl', () => {
    const task = makeTask({
      tests: {
        isNeeded: true,
        taskUrl: 'http://test.link',
        all: [1, 2, 3, 4],
        unresolved: [1, 2]
      }
    })
    const text = getFormattedTaskDetails(task, 7)
    expect(text).toContain('🧪 Обнаружены баги')
    expect(text).toContain('Исправлено: 2/4')
    expect(text).toContain('Открыто: 2')
    expect(text).toContain(
      '🔗 [Просмотр отчёта о тестировании](http://test.link)'
    )
  })

  it('должен добавлять заголовок только для первого элемента', () => {
    const t1 = getFormattedTaskDetails(makeTask({}), 1)
    expect(t1).toMatch(/^🌟━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━🌟/)
    const t2 = getFormattedTaskDetails(makeTask({}), 2)
    expect(t2).not.toMatch(/^🌟━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━🌟/)
  })
})
