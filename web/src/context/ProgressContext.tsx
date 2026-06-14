// User progress state, synced live with Firestore (onSnapshot).
// Without Firebase configured, it persists to localStorage so the app works offline.
//
// Document shape (users/{uid}):
//   topics:   { [topicId]: { done: boolean, podcastUrl?: string | null } }
//   domains:  { [domainId]: { deadline: string | null } }   // ISO yyyy-mm-dd
//   studyLog: { [yyyy-mm-dd]: number }                       // intensity (count)
//   quizzes:  { [domainId]: { bestScore: number, total: number, lastAttempt: string } }

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../firebase'
import { useAuth } from './AuthContext'

export interface TopicState {
  done: boolean
  /** Enlace al podcast (NotebookLM) generado para este tema. */
  podcastUrl?: string | null
}

export interface DomainState {
  deadline: string | null
}

/** A recorded quiz attempt. */
export interface QuizAttempt {
  date: string // ISO yyyy-mm-dd
  score: number
  total: number
}

export interface QuizResult {
  bestScore: number
  total: number
  lastAttempt: string
  /** Full attempt history (most recent last). */
  attempts?: QuizAttempt[]
}

export interface ProgressData {
  topics: Record<string, TopicState>
  domains: Record<string, DomainState>
  studyLog: Record<string, number>
  quizzes: Record<string, QuizResult>
}

const EMPTY: ProgressData = { topics: {}, domains: {}, studyLog: {}, quizzes: {} }

function merge(base: ProgressData, patch: Partial<ProgressData>): ProgressData {
  return {
    topics: { ...base.topics, ...patch.topics },
    domains: { ...base.domains, ...patch.domains },
    studyLog: { ...base.studyLog, ...patch.studyLog },
    quizzes: { ...base.quizzes, ...patch.quizzes },
  }
}

interface ProgressContextValue {
  data: ProgressData
  loading: boolean
  toggleTopic: (topicId: string) => void
  setDeadline: (domainId: string, deadline: string | null) => void
  setTopicPodcast: (topicId: string, podcastUrl: string | null) => void
  recordStudyToday: (today: string) => void
  saveQuiz: (domainId: string, score: number, total: number, today: string) => void
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined)

function localKey(uid: string) {
  return `progress:${uid}`
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [data, setData] = useState<ProgressData>(EMPTY)
  const [loading, setLoading] = useState(true)

  // Initial load + live subscription.
  useEffect(() => {
    if (!user) {
      setData(EMPTY)
      setLoading(false)
      return
    }

    if (!isFirebaseConfigured || !db) {
      const raw = localStorage.getItem(localKey(user.uid))
      setData(raw ? merge(EMPTY, JSON.parse(raw)) : EMPTY)
      setLoading(false)
      return
    }

    const ref = doc(db, 'users', user.uid)
    const unsub = onSnapshot(ref, (snap) => {
      setData(snap.exists() ? merge(EMPTY, snap.data() as Partial<ProgressData>) : EMPTY)
      setLoading(false)
    })
    return unsub
  }, [user])

  // Persists a patch (optimistic locally; merge in Firestore).
  function persist(patch: Partial<ProgressData>) {
    if (!user) return
    setData((prev) => {
      const next = merge(prev, patch)
      if (!isFirebaseConfigured || !db) {
        localStorage.setItem(localKey(user.uid), JSON.stringify(next))
      }
      return next
    })
    if (isFirebaseConfigured && db) {
      void setDoc(doc(db, 'users', user.uid), patch, { merge: true })
    }
  }

  const api = useMemo<ProgressContextValue>(() => {
    return {
      data,
      loading,
      toggleTopic(topicId) {
        const current = data.topics[topicId] ?? { done: false }
        persist({ topics: { [topicId]: { ...current, done: !current.done } } })
      },
      setDeadline(domainId, deadline) {
        const current = data.domains[domainId] ?? { deadline: null }
        persist({ domains: { [domainId]: { ...current, deadline } } })
      },
      setTopicPodcast(topicId, podcastUrl) {
        const current = data.topics[topicId] ?? { done: false }
        persist({ topics: { [topicId]: { ...current, podcastUrl } } })
      },
      recordStudyToday(today) {
        const count = (data.studyLog[today] ?? 0) + 1
        persist({ studyLog: { [today]: count } })
      },
      saveQuiz(domainId, score, total, today) {
        const prev = data.quizzes[domainId]
        // Scores are normalized to a percentage so attempts can be compared even
        // when the number of questions changes.
        const prevPct = prev ? prev.bestScore / prev.total : 0
        const pct = total > 0 ? score / total : 0
        const keepPrev = prev && prevPct >= pct
        const attempts = [...(prev?.attempts ?? []), { date: today, score, total }]
        persist({
          quizzes: {
            [domainId]: {
              bestScore: keepPrev ? prev!.bestScore : score,
              total: keepPrev ? prev!.total : total,
              lastAttempt: today,
              attempts,
            },
          },
          studyLog: { [today]: (data.studyLog[today] ?? 0) + 1 },
        })
      },
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, loading, user])

  return <ProgressContext.Provider value={api}>{children}</ProgressContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within <ProgressProvider>')
  return ctx
}
