// Date utilities in local yyyy-mm-dd format (no external dependencies).

/** Returns 'yyyy-mm-dd' in local time for a given date (today by default). */
export function toISODate(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Parsea 'yyyy-mm-dd' a Date local a medianoche. */
export function fromISODate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** Whole-day difference between two ISO dates (b - a). */
export function daysBetween(a: string, b: string): number {
  const ms = fromISODate(b).getTime() - fromISODate(a).getTime()
  return Math.round(ms / 86_400_000)
}

/** List of the last N days ending today, as ascending ISO dates. */
export function lastNDays(n: number, today: Date = new Date()): string[] {
  const out: string[] = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    out.push(toISODate(d))
  }
  return out
}

/** Days remaining (can be negative) from today until an ISO deadline. */
export function daysUntil(deadline: string, today: string): number {
  return daysBetween(today, deadline)
}
