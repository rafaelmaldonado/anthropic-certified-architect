import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SYLLABUS } from '../data/syllabus'
import { useProgress } from '../context/ProgressContext'
import { ProgressBar } from '../components/ProgressBar'
import { DeadlineEditor } from '../components/DeadlineEditor'
import { PodcastBox } from '../components/PodcastBox'
import { domainCompleted, domainPercent } from '../lib/progress'
import { toISODate } from '../lib/dates'
import { READY_THRESHOLD } from '../lib/quiz'
import { CERT } from '../config'

export function Syllabus() {
  const { data, toggleTopic, setDeadline, setTopicPodcast, recordStudyToday } = useProgress()
  const { hash } = useLocation()
  const [open, setOpen] = useState<string | null>(null)

  // Open and scroll to the domain if a hash is present (#domainId).
  useEffect(() => {
    if (hash) {
      const id = hash.slice(1)
      setOpen(id)
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [hash])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Syllabus</h1>
        <p className="mt-1 text-black/55 dark:text-white/55">
          {SYLLABUS.length} domains · check off each topic, review its resources, and generate a podcast.
        </p>
      </div>

      {SYLLABUS.map((domain) => {
        const pct = domainPercent(domain, data)
        const completed = domainCompleted(domain, data)
        const isOpen = open === domain.id
        const quiz = data.quizzes[domain.id]
        const quizReady = quiz ? quiz.bestScore / quiz.total >= READY_THRESHOLD / 100 : false
        // If the cert requires passing the quiz, topics stay locked until you do.
        const locked = CERT.requireQuizToComplete && !quizReady
        return (
          <section
            key={domain.id}
            id={domain.id}
            className="scroll-mt-20 rounded-apple bg-white/80 shadow-apple backdrop-blur dark:bg-white/5"
          >
            <button
              onClick={() => setOpen(isOpen ? null : domain.id)}
              className="flex w-full items-center gap-4 p-6 text-left"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent-soft text-xl text-accent dark:bg-accent/15">
                {domain.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <h2 className="truncate font-semibold">{domain.title}</h2>
                    <span className="shrink-0 rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
                      {domain.weight}%
                    </span>
                  </div>
                  <span className="shrink-0 text-sm text-black/50">
                    {completed}/{domain.topics.length}
                  </span>
                </div>
                <ProgressBar percent={pct} className="mt-2" />
              </div>
              <span
                className={`shrink-0 text-black/30 transition-transform dark:text-white/30 ${
                  isOpen ? 'rotate-90' : ''
                }`}
              >
                ›
              </span>
            </button>

            {isOpen && (
              <div className="border-t border-black/[0.06] px-6 pb-6 pt-4 dark:border-white/10">
                <p className="mb-4 text-sm text-black/55 dark:text-white/55">
                  {domain.description}
                </p>

                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <DeadlineEditor
                    deadline={data.domains[domain.id]?.deadline ?? null}
                    suggested={domain.suggestedDeadline ?? null}
                    onChange={(dl) => setDeadline(domain.id, dl)}
                  />
                  <div className="flex items-center gap-3">
                    {quiz && (
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          quizReady
                            ? 'bg-green-500/15 text-green-700'
                            : 'bg-black/[0.06] text-black/60'
                        }`}
                        title={`${quiz.attempts?.length ?? 0} attempt(s)`}
                      >
                        {quizReady ? '✓ ' : ''}Quiz {Math.round((quiz.bestScore / quiz.total) * 100)}%
                      </span>
                    )}
                    <Link
                      to={`/quiz/${domain.id}`}
                      className="rounded-full border border-accent px-4 py-1.5 text-sm font-medium text-accent transition hover:bg-accent hover:text-white"
                    >
                      Take quiz
                    </Link>
                  </div>
                </div>

                {locked && (
                  <div className="mb-4 flex items-center gap-2 rounded-xl bg-amber-500/10 px-4 py-2.5 text-sm text-amber-700">
                    <span>🔒</span>
                    <span>
                      Pass the quiz ({READY_THRESHOLD}%) to mark this domain’s topics as
                      completed.
                    </span>
                  </div>
                )}

                <ul className="space-y-2">
                  {domain.topics.map((topic) => {
                    const state = data.topics[topic.id]
                    const checked = state?.done ?? false
                    return (
                      <li
                        key={topic.id}
                        className="rounded-xl border border-black/[0.06] p-3 dark:border-white/10"
                      >
                        <label
                          className={`flex items-start gap-3 ${
                            locked && !checked ? 'cursor-not-allowed' : 'cursor-pointer'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            // Locked only for CHECKING (not unchecking) when the quiz isn't passed.
                            disabled={locked && !checked}
                            onChange={() => {
                              toggleTopic(topic.id)
                              if (!checked) recordStudyToday(toISODate())
                            }}
                            className="mt-0.5 h-5 w-5 shrink-0 accent-[#0071e3] disabled:opacity-40"
                          />
                          <div className="min-w-0">
                            <div className={`font-medium ${checked ? 'text-black/40 line-through dark:text-white/40' : ''}`}>
                              {topic.title}
                            </div>
                            <div className="text-sm text-black/55 dark:text-white/55">
                              {topic.blurb}
                            </div>
                          </div>
                        </label>

                        {topic.resources && topic.resources.length > 0 && (
                          <ul className="ml-8 mt-2 space-y-1">
                            {topic.resources.map((r) => (
                              <li key={r.url} className="flex items-center gap-2 text-sm">
                                <span className="text-accent">↗</span>
                                <a
                                  href={r.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-accent hover:underline"
                                >
                                  {r.title}
                                </a>
                                {r.source && (
                                  <span className="text-xs text-black/40">· {r.source}</span>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}

                        <div className="ml-8">
                          <PodcastBox
                            topic={topic}
                            podcastUrl={state?.podcastUrl ?? null}
                            onSavePodcast={(url) => setTopicPodcast(topic.id, url)}
                          />
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}
