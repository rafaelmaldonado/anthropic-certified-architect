// Progress calculations derived from the user's state and the syllabus.

import { SYLLABUS, TOTAL_TOPICS, type Domain } from '../data/syllabus'
import type { ProgressData } from '../context/ProgressContext'

export function domainCompleted(domain: Domain, data: ProgressData): number {
  return domain.topics.filter((t) => data.topics[t.id]?.done).length
}

export function domainPercent(domain: Domain, data: ProgressData): number {
  if (domain.topics.length === 0) return 0
  return Math.round((domainCompleted(domain, data) / domain.topics.length) * 100)
}

export function overallCompleted(data: ProgressData): number {
  return SYLLABUS.reduce((sum, d) => sum + domainCompleted(d, data), 0)
}

export function overallPercent(data: ProgressData): number {
  if (TOTAL_TOPICS === 0) return 0
  return Math.round((overallCompleted(data) / TOTAL_TOPICS) * 100)
}
