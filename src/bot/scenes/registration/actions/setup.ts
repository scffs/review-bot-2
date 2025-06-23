import { PropagationAction, filters } from '@mtcute/dispatcher'

import type { DispatcherWithStorage } from '@bot'

import { isAllowedToExecute } from '../../../middlewares'
import { type RegistrationScene, registrationScene } from '../scene.ts'

export function setup(this: RegistrationScene, dp: DispatcherWithStorage) {
  // Регистрируем сцену регистрации в диспетчере
  dp.addScene(this.scene)

  // Обработчик команды /register
  dp.onNewMessage(filters.command('register'), async (_msg, state) => {
    // Проверяем, разрешено ли пользователю с текущей ролью выполнять регистрацию
    const propagationAction = await isAllowedToExecute(dp.deps.user.role, [
      'admin'
    ])

    // Если доступ запрещён, останавливаем дальнейшую обработку события
    if (propagationAction === PropagationAction.Stop) {
      return PropagationAction.Stop
    }

    // Входим в сцену регистрации (начинаем процесс регистрации)
    await state.enter(registrationScene.scene)
    return PropagationAction.ToScene
  })

  // Регистрируем обработчики callback-запросов (кнопок inline-клавиатуры)
  this.registerCallbackHandlers()

  // Регистрируем шаги сцены (логика последовательных действий при регистрации)
  this.registerSteps()
}
