'use client'

import { useState, useEffect, type FormEvent } from 'react'
import { Folder, X } from 'lucide-react'
import { cn } from '@/lib/utils'

// Boczny popup (wysuwany z prawej, nie modal z góry) do tworzenia nowej
// kategorii. Używany zarówno z sidebara, jak i z formularza tworzenia
// zestawu, żeby UI tworzenia kategorii było wszędzie spójne.
export function CategoryPopup({
  open,
  onClose,
  onCreate,
}: {
  open: boolean
  onClose: () => void
  onCreate: (name: string) => void | Promise<void>
}) {
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) setName('')
  }, [open])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed || submitting) return

    setSubmitting(true)
    await onCreate(trimmed)
    setSubmitting(false)
    onClose()
  }

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={cn(
          'fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <aside
        className={cn(
          'fixed top-0 right-0 z-[70] flex h-full w-full max-w-sm flex-col border-l border-panel-border bg-panel text-panel-foreground shadow-2xl transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
        aria-hidden={!open}
        aria-label="Nowa kategoria"
      >
        <div className="flex h-16 items-center justify-between border-b border-panel-border px-5">
          <span className="flex items-center gap-2 text-sm font-semibold">
            <Folder className="size-4.5 text-brand" />
            Nowa kategoria
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Zamknij"
            className="flex size-8 items-center justify-center rounded-full text-panel-muted transition-colors hover:bg-panel-accent hover:text-panel-foreground"
          >
            <X className="size-4.5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 p-5">
          <label className="flex flex-col gap-2">
            <span className="text-xs font-medium text-panel-muted">Nazwa kategorii</span>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="np. Angielski, Biologia..."
              className="h-11 rounded-xl border border-panel-border bg-panel-accent/40 px-3.5 text-sm text-panel-foreground placeholder:text-panel-muted focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            />
          </label>

          <div className="mt-auto flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 items-center rounded-xl px-4 text-sm font-medium text-panel-muted transition-colors hover:bg-panel-accent hover:text-panel-foreground"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={!name.trim() || submitting}
              className="flex h-10 items-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-brand-foreground shadow-sm shadow-brand/30 transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Utwórz kategorię
            </button>
          </div>
        </form>
      </aside>
    </>
  )
}
