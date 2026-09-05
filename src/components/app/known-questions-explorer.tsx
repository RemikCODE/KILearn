'use client'

import { useState, type FormEvent } from 'react'
import { BookOpen, Folder, FolderPlus, X } from 'lucide-react'
import type { Lecture } from '@/lib/types'
import { cn } from '@/lib/utils'

type KnownQuestionsExplorerProps = {
  open: boolean
  lectures: Lecture[]
  selectedLectureId: string | null
  onClose: () => void
  onSelect: (lectureId: string) => void
  onCreateLecture: (name: string) => Promise<Lecture>
  onDeleteLecture: (id: string) => Promise<void>
}

export function KnownQuestionsExplorer({
  open,
  lectures,
  selectedLectureId,
  onClose,
  onSelect,
  onCreateLecture,
  onDeleteLecture,
}: KnownQuestionsExplorerProps) {
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [creating, setCreating] = useState(false)

  function reset() {
    setAdding(false)
    setName('')
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed || creating) return
    setCreating(true)
    await onCreateLecture(trimmed)
    setCreating(false)
    reset()
  }

  function handleConfirm(lectureId: string) {
    onSelect(lectureId)
    onClose()
  }

  return (
    <>
      <div
        onClick={() => {
          reset()
          onClose()
        }}
        aria-hidden="true"
        className={cn(
          'fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-200',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Eksplorator lektur"
        className={cn(
          'fixed top-1/2 left-1/2 z-[70] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-panel-border bg-panel p-5 text-panel-foreground shadow-2xl transition-all duration-200',
          open
            ? 'scale-100 opacity-100'
            : 'pointer-events-none scale-95 opacity-0',
        )}
      >
        <div className="flex items-center justify-between pb-3">
          <span className="flex items-center gap-2 text-sm font-semibold">
            <BookOpen className="size-4.5 text-brand" />
            Wybierz lekturę
          </span>
          <button
            type="button"
            onClick={() => {
              reset()
              onClose()
            }}
            aria-label="Zamknij"
            className="flex size-8 items-center justify-center rounded-full text-panel-muted transition-colors hover:bg-panel-accent hover:text-panel-foreground"
          >
            <X className="size-4.5" />
          </button>
        </div>

        <div className="max-h-72 overflow-y-auto rounded-2xl border border-panel-border bg-panel-accent/30 p-1.5">
          {lectures.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-panel-muted">
              Brak lektur. Dodaj pierwszą, żeby zacząć.
            </p>
          ) : (
            <ul className="flex flex-col gap-0.5">
              {lectures.map((lecture) => (
                <li key={lecture.id}>
                  <button
                    type="button"
                    onClick={() => handleConfirm(lecture.id)}
                    className={cn(
                      'group flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition-colors',
                      selectedLectureId === lecture.id
                        ? 'bg-brand/15 text-brand'
                        : 'hover:bg-panel-accent hover:text-panel-foreground',
                    )}
                  >
                    <Folder className="size-4 shrink-0 text-brand" />
                    <span className="flex-1 truncate font-medium">{lecture.name}</span>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (confirm(`Usunąć lekturę "${lecture.name}" wraz z pytaniami?`)) {
                          onDeleteLecture(lecture.id)
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.stopPropagation()
                          onDeleteLecture(lecture.id)
                        }
                      }}
                      title="Usuń lekturę"
                      className="flex size-6 items-center justify-center rounded-md text-xs text-panel-muted opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                    >
                      <X className="size-3.5" />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-4">
          {adding ? (
            <form onSubmit={handleCreate} className="flex flex-col gap-2">
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="np. Pan Tadeusz, Lalka..."
                className="h-10 w-full rounded-xl border border-panel-border bg-panel-accent/40 px-3.5 text-sm text-panel-foreground placeholder:text-panel-muted focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={reset}
                  className="flex h-9 items-center rounded-xl px-3.5 text-sm font-medium text-panel-muted transition-colors hover:bg-panel-accent hover:text-panel-foreground"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  disabled={!name.trim() || creating}
                  className="flex h-9 items-center gap-1.5 rounded-xl bg-brand px-4 text-sm font-semibold text-brand-foreground shadow-sm shadow-brand/30 transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FolderPlus className="size-4" />
                  Dodaj
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-panel-border text-sm font-medium text-panel-muted transition-colors hover:border-ring hover:bg-panel-accent hover:text-panel-foreground"
            >
              <FolderPlus className="size-4" />
              Dodaj lekturę
            </button>
          )}
        </div>
      </div>
    </>
  )
}
