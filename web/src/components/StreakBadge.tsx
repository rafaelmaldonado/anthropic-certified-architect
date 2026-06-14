import type { StreakInfo } from '../hooks/useStreak'

export function StreakBadge({ streak }: { streak: StreakInfo }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className={`text-3xl ${streak.studiedToday ? '' : 'grayscale opacity-50'}`}>🔥</span>
        <div>
          <div className="text-2xl font-semibold leading-none">{streak.current}</div>
          <div className="text-xs text-black/50 dark:text-white/50">streak (days)</div>
        </div>
      </div>
      <div className="h-8 w-px bg-black/10 dark:bg-white/15" />
      <div>
        <div className="text-2xl font-semibold leading-none">{streak.longest}</div>
        <div className="text-xs text-black/50 dark:text-white/50">best streak</div>
      </div>
      <div className="h-8 w-px bg-black/10 dark:bg-white/15" />
      <div>
        <div className="text-2xl font-semibold leading-none">{streak.totalDays}</div>
        <div className="text-xs text-black/50 dark:text-white/50">total days</div>
      </div>
    </div>
  )
}
