'use client'

import { useState } from 'react'

export function ToggleSwitch({
  defaultChecked = false,
  checked: controlledChecked,
  onCheckedChange,
  label,
}: {
  defaultChecked?: boolean
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: string
}) {
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked)
  const isControlled = controlledChecked !== undefined
  const checked = isControlled ? controlledChecked : uncontrolledChecked

  function toggle() {
    const next = !checked
    if (!isControlled) setUncontrolledChecked(next)
    onCheckedChange?.(next)
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={toggle}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        checked ? 'bg-primary' : 'bg-muted-foreground/30'
      }`}
    >
      <span
        className={`inline-block size-5 transform rounded-full bg-card shadow-sm transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-1'
        }`}
      />
    </button>
  )
}
