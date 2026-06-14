// GitHub-style heatmap: ~17 weeks (119 days) in weekly columns.

import { lastNDays, fromISODate } from '../lib/dates'

interface Props {
  studyLog: Record<string, number>
  days?: number
}

function level(count: number): number {
  if (count <= 0) return 0
  if (count === 1) return 1
  if (count === 2) return 2
  if (count <= 4) return 3
  return 4
}

const LEVEL_CLASS = [
  'bg-black/[0.06] dark:bg-white/[0.08]',
  'bg-accent/30',
  'bg-accent/50',
  'bg-accent/75',
  'bg-accent',
]

export function StudyHeatmap({ studyLog, days = 119 }: Props) {
  const all = lastNDays(days)
  // Alinear para que cada columna sea una semana (domingo arriba).
  const firstDow = fromISODate(all[0]).getDay()
  const padded: (string | null)[] = [...Array(firstDow).fill(null), ...all]
  const weeks: (string | null)[][] = []
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7))
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-[3px]">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((day, di) => {
              if (!day) return <div key={di} className="h-3 w-3" />
              const lvl = level(studyLog[day] ?? 0)
              return (
                <div
                  key={di}
                  className={`h-3 w-3 rounded-[3px] ${LEVEL_CLASS[lvl]}`}
                  title={`${day}: ${studyLog[day] ?? 0} activity(ies)`}
                />
              )
            })}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-black/50 dark:text-white/50">
        <span>Less</span>
        {LEVEL_CLASS.map((c, i) => (
          <span key={i} className={`h-3 w-3 rounded-[3px] ${c}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}
