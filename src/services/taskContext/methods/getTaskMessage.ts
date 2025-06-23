import { formatWord } from '@utils'

import type { TagType } from '@database'

import type { ReviewFields, Task } from 'clients/weeek'

export const getTaskMessage = (task: Task, fields: ReviewFields) => {
  let message = ''

  const hasTag = (tagToCheck: TagType) => {
    return fields.tags?.some((tag) => {
      return tag === tagToCheck
    })
  }

  const isEmergency = hasTag('Emergency')

  // Title - название задачи с ссылкой на Weeek
  if (task.title && task.id) {
    if (isEmergency) {
      message += `🔥🔥 [${task.title}](${fields.taskUrl}) 🔥🔥`
    } else message += `[${task.title}](${fields.taskUrl})`
  } else {
    message += '⚠️ Не указано название задачи'
  }

  message += '  \n\n'

  // Merge Request - проверка наличия ссылки на MR
  if (fields.mrUrl) {
    message += `📝 [MR](${fields.mrUrl})`

    // Если есть конфликты
    if (fields.mr?.hasConflicts) {
      message += ' (⛔️ Конфликты)'
    }

    // Если отстает от main
    if (fields.mr?.branchBehindBy && fields.mr.branchBehindBy > 0) {
      message += `  \n📥 Отстает от main на ${
        fields.mr.branchBehindBy
      } ${formatWord(
        fields.mr.branchBehindBy,
        'коммит',
        'коммита',
        'коммитов'
      )}`
    }
  } else {
    message += '📝⚠️ Не указана ссылка на MR'
  }

  if (fields.tests.isNeeded) {
    message += '  \n'
    // Tests - тестирование
    if (fields.tests.isStarted) {
      if (fields.tests.isCompleted) {
        if (fields.tests.total > 0) {
          message += `🪲 Тестирование пройдено: [${
            fields.tests.total - Number(fields.tests.unresolved?.length)
          }/${fields.tests.total}](${fields.tests.taskUrl}) ✅`
        } else {
          message += '🪲 Тестирование пройдено без багов 🎉✅'
        }
      } else {
        if (fields.tests.total > 0) {
          message += `🪲 Багов исправлено: [${
            fields.tests.total - Number(fields.tests.unresolved?.length)
          }/${fields.tests.total}](${fields.tests.taskUrl})`
        } else {
          message += '🪲 Идёт тестирование...'
        }
      }
    } else {
      if (fields.isEmergency) {
        message += '🪲 Тестирование: 🔥 ожидается 🔥'
      } else {
        message += '🪲 Тестирование: ожидается'
      }
    }
  }

  message += '  \n'

  // Comments - проверка комментов в мр-е
  if (fields.mr?.comments) {
    message += '  \n'
    message += '💬 Комментарии: '
    if (fields.mr.comments.total > 0) {
      if (fields.mr.comments.unresolved === 0) {
        // Все решены
        message += `[${fields.mr.comments.total}](${fields.mrUrl}) ✅ `
      } else {
        // Не все решены
        message += `[${
          fields.mr.comments.total - fields.mr.comments.unresolved
        }/${fields.mr.comments.total}](${fields.mrUrl})`
      }
    } else {
      // Ещё не оставлены
      if (isEmergency) {
        message += '🔥 ожидаются 🔥'
      } else {
        message += 'ожидаются'
      }
    }
  }

  // ActionsNeeded - дополнение к комментарием, показывающее где от кого ждут ответов
  if (fields.mr?.comments?.actionsNeeded.length) {
    message += '  \n'
    message += '🏓 Ожидаются ответы от:  \n'
    let firstAssigned = true

    for (const assigned of fields.mr.comments.actionsNeeded) {
      if (!firstAssigned) {
        message += '  \n'
      }

      message += `[${assigned.assigned.name}](${assigned.assigned.telegramLink}):  \n`
      let firstComment = true

      for (const comment of assigned.comments) {
        if (!firstComment) {
          message += ', '
        }
        message += `[${comment.id}](${comment.link})`
        firstComment = false
      }

      firstAssigned = false
    }
  }

  // Reviewers - проверка аппрувов в мр-е
  if (fields.mr?.reviewers) {
    message += '  \n'
    message += '📋 Аппрувы: '
    if (fields.mr.reviewers.total > 0) {
      message += `[${
        fields.mr.reviewers.total - fields.mr.reviewers.unresolved.length
      }/${fields.mr.reviewers.total}](${fields.mrUrl})`

      if (fields.mr.reviewers.unresolved.length === 0) {
        message += ' ✅'
      }
    } else {
      message += 'не нужны ✅'
    }
  }
  // Дополнение к Reviewers
  if (fields.mr?.reviewers?.reviewNeeded?.length) {
    message += '  \n'
    message += '🖋 Ожидаются аппрувы от:  \n'
    let first = true

    for (const item of fields.mr.reviewers.reviewNeeded) {
      if (!first) {
        message += ', '
      }
      message += `[${item.name}](${item.telegramLink})`
      first = false
    }
  }

  message += '  \n\n'

  // Author - атвор задачи
  if (fields.assignees.length >= 1) {
    if (fields.assignees.length === 1) {
      message += '✍️ Автор: '
    } else {
      message += '✍️ Авторы: '
    }

    for (const assignees of fields.assignees) {
      message += `[${assignees.name}](${assignees.telegramLink}) `
    }

    message += ' \n'
  }

  // Tags - проверка тегов и добавление их в сообщение
  if (fields.tags && fields.tags.length > 0) {
    // Убираем пробелы в тегах
    const tags = fields.tags
      .map((tag) => {
        if (!tag) {
          return
        }

        return `#${tag.replace(/\s+/g, '')}`
      })
      .join(' ')
    message += `#️⃣ Теги: ${tags}  \n`
  } else {
    message += '#️⃣⚠️ Не указаны теги  \n'
  }

  // Добавляем дату до которой нужно выполнить задачу
  if (task.dueDate) {
    message += `📅 до ${new Date(task.dueDate).toLocaleDateString('ru', {
      day: 'numeric',
      month: 'long'
    })}\n`
  }

  // Images - проверка для задач с тегом Docs
  if (hasTag('Docs')) {
    if (!fields.images || fields.images.length === 0) {
      message +=
        '  \n❗ Для задач с тегом Docs необходимо загрузить изображения'
    }
  }

  // Videos - проверка для задач с тегами Fullstack или Frontend
  if (
    !hasTag('WithoutMediaTesting') &&
    (hasTag('Frontend') || hasTag('Fullstack'))
  ) {
    if (!fields.videos || fields.videos.length === 0) {
      message +=
        '  \n❗ Для задач с тегом Frontend или Fullstack необходимо загрузить видеоролики'
    }
  }

  return message
}
