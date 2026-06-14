// Utilidades de quiz.

import type { QuizQuestion } from '../data/syllabus'
import { CERT } from '../config'

/** How many questions are shown per quiz attempt. */
export const QUIZ_SIZE = CERT.quizSize

/** Threshold (percentage) at or above which you're considered "ready". */
export const READY_THRESHOLD = CERT.quizReadyThreshold

/** Returns `count` questions picked at random from the bank (no repeats). */
export function pickQuestions(bank: QuizQuestion[], count = QUIZ_SIZE): QuizQuestion[] {
  const shuffled = [...bank]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, Math.min(count, shuffled.length))
}
