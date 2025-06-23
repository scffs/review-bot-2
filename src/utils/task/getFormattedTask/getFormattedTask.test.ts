import { afterEach, beforeEach, describe, expect, it, jest } from 'bun:test'
import { di } from '@di'

import type { TaskWithRelations } from 'database/models/Task'

import { FrontendVacancy } from '@database'
import { getFormattedTask } from './getFormattedTask'

describe('getFormattedTask', () => {
  let userMock: jest.Mock
  let testDetailMock: jest.Mock
  let mrReviewerMock: jest.Mock
  let mrCommentMock: jest.Mock
  let mrCommentedUserMock: jest.Mock

  beforeEach(() => {
    userMock = jest.fn()
    testDetailMock = jest.fn()
    mrReviewerMock = jest.fn()
    mrCommentMock = jest.fn()
    mrCommentedUserMock = jest.fn()

    // Mocking di module
    di.user.getById = userMock
    di.testDetail.findByTestId = testDetailMock
    di.mrReviewer.findUnresolvedByMrReviewId = mrReviewerMock
    di.mrReviewer.findByMrReviewId = mrReviewerMock
    di.mrComment.findByMrReviewId = mrCommentMock
    di.mrCommentedUser.findByMrReviewId = mrCommentedUserMock

    mrReviewerMock.mockResolvedValue([])
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('должен возвращать корректный результат для задачи без MR и тестов', async () => {
    const task = {
      assignees: [],
      test: null,
      mrReview: null,
      title: 'Simple Task',
      taskUrl: 'simple-url',
      mrUrl: null,
      mrId: null,
      isEmergency: false,
      isCompleted: true
    } as unknown as TaskWithRelations

    const result = await getFormattedTask(task)

    expect(result).toEqual({
      title: 'Simple Task',
      taskUrl: 'simple-url',
      mrUrl: null,
      mrId: null,
      isEmergency: false,
      assignees: [],
      mr: null,
      tests: {
        total: 0,
        unresolved: [],
        isNeeded: false,
        all: [],
        isCompleted: false,
        isStarted: false,
        taskUrl: ''
      },
      isCompleted: true
    })
  })

  it('должен корректно обработать MR без комментариев (actionsNeeded пустой)', async () => {
    const task = {
      assignees: [{ userId: 1 }],
      test: null,
      mrReview: {
        id: 'mr1',
        branchBehindBy: 1,
        hasConflicts: false,
        totalComments: 0,
        unresolvedComments: 0,
        totalReviewers: 1,
        changedFilesCount: 2,
        additions: 5,
        deletions: 1,
        durationSeconds: 120
      },
      title: 'Task without comments',
      taskUrl: 'task-url',
      mrUrl: 'mr-url',
      mrId: 'mr1',
      isEmergency: false,
      isCompleted: false
    } as unknown as TaskWithRelations

    userMock.mockResolvedValue({
      gitlabId: 1234,
      weeekId: 'weeek1',
      telegramUsername: 'user1',
      vacancy: ['Frontend'],
      name: 'User One'
    })

    mrReviewerMock.mockResolvedValueOnce([{ userId: 1 }]) // reviewers
    mrReviewerMock.mockResolvedValueOnce([]) // unresolved reviewers
    mrCommentMock.mockResolvedValueOnce([]) // comments пустые
    mrCommentedUserMock.mockResolvedValueOnce([]) // комментировавших нет

    const result = await getFormattedTask(task)

    expect(result.mr).toBeDefined()
    expect(result.mr?.comments.total).toBe(0)
    expect(result.mr?.comments.unresolved).toBe(0)
    expect(result.mr?.comments.actionsNeeded.length).toBe(0)
    expect(result.mr?.comments.peopleCommented.length).toBe(0)
    expect(result.mr?.branchBehindBy).toBe(1)
    expect(result.mr?.changedFilesCount).toBe(2)
    expect(result.mr?.additions).toBe(5)
    expect(result.mr?.deletions).toBe(1)
    expect(result.mr?.durationSeconds).toBe(120)
  })

  it('должен правильно форматировать задачу с assignees и деталями тестов', async () => {
    const task = {
      id: 1,
      weeekId: 1,
      assignees: [{ userId: 1 }],
      test: {
        id: 'test1',
        isNeeded: true,
        isStarted: true,
        isCompleted: false,
        taskUrl: 'test-url'
      },
      mrReview: null,
      title: 'Task 1',
      taskUrl: 'task-url',
      mrUrl: 'mr-url',
      mrId: 'mr1',
      isEmergency: false,
      isCompleted: false,
      messageCaption: 'A task for testing',
      createdAt: new Date(),
      completedAt: null
    } as unknown as TaskWithRelations

    userMock.mockResolvedValueOnce({
      gitlabId: 1234,
      weeekId: 'weeek1',
      telegramUsername: 'user1',
      vacancy: ['Frontend'],
      name: 'User One'
    })

    testDetailMock.mockResolvedValueOnce([
      { name: 'Test 1', link: 'test-link', isCompleted: false }
    ])

    const result = await getFormattedTask(task)

    expect(result.assignees).toEqual([
      {
        gitlabId: 1234,
        weeekId: 'weeek1',
        telegramLink: 'https://t.me/user1',
        vacancy: ['Frontend'],
        name: 'User One'
      }
    ])

    expect(result.tests.all).toEqual([
      { name: 'Test 1', link: 'test-link', isCompleted: false }
    ])
    expect(result.tests.total).toBe(1)
    expect(result.tests.unresolved?.length).toBe(1)
    expect(result.mr).toBeNull()
  })

  it('должен выбрасывать ошибку, если assignee не существует', async () => {
    const task = {
      assignees: [{ userId: 'invalid' }],
      test: null,
      mrReview: null,
      title: 'Task 1',
      taskUrl: 'task-url',
      mrUrl: 'mr-url',
      mrId: 'mr1',
      isEmergency: false,
      isCompleted: false
    } as unknown as TaskWithRelations

    userMock.mockResolvedValueOnce(null)

    expect(getFormattedTask(task)).rejects.toThrow('Неизвестный User ID')
  })

  it('должен правильно форматировать задачу с данными MR review', async () => {
    const task = {
      assignees: [{ userId: 1 }],
      test: null,
      mrReview: {
        id: 'mr1',
        branchBehindBy: 3,
        hasConflicts: true,
        totalComments: 5,
        unresolvedComments: 2,
        totalReviewers: 3
      },
      title: 'Task 1',
      taskUrl: 'task-url',
      mrUrl: 'mr-url',
      mrId: 'mr1',
      isEmergency: false,
      isCompleted: false
    } as unknown as TaskWithRelations

    userMock.mockResolvedValue({
      gitlabId: 1234,
      weeekId: 'weeek1',
      telegramUsername: 'user1',
      vacancy: ['Frontend'],
      name: 'User One'
    })

    mrReviewerMock.mockResolvedValueOnce([{ userId: 1 }])
    mrCommentMock.mockResolvedValueOnce([
      { assignedUserId: 1, commentId: 1, commentLink: 'comment-link' }
    ])
    mrCommentedUserMock.mockResolvedValueOnce([{ userId: 1 }])

    const result = await getFormattedTask(task)

    expect(result.mr).toEqual({
      branchBehindBy: 3,
      deletions: 0,
      durationSeconds: 0,
      hasConflicts: true,
      comments: {
        total: 5,
        unresolved: 2,
        actionsNeeded: [
          {
            assigned: {
              gitlabId: 1234,
              weeekId: 'weeek1',
              telegramLink: 'https://t.me/user1',
              vacancy: ['Frontend'],
              name: 'User One'
            },
            comments: [{ id: 1, link: 'comment-link' }]
          }
        ],
        peopleCommented: [
          {
            gitlabId: 1234,
            weeekId: 'weeek1',
            telegramLink: 'https://t.me/user1',
            vacancy: ['Frontend'],
            name: 'User One'
          }
        ]
      },
      reviewers: {
        total: 3,
        unresolved: [
          {
            gitlabId: 1234,
            weeekId: 'weeek1',
            telegramLink: 'https://t.me/user1',
            vacancy: FrontendVacancy,
            name: 'User One'
          }
        ],
        reviewNeeded: []
      },
      changedFilesCount: 0,
      additions: 0
    })
  })

  it('должен обрабатывать неизвестного пользователя в MR reviewer', async () => {
    const task = {
      assignees: [{ userId: 1 }],
      test: null,
      mrReview: {
        id: 'mr1',
        branchBehindBy: 3,
        hasConflicts: true,
        totalComments: 5,
        unresolvedComments: 2,
        totalReviewers: 3
      },
      title: 'Task 1',
      taskUrl: 'task-url',
      mrUrl: 'mr-url',
      mrId: 'mr1',
      isEmergency: false,
      isCompleted: false
    } as unknown as TaskWithRelations

    userMock.mockResolvedValueOnce(null)

    expect(getFormattedTask(task)).rejects.toThrow('Неизвестный User ID')
  })

  it('должен обрабатывать пустых рецензентов в MR', async () => {
    const task = {
      assignees: [{ userId: 1 }],
      test: null,
      mrReview: {
        id: 'mr1',
        branchBehindBy: 0,
        hasConflicts: false,
        totalComments: 0,
        unresolvedComments: 0,
        totalReviewers: 0
      },
      title: 'Task 1',
      taskUrl: 'task-url',
      mrUrl: 'mr-url',
      mrId: 'mr1',
      isEmergency: false,
      isCompleted: false
    } as unknown as TaskWithRelations

    userMock.mockResolvedValue({
      gitlabId: 1234,
      weeekId: 'weeek1',
      telegramUsername: 'user1',
      vacancy: ['Frontend'],
      name: 'User One'
    })

    mrReviewerMock.mockResolvedValueOnce([])
    mrCommentMock.mockResolvedValueOnce([])
    mrCommentedUserMock.mockResolvedValueOnce([])

    const result = await getFormattedTask(task)

    expect(result.mr?.reviewers).toEqual({
      total: 0,
      unresolved: [],
      reviewNeeded: []
    })
  })

  it('должен выбрасывать ошибку для неизвестного пользователя в комментариях MR', async () => {
    const task = {
      assignees: [{ userId: 1 }],
      test: null,
      mrReview: {
        id: 'mr1',
        branchBehindBy: 3,
        hasConflicts: true,
        totalComments: 5,
        unresolvedComments: 2,
        totalReviewers: 3
      },
      title: 'Task 1',
      taskUrl: 'task-url',
      mrUrl: 'mr-url',
      mrId: 'mr1',
      isEmergency: false,
      isCompleted: false
    } as unknown as TaskWithRelations

    userMock
      .mockResolvedValueOnce({})
      // Ошибка при получении автора комментария
      .mockResolvedValueOnce(null)

    mrReviewerMock.mockResolvedValueOnce([{ userId: 1 }])
    mrCommentMock.mockResolvedValueOnce([
      { assignedUserId: 999, commentId: 1, commentLink: 'comment-link' }
    ])
    mrCommentedUserMock.mockResolvedValueOnce([{ userId: 999 }])

    expect(getFormattedTask(task)).rejects.toThrow('Неизвестный User ID')
  })

  it('должен обрабатывать нескольких рецензентов с разными статусами', async () => {
    const task = {
      assignees: [{ userId: 1 }],
      test: null,
      mrReview: {
        id: 'mr1',
        branchBehindBy: 2,
        hasConflicts: false,
        totalComments: 3,
        unresolvedComments: 1,
        totalReviewers: 2
      },
      title: 'Task 1',
      taskUrl: 'task-url',
      mrUrl: 'mr-url',
      mrId: 'mr1',
      isEmergency: false,
      isCompleted: false
    } as unknown as TaskWithRelations

    // Мокаем 2 пользователей
    userMock.mockImplementation((id) =>
      Promise.resolve(
        id === 1
          ? {
              gitlabId: 1234,
              weeekId: 'weeek1',
              telegramUsername: 'user1',
              vacancy: ['Frontend'],
              name: 'User One'
            }
          : {
              gitlabId: 5678,
              weeekId: 'weeek2',
              telegramUsername: 'user2',
              vacancy: ['Backend'],
              name: 'User Two'
            }
      )
    )

    mrReviewerMock.mockResolvedValueOnce([{ userId: 1 }, { userId: 2 }]) // 2 рецензента
    mrCommentMock.mockResolvedValueOnce([
      { assignedUserId: 1, commentId: 1, commentLink: 'link1' },
      { assignedUserId: 2, commentId: 2, commentLink: 'link2' }
    ])
    mrCommentedUserMock.mockResolvedValueOnce([{ userId: 1 }, { userId: 2 }])

    const result = await getFormattedTask(task)

    expect(result.mr?.comments.actionsNeeded.length).toBe(2)
    expect(result.mr?.reviewers.reviewNeeded.length).toBe(0)
  })

  it('должен обрабатывать задачи без тестов', async () => {
    const task = {
      assignees: [],
      test: null,
      mrReview: null,
      title: 'Task 1',
      taskUrl: 'task-url',
      mrUrl: 'mr-url',
      mrId: 'mr1',
      isEmergency: false,
      isCompleted: false
    } as unknown as TaskWithRelations

    const result = await getFormattedTask(task)

    expect(result.tests.all).toEqual([])
    expect(result.tests.total).toBe(0)
    expect(result.tests.isNeeded).toBe(false)
  })
})
