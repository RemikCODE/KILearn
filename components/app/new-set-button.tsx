'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { ChevronDown, PencilLine, Plus, Sparkles } from 'lucide-react'
import { useOutsideClick } from '@/hooks/use-outside-click'

export function NewSetButton() {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const ref = useOutsideClick<HTMLDivElement>(open, close)

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Plus className="size-4" />
        Nowy zestaw
        <ChevronDown className="size-4 opacity-80" />
      </button>

      {open && (
        <div className="absolute right-0 z-40 mt-2 w-64 origin-top-right overflow-hidden rounded-2xl border border-border bg-popover p-1.5 text-popover-foreground shadow-xl shadow-black/20">
          <Link
            href="/flashcards/new?mode=manual"
            onClick={close}
            className="flex items-start gap-3 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-accent"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <PencilLine className="size-4" />
            </span>
            <span>
              <span className="block text-sm font-medium">Dodaj ręcznie</span>
              <span className="block text-xs text-muted-foreground">Wpisz słówka i tłumaczenia</span>
            </span>
          </Link>
          <Link
            href="/flashcards/new?mode=ai"
            onClick={close}
            className="flex items-start gap-3 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-accent"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand/15 text-brand">
              <Sparkles className="size-4" />
            </span>
            <span>
              <span className="block text-sm font-medium">Generuj z AI</span>
              <span className="block text-xs text-muted-foreground">Ze zdjęcia strony podręcznika</span>
            </span>
          </Link>
        </div>
      )}
    </div>
  )
}
