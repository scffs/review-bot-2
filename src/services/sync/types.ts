import type { TagValueType } from '@database'

/**
 * Маппинг тегов из Weeek в теги базы данных.
 * Ключ - название тега в Weeek (на русском языке)
 * Значение - соответствующий тег в базе данных (на английском языке)
 *
 * Пример:
 * 'Срочно' -> 'Emergency'
 * 'Без Тестирования' -> 'WithoutTesting'
 */
export const TAG_MAPPING: Record<string, TagValueType> = {
  Срочно: 'Emergency',
  'Без Тестирования': 'WithoutTesting',
  'Без Медиа Теста': 'WithoutMediaTesting',
  Frontend: 'Frontend',
  Backend: 'Backend',
  Docs: 'Docs',
  DevOps: 'DevOps',
  Fullstack: 'Fullstack',
  Pixi: 'Pixi',
  Баг: 'Bug',
  'TL ревью': 'TLReview'
} as const
