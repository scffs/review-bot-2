/**
 * Запускает асинхронную функцию fn сразу и затем через каждые `interval` миллисекунд.
 * Возвращает функцию `stop`, чтобы прекратить дальнейшие запуски.
 */
export const withTimeOut = (
  fn: () => Promise<void>,
  interval: number
): (() => void) => {
  let stopped = false

  const tick = (): void => {
    if (stopped) {
      return
    }

    fn().finally(() => {
      setTimeout(tick, interval)
    })
  }

  tick()
  return () => {
    stopped = true
  }
}
