import { afterEach, beforeEach, describe, expect, it, jest } from 'bun:test'

import { db } from '@database'
import { di } from '@di'

import { logger } from '../logger'
import { shutdown } from './shutdown'

describe('shutdown', () => {
  let closeBotMock: jest.Mock
  let disconnectDbMock: jest.Mock
  let exitMock: jest.Mock // Убираем дженерик, так как он не требуется для process.exit

  beforeEach(() => {
    // Мокаем функции и объекты
    closeBotMock = jest.fn().mockResolvedValue(undefined) // Мокируем успешное закрытие Telegram-клиента
    disconnectDbMock = jest.fn().mockResolvedValue(undefined) // Мокируем успешное отключение от БД
    exitMock = jest.fn() // Мокируем процесс завершения с правильным типом

    // Мокаем зависимости
    di.bot.tg.close = closeBotMock
    db.disconnect = disconnectDbMock

    // @ts-ignore
    process.exit = exitMock

    // Мокаем логгер
    // @ts-ignore
    jest.spyOn(logger, 'info').mockImplementation(() => {})
  })

  afterEach(() => {
    // Восстанавливаем оригинальные реализации
    jest.restoreAllMocks()
  })

  it('должен корректно завершить работу приложения', async () => {
    // Вызов функции shutdown
    await shutdown()

    // Проверка, что Telegram-клиент был закрыт
    expect(closeBotMock).toHaveBeenCalled()

    // Проверка, что соединение с БД было закрыто
    expect(disconnectDbMock).toHaveBeenCalled()

    // Проверка, что process.exit был вызван с кодом 0
    expect(exitMock).toHaveBeenCalledWith(0)

    // Проверка логирования начала и окончания завершения работы
    expect(logger.info).toHaveBeenCalledWith('Завершение работы приложения...')
    expect(logger.info).toHaveBeenCalledWith(
      'Приложение успешно завершило работу.'
    )
  })

  it('должен выбрасывать ошибку, если не удается закрыть Telegram-клиент', async () => {
    // Мокаем ошибку при закрытии Telegram-клиента
    closeBotMock.mockRejectedValue(
      new Error('Ошибка закрытия Telegram-клиента')
    )

    // Проверка, что функция выбрасывает ошибку
    expect(shutdown()).rejects.toThrow('Ошибка закрытия Telegram-клиента')

    // Проверка, что process.exit не был вызван
    expect(exitMock).not.toHaveBeenCalled()
  })

  it('должен выбрасывать ошибку, если не удается отключиться от базы данных', async () => {
    // Мокаем ошибку при отключении от базы данных
    disconnectDbMock.mockRejectedValue(
      new Error('Ошибка отключения от базы данных')
    )

    // Проверка, что функция выбрасывает ошибку
    expect(shutdown()).rejects.toThrow('Ошибка отключения от базы данных')

    // Проверка, что process.exit не был вызван
    expect(exitMock).not.toHaveBeenCalled()
  })
})
