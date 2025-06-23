import { PropagationAction } from '@mtcute/dispatcher'
import type { z } from 'zod'

import type { roleEnumZod } from 'database/models/User'

// Получаем тип ролей на основе ролей из БД
type Role = z.infer<typeof roleEnumZod>

export const isAllowedToExecute = async (
  // Роль пишущего пользователя
  userRoles: Role,
  // Роли, которым разрешено выполнять команду
  allowedRoles: Role[]
) => {
  // Если роль пользователя не находится в массиве разрешенных,
  // необходимо прервать выполнение команды
  if (!allowedRoles.includes(userRoles)) {
    return PropagationAction.Stop
  }

  // В ином случае пропускаем дальше
  return PropagationAction.Continue
}
