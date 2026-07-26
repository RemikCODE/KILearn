'use client'

import { useCallback, useState, type ReactNode } from 'react'
import { Settings, RotateCcw } from 'lucide-react'
import { useOutsideClick } from '@/hooks/use-outside-click'
import { ToggleSwitch } from '@/components/ui/toggle-switch'
import { cn } from '@/lib/utils'
import type { StudyDirection, StudyMode } from '@/hooks/use-study-progress'

// Menu zębatki dostępne zarówno na stronie zestawu, jak i w trakcie sesji
// nauki. `ownerActions`, jeśli podane, dokłada dodatkowe pozycje (edycja,
// przeniesienie do kategorii, usunięcie) widoczne tylko na stronie zestawu.
export function StudySettingsMenu({
  mode,
  onModeChange,
  direction,
  onDirectionChange,
  progressTrackingEnabled,
  onProgressTrackingChange,
  onReset,
  ownerActions,
}: {
  mode: StudyMode
  onModeChange: (mode: StudyMode) => void
  direction: StudyDirection
  onDirectionChange: (direction: StudyDirection) => void
  progressTrackingEnabled: boolean
  onProgressTrackingChange: (enabled: boolean) => void
  onReset: () => void
  ownerActions?: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const ref = useOutsideClick<HTMLDivElement>(open, close)

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Ustawienia nauki"
        className="flex size-11 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Settings className="size-5" />
      </button>

      {open && (
        <div className="absolute right-0 z-40 mt-2 w-72 origin-top-right overflow-hidden rounded-2xl border border-border bg-popover p-3 text-popover-foreground shadow-xl shadow-black/20">
          <div className="flex flex-col gap-3">
            <div>
              <p className="mb-1.5 px-0.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Tryb nauki
              </p>
              <SegmentedControl
                options={[
                  { value: 'kilearn', label: 'KILearn' },
                  { value: 'normal', label: 'Normal' },
                ]}
                value={mode}
                onChange={(v) => onModeChange(v as StudyMode)}
              />
            </div>

            <div>
              <p className="mb-1.5 px-0.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Kierunek nauki
              </p>
              <SegmentedControl
                options={[
                  { value: 'term-to-definition', label: 'Pojęcie → definicja' },
                  { value: 'definition-to-term', label: 'Definicja → pojęcie' },
                ]}
                value={direction}
                onChange={(v) => onDirectionChange(v as StudyDirection)}
              />
            </div>

            <label className="flex items-center justify-between gap-3 rounded-xl px-0.5 py-1">
              <span className="text-sm text-popover-foreground">Śledzenie postępu</span>
              <ToggleSwitch
                checked={progressTrackingEnabled}
                onCheckedChange={onProgressTrackingChange}
                label="Śledzenie postępu"
              />
            </label>

            <button
              type="button"
              onClick={() => {
                onReset()
                close()
              }}
              className="flex h-10 items-center justify-center gap-2 rounded-xl border border-border text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <RotateCcw className="size-4" />
              Resetuj fiszki
            </button>

            {ownerActions && (
              <>
                <div className="my-1 h-px bg-border" />
                {ownerActions}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function SegmentedControl({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-1 rounded-xl border border-border bg-muted/40 p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'rounded-lg px-2 py-1.5 text-xs font-medium transition-colors',
            value === option.value
              ? 'bg-brand text-brand-foreground shadow-sm'
              : 'text-foreground/70 hover:bg-accent',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
