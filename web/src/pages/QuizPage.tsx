import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { SYLLABUS } from '../data/syllabus'
import { useProgress } from '../context/ProgressContext'
import { Quiz } from '../components/Quiz'
import { toISODate } from '../lib/dates'
import { pickQuestions, QUIZ_SIZE, READY_THRESHOLD } from '../lib/quiz'

export function QuizPage() {
  const { domainId } = useParams()
  const { data, saveQuiz } = useProgress()
  const domain = SYLLABUS.find((d) => d.id === domainId)

  // Random question selection; `seed` lets us regenerate another set.
  const [seed, setSeed] = useState(0)
  // useState with initializer so we don't re-sample on every render; changes with `seed`.
  const [questions, setQuestions] = useState(() => pickQuestions(domain?.quiz ?? []))

  if (!domain) {
    return (
      <div className="text-center">
        <p>Domain not found.</p>
        <Link to="/syllabus" className="text-accent hover:underline">
          Back to syllabus
        </Link>
      </div>
    )
  }

  const result = data.quizzes[domain.id]
  const attempts = result?.attempts ?? []
  const bestPct = result ? Math.round((result.bestScore / result.total) * 100) : null
  const isReady = bestPct !== null && bestPct >= READY_THRESHOLD

  function regenerate() {
    setSeed((s) => s + 1)
    setQuestions(pickQuestions(domain!.quiz))
  }

  return (
    <div className="space-y-6">
      <div>
        <Link to="/syllabus" className="text-sm text-accent hover:underline">
          ‹ Syllabus
        </Link>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Quiz · {domain.title}</h1>
        <p className="mt-1 text-black/55">
          {Math.min(QUIZ_SIZE, domain.quiz.length)} random questions from a bank of{' '}
          {domain.quiz.length}. Reach {READY_THRESHOLD}% to be ready.
        </p>
      </div>

      {/* Progress summary */}
      {result && (
        <section className="rounded-apple bg-white/80 p-5 shadow-apple">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <div>
              <div className="text-xs text-black/50">Best score</div>
              <div className="text-2xl font-semibold">{bestPct}%</div>
            </div>
            <div>
              <div className="text-xs text-black/50">Attempts</div>
              <div className="text-2xl font-semibold">{attempts.length}</div>
            </div>
            <div
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                isReady ? 'bg-green-500/15 text-green-700' : 'bg-amber-500/15 text-amber-700'
              }`}
            >
              {isReady ? '✓ Ready to complete' : `Not yet · goal ${READY_THRESHOLD}%`}
            </div>
          </div>

          {attempts.length > 0 && (
            <div className="mt-4">
              <div className="mb-2 text-xs text-black/50">History (last 12)</div>
              <div className="flex flex-wrap gap-1.5">
                {attempts.slice(-12).map((a, i) => {
                  const pct = Math.round((a.score / a.total) * 100)
                  const ok = pct >= READY_THRESHOLD
                  return (
                    <span
                      key={i}
                      title={`${a.date}: ${a.score}/${a.total} (${pct}%)`}
                      className={`rounded-md px-2 py-1 text-xs font-medium ${
                        ok ? 'bg-green-500/15 text-green-700' : 'bg-black/[0.06] text-black/60'
                      }`}
                    >
                      {pct}%
                    </span>
                  )
                })}
              </div>
            </div>
          )}
        </section>
      )}

      <section className="rounded-apple bg-white/80 p-6 shadow-apple">
        <Quiz
          key={seed}
          questions={questions}
          onComplete={(score, total) => saveQuiz(domain.id, score, total, toISODate())}
          onRetry={regenerate}
        />
      </section>
    </div>
  )
}
