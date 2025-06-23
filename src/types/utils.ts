/**
 * Утилитарные типы для TypeScript, используемые в приложении.
 * Этот файл содержит вспомогательные типы для преобразования форматов именования.
 */

/**
 * Вспомогательный тип для преобразования строки из snake_case в camelCase.
 * Использует рекурсивные условные типы для последовательного преобразования
 * каждой части строки, разделенной символом подчеркивания.
 *
 * @example
 * // Тип будет 'userName'
 * type Result = SnakeToCamelCase<'user_name'>
 *
 * @example
 * // Тип будет 'userProfileData'
 * type Result = SnakeToCamelCase<'user_profile_data'>
 */
export type SnakeToCamelCase<S extends string> =
  S extends `${infer Head}_${infer Tail}`
    ? `${Head}${Capitalize<SnakeToCamelCase<Tail>>}`
    : S

/**
 * Утилитарный тип для преобразования всех ключей объекта из snake_case в camelCase.
 * Применяет тип SnakeToCamelCase ко всем ключам объекта, сохраняя их значения.
 * Полезен при работе с данными из API или базы данных, где используется snake_case.
 *
 * @example
 * // Тип будет { userId: number, userName: string }
 * type Result = SnakeToCamel<{ user_id: number, user_name: string }>
 */
export type SnakeToCamel<T> = {
  [K in keyof T as SnakeToCamelCase<K & string>]: T[K]
}
