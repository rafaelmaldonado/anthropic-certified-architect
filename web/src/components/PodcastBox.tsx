// Compact per-TOPIC "NotebookLM podcast" box:
//  - generates a short, topic-specific prompt (copyable)
//  - lets you paste and save the link to the resulting podcast

import { useState } from 'react'
import type { Topic } from '../data/syllabus'
import { CERT } from '../config'

interface Props {
  topic: Topic
  podcastUrl: string | null
  onSavePodcast: (url: string | null) => void
}

function buildPrompt(topic: Topic): string {
  return `Create a 5-7 minute podcast in ${CERT.podcastLanguage} about "${topic.title}" (${topic.blurb}) for the ${CERT.certName} certification. Explain the key concepts with a practical example and close with 2 review questions. Base it only on the provided sources.`
}

export function PodcastBox({ topic, podcastUrl, onSavePodcast }: Props) {
  const [copied, setCopied] = useState(false)
  const [draft, setDraft] = useState(podcastUrl ?? '')
  const [open, setOpen] = useState(false)
  const prompt = buildPrompt(topic)

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard may fail without https */
    }
  }

  return (
    <div className="mt-2">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setOpen((o) => !o)}
          className="text-xs font-medium text-accent hover:underline"
        >
          🎧 Podcast {open ? '▲' : '▼'}
        </button>
        {podcastUrl && (
          <a
            href={podcastUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-accent hover:underline"
          >
            ▶ Listen
          </a>
        )}
      </div>

      {open && (
        <div className="mt-2 rounded-lg border border-black/[0.06] bg-black/[0.015] p-3">
          <div className="mb-2 flex items-start justify-between gap-2">
            <p className="text-xs leading-relaxed text-black/70">{prompt}</p>
            <button
              onClick={copy}
              className="shrink-0 rounded-full bg-accent px-3 py-1 text-xs font-medium text-white transition hover:opacity-90"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Paste the podcast link…"
              className="flex-1 rounded-lg border border-black/10 bg-white px-3 py-1.5 text-sm outline-none focus:border-accent"
            />
            <button
              onClick={() => onSavePodcast(draft.trim() || null)}
              className="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
