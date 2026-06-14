// Computes the study streak (consecutive days with activity) from the studyLog.

import { useMemo } from 'react'
import { toISODate, fromISODate } from '../lib/dates'

export interface StreakInfo {
  /** Consecutive days up to today (or yesterday, if there's no activity today yet). */
  current: number
  /** All-time longest streak. */
  longest: number
  /** Studied today? */
  studiedToday: boolean
  /** Total number of distinct days with activity. */
  totalDays: number
}

export function useStreak(studyLog: Record<string, number>, today = toISODate()): StreakInfo {
  return useMemo(() => {
    const days = Object.keys(studyLog)
      .filter((d) => (studyLog[d] ?? 0) > 0)
      .sort()

    if (days.length === 0) {
      return { current: 0, longest: 0, studiedToday: false, totalDays: 0 }
    }

    const set = new Set(days)
    const studiedToday = set.has(today)

    // Current streak: count backwards from today (or yesterday if none today).
    let current = 0
    const cursor = fromISODate(today)
    if (!studiedToday) cursor.setDate(cursor.getDate() - 1)
    while (set.has(toISODate(cursor))) {
      current++
      cursor.setDate(cursor.getDate() - 1)
    }

    // Longest streak: walk the sorted days measuring consecutive runs.
    let longest = 1
    let run = 1
    for (let i = 1; i < days.length; i++) {
      const prev = fromISODate(days[i - 1])
      const curr = fromISODate(days[i])
      const gap = Math.round((curr.getTime() - prev.getTime()) / 86_400_000)
      run = gap === 1 ? run + 1 : 1
      if (run > longest) longest = run
    }

    return { current, longest, studiedToday, totalDays: days.length }
  }, [studyLog, today])
}
