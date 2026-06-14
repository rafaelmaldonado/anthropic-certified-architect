// Per-domain deadline picker, with a days-remaining indicator.
// If the user hasn't set a date but the study plan provides a "suggested" one,
// it shows that as the default and offers a button to adopt it.

import { daysUntil, toISODate } from '../lib/dates'

interface Props {
  deadline: string | null
  /** Date suggested by the plan (ISO yyyy-mm-dd), if any. */
  suggested?: string | null
  onChange: (deadline: string | null) => void
}

export function DeadlineEditor({ deadline, suggested = null, onChange }: Props) {
  const today = toISODate()
  // Effective date to show: the user's, or the suggested one as a fallback.
  const effective = deadline ?? suggested
  const isSuggested = !deadline && !!suggested
  const remaining = effective ? daysUntil(effective, today) : null

  let label = 'No date'
  let tone = 'text-black/40'
  if (remaining !== null) {
    if (remaining < 0) {
      label = `Overdue by ${Math.abs(remaining)} d`
      tone = 'text-red-500'
    } else if (remaining === 0) {
      label = 'Today'
      tone = 'text-amber-500'
    } else if (remaining <= 7) {
      label = `${remaining} d left`
      tone = 'text-amber-500'
    } else {
      label = `${remaining} d left`
      tone = 'text-black/50'
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        type="date"
        value={effective ?? ''}
        onChange={(e) => onChange(e.target.value || null)}
        className="rounded-lg border border-black/10 bg-white/60 px-2 py-1 text-xs outline-none focus:border-accent"
      />
      <span className={`text-xs font-medium ${tone}`}>{label}</span>
      {isSuggested && (
        <button
          onClick={() => onChange(suggested)}
          className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent transition hover:bg-accent hover:text-white"
          title="Adopt the date suggested by the study plan"
        >
          suggested · use
        </button>
      )}
    </div>
  )
}
