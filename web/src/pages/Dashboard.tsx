import { Link } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext'
import { useAuth } from '../context/AuthContext'
import { useStreak } from '../hooks/useStreak'
import { SYLLABUS, TOTAL_TOPICS } from '../data/syllabus'
import { ProgressBar } from '../components/ProgressBar'
import { StreakBadge } from '../components/StreakBadge'
import { StudyHeatmap } from '../components/StudyHeatmap'
import { domainPercent, overallCompleted, overallPercent } from '../lib/progress'
import { toISODate, daysUntil } from '../lib/dates'
import { CERT } from '../config'

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-apple bg-white/80 p-6 shadow-apple backdrop-blur dark:bg-white/5 ${className}`}
    >
      {children}
    </section>
  )
}

export function Dashboard() {
  const { data } = useProgress()
  const { user } = useAuth()
  const streak = useStreak(data.studyLog)
  const today = toISODate()

  const overall = overallPercent(data)
  const done = overallCompleted(data)

  // Upcoming deadlines, sorted (the user's, or the one suggested by the plan).
  const deadlines = SYLLABUS.map((d) => ({
    domain: d,
    deadline: data.domains[d.id]?.deadline ?? d.suggestedDeadline,
    isSuggested: !data.domains[d.id]?.deadline && !!d.suggestedDeadline,
  }))
    .filter((x) => x.deadline)
    .sort((a, b) => (a.deadline! < b.deadline! ? -1 : 1))

  const firstName = (user?.displayName ?? '').split(' ')[0]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Hi{firstName ? `, ${firstName}` : ''}
        </h1>
        <p className="mt-1 text-black/55 dark:text-white/55">
          {CERT.tagline}
        </p>
      </div>

      <Card>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-sm text-black/55 dark:text-white/55">Overall progress</div>
            <div className="text-4xl font-bold">{overall}%</div>
          </div>
          <div className="text-right text-sm text-black/55 dark:text-white/55">
            {done} / {TOTAL_TOPICS} topics
          </div>
        </div>
        <ProgressBar percent={overall} className="mt-4" height={12} />
      </Card>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-sm font-semibold text-black/55 dark:text-white/55">
            Study streak
          </h2>
          <StreakBadge streak={streak} />
          {!streak.studiedToday && (
            <p className="mt-4 text-sm text-black/50 dark:text-white/50">
              No study logged today yet. Complete a topic or a quiz to keep your streak.
            </p>
          )}
        </Card>

        <Card>
          <h2 className="mb-4 text-sm font-semibold text-black/55 dark:text-white/55">
            Upcoming deadlines
          </h2>
          {deadlines.length === 0 ? (
            <p className="text-sm text-black/50 dark:text-white/50">
              No deadlines yet. Set them on each domain in the syllabus.
            </p>
          ) : (
            <ul className="space-y-3">
              {deadlines.slice(0, 5).map(({ domain, deadline, isSuggested }) => {
                const rem = daysUntil(deadline!, today)
                return (
                  <li key={domain.id} className="flex items-center justify-between gap-3 text-sm">
                    <Link to={`/syllabus#${domain.id}`} className="truncate hover:text-accent">
                      {domain.title}
                      {isSuggested && (
                        <span className="ml-1 text-xs text-black/35">(suggested)</span>
                      )}
                    </Link>
                    <span
                      className={`shrink-0 font-medium ${
                        rem < 0 ? 'text-red-500' : rem <= 7 ? 'text-amber-500' : 'text-black/50 dark:text-white/50'
                      }`}
                    >
                      {rem < 0 ? `overdue` : rem === 0 ? 'today' : `${rem} d`}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </Card>
      </div>

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-black/55 dark:text-white/55">
          Study heatmap
        </h2>
        <StudyHeatmap studyLog={data.studyLog} />
      </Card>

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-black/55 dark:text-white/55">
          Progress by domain
        </h2>
        <div className="space-y-4">
          {SYLLABUS.map((d) => {
            const pct = domainPercent(d, data)
            return (
              <Link key={d.id} to={`/syllabus#${d.id}`} className="block group">
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="text-accent">{d.icon}</span>
                    <span className="group-hover:text-accent">{d.title}</span>
                    <span className="text-xs text-black/40 dark:text-white/40">· {d.weight}%</span>
                  </span>
                  <span className="text-black/50 dark:text-white/50">{pct}%</span>
                </div>
                <ProgressBar percent={pct} />
              </Link>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
