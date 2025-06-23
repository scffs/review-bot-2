/**
 * Функция для глубокого сравнения двух объектов.
 * Проверяет, равны ли два объекта по содержимому, а не только по ссылке.
 */
export const deepEqual = (obj1: unknown, obj2: unknown) =>
  Bun.deepEquals(obj1, obj2, true)
