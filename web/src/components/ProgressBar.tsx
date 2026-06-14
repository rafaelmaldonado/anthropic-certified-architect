interface Props {
  percent: number
  className?: string
  /** Altura de la barra en px (default 8). */
  height?: number
}

export function ProgressBar({ percent, className = '', height = 8 }: Props) {
  const clamped = Math.max(0, Math.min(100, percent))
  return (
    <div
      className={`w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/15 ${className}`}
      style={{ height }}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
