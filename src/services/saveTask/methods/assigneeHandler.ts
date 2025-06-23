import type { TeamMember, Tx } from '@database'
import { di } from '@di'
import { deepEqual } from '@utils'

/**
 * Сохраняет исполнителей задачи в базу данных
 *
 * Процесс:
 * 1. Получает существующих исполнителей
 * 2. Сопоставляет GitLab ID с пользователями в БД
 * 3. При изменениях удаляет старых исполнителей и создает новых
 *
 * @param {number} taskId - Идентификатор задачи
 * @param assignees
 * @param tx
 * @returns {Promise<void>}
 */
export async function assigneeHandler(
  taskId: number,
  assignees: TeamMember[],
  tx?: Tx
): Promise<void> {
  const existingAssignees = await di.assignee.getByTaskId(taskId, tx)

  const newAssigneeIds = await Promise.all(
    assignees.map(async (assignee) => {
      const user = await di.user.getByGitlabId(assignee.gitlabId, tx)

      return user?.id
    })
  )

  if (
    !deepEqual(
      existingAssignees?.map((a) => a.userId),
      newAssigneeIds.filter(Boolean)
    )
  ) {
    await di.assignee.deleteByTaskId(taskId, tx)

    for (const assignee of assignees) {
      const user = await di.user.getByGitlabId(assignee.gitlabId, tx)
      if (user) {
        await di.assignee.create(
          {
            taskId,
            userId: user.id
          },
          tx
        )
      }
    }
  }
}
