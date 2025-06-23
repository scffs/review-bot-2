import type { UserWithVacancies } from '@database'

export const getFormattedStartText = (user: UserWithVacancies) => {
  let message = `Привет, 👤 ${user.name}\n\n`
  message += `Твоя должность – ${user.vacancy}\n\n`
  message += 'Я бот для управления задачами и уведомлениями.\n\n'
  message += 'Доступные команды:\n'
  message += '/start — приветственное сообщение\n'
  message += '/self — посмотреть свою статистику\n'
  message += '/daily — посмотреть краткую сводку по своим рабочим задачам'

  if (user.role === 'admin') {
    message += '\n/analytic — посмотреть краткую сводку по команде'
  }

  return message
}
