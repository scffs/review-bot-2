import { type Weeek, weeek } from 'clients/weeek'

import { processTag, setup, tagsWithWeeek } from './methods'

export class Sync {
  weeekApi: Weeek

  constructor() {
    // Инициализация API клиента Weeek
    this.weeekApi = weeek
  }

  // Метод для синхронизации тегов между Weeek и базой данных
  tagsWithWeeek = tagsWithWeeek

  // Метод для базовой инициализации или настройки синхронизации (не показан в этом фрагменте)
  setup = setup

  // Метод для обработки одного тега из Weeek (создание или обновление)
  processTag = processTag
}

export const sync = new Sync()
