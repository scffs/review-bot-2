export const formatDuration = (seconds: number): string => {
  const SECONDS_IN_MINUTE = 60
  const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60
  const SECONDS_IN_DAY = SECONDS_IN_HOUR * 24
  const SECONDS_IN_MONTH = SECONDS_IN_DAY * 30

  const months = Math.floor(seconds / SECONDS_IN_MONTH)
  seconds %= SECONDS_IN_MONTH

  const days = Math.floor(seconds / SECONDS_IN_DAY)
  seconds %= SECONDS_IN_DAY

  const hours = Math.floor(seconds / SECONDS_IN_HOUR)
  seconds %= SECONDS_IN_HOUR

  const minutes = Math.floor(seconds / SECONDS_IN_MINUTE)
  seconds %= SECONDS_IN_MINUTE

  const parts: string[] = []
  if (months > 0) {
    parts.push(`${months}мес`)
  }

  if (days > 0) {
    parts.push(`${days}д`)
  }

  if (hours > 0) {
    parts.push(`${hours}ч`)
  }

  if (minutes > 0) {
    parts.push(`${minutes}м`)
  }

  if (seconds > 0 || parts.length === 0) {
    parts.push(`${seconds}с`)
  }

  return parts.join(' ')
}

// formatDuration(93784) "1д 2ч 3м 4с"
