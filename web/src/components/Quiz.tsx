// Per-domain quiz: shows questions, validates, and reports the score.

import { useState } from 'react'
import type { QuizQuestion } from '../data/syllabus'

interface Props {
  questions: QuizQuestion[]
  onComplete: (score: number, total: number) => void
  /** If provided, "Retry" requests a new set of questions. */
  onRetry?: () => void
}

export function Quiz({ questions, onComplete, onRetry }: Props) {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)

  const total = questions.length
  const score = questions.filter((q) => answers[q.id] === q.answer).length
  const allAnswered = questions.every((q) => answers[q.id] !== undefined)

  function submit() {
    setSubmitted(true)
    onComplete(score, total)
  }

  function reset() {
    if (onRetry) {
      onRetry() // generates another set; the remount (key) clears the state
      return
    }
    setAnswers({})
    setSubmitted(false)
  }

  return (
    <div className="space-y-6">
      {questions.map((q, qi) => (
        <div key={q.id}>
          <p className="mb-2 font-medium">
            {qi + 1}. {q.question}
          </p>
          <div className="space-y-2">
            {q.options.map((opt, oi) => {
              const selected = answers[q.id] === oi
              const isCorrect = oi === q.answer
              let cls =
                'border-black/10 bg-white/60 hover:border-accent dark:border-white/15 dark:bg-white/5'
              if (submitted) {
                if (isCorrect) cls = 'border-green-500 bg-green-500/10'
                else if (selected) cls = 'border-red-500 bg-red-500/10'
                else cls = 'border-black/10 opacity-60 dark:border-white/15'
              } else if (selected) {
                cls = 'border-accent bg-accent-soft dark:bg-accent/15'
              }
              return (
                <button
                  key={oi}
                  disabled={submitted}
                  onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-2.5 text-left text-sm transition ${cls}`}
                >
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-current text-[10px]">
                    {String.fromCharCode(65 + oi)}
                  </span>
                  {opt}
                </button>
              )
            })}
          </div>
          {submitted && q.explanation && (
            <p className="mt-2 text-sm text-black/60 dark:text-white/60">💡 {q.explanation}</p>
          )}
        </div>
      ))}

      {!submitted ? (
        <button
          disabled={!allAnswered}
          onClick={submit}
          className="rounded-full bg-accent px-6 py-2.5 font-medium text-white transition enabled:hover:opacity-90 disabled:opacity-40"
        >
          Submit quiz
        </button>
      ) : (
        <div className="flex items-center gap-4">
          <div className="text-lg font-semibold">
            Result: {score}/{total} ({Math.round((score / total) * 100)}%)
          </div>
          <button
            onClick={reset}
            className="rounded-full border border-black/15 px-5 py-2 text-sm font-medium transition hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
          >
            {onRetry ? 'New attempt' : 'Retry'}
          </button>
        </div>
      )}
    </div>
  )
}
