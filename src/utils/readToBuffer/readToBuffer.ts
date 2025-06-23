/**
 * Асинхронная функция для чтения файла в буфер Uint8Array.
 * Используется для работы с бинарными данными файлов.
 *
 * @param filePath - Путь к файлу, который нужно прочитать
 * @returns Promise, который разрешается в Uint8Array с содержимым файла
 */
export const readToBuffer = async (filePath: string): Promise<Uint8Array> => {
  const file = Bun.file(filePath)
  const buffer = await file.arrayBuffer()

  return new Uint8Array(buffer)
}
