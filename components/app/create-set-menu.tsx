'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { Plus, PencilLine, Sparkles } from 'lucide-react'
import { useOutsideClick } from '@/hooks/use-outside-click'

export function CreateSetMenu() {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const ref = useOutsideClick<HTMLDivElement>(open, close)

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Utwórz nowy zestaw fiszek"
        aria-expanded={open}
        className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-105 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Plus className="size-5" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-64 origin-top-right overflow-hidden rounded-2xl border border-border bg-popover p-1.5 text-popover-foreground shadow-xl shadow-black/20">
          <p className="px-2.5 py-1.5 text-xs font-medium text-muted-foreground">Nowy zestaw fiszek</p>
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
              <span className="block text-sm font-medium">Generuj z AI ze zdjęcia</span>
              <span className="block text-xs text-muted-foreground">Zrób zdjęcie strony podręcznika</span>
            </span>
          </Link>
        </div>
      )}
    </div>
  )
}
