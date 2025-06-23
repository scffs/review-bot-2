import type { RegistrationScene } from '../scene.ts'

import { createSceneSteps } from '../../../core'

import type { Field, RegistrationForm, RegistrationState } from '../types.ts'

import { stepOrder } from '../constants.ts'

import { firstName } from '../steps/firstName.ts'
import { start } from '../steps/start.ts'

import { fieldPreChecks } from './helpers/fieldPreChecks.ts'
import { navigateNextOrExit } from './helpers/navigateNextOrExit.ts'
import { promptField } from './helpers/promptField.ts'
import { validateFieldInput } from './helpers/validateFieldInput.ts'

// Регистрация шагов сцены регистрации с использованием созданных функций проверки и навигации
export function registerSteps(this: RegistrationScene) {
  const steps = createSceneSteps<RegistrationForm, RegistrationState, Field>({
    fields: stepOrder, // Порядок шагов регистрации
    preChecks: fieldPreChecks, // Предварительные проверки для каждого поля
    promptField, // Функция вывода подсказки для поля
    handleFieldInput: validateFieldInput, // Валидация ввода пользователя
    navigateNextOrExit // Логика перехода по шагам или выхода
  })

  // Добавляем стартовые шаги
  this.scene.addStep(start)
  this.scene.addStep(firstName)

  // Добавляем остальные шаги
  steps.slice(1).forEach((step) => {
    this.scene.addStep(step)
  })
}
