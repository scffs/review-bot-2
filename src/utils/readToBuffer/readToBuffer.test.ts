import { describe, expect, it } from 'bun:test'

import { readToBuffer } from './readToBuffer'

describe('readToBuffer', () => {
  it('должен выбрасывать ошибку, если файл не существует', async () => {
    const filePath = 'path/to/file.txt'

    expect(readToBuffer(filePath)).rejects.toThrow(
      'ENOENT: no such file or directory'
    )
  })
})
