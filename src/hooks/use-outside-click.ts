'use client'

import { useEffect, useRef } from 'react'

// Calls `handler` when a pointerdown or Escape happens outside the returned ref.
export function useOutsideClick<T extends HTMLElement>(active: boolean, handler: () => void) {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (!active) return

    function onPointerDown(event: PointerEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler()
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') handler()
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [active, handler])

  return ref
}
