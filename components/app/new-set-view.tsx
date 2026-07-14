'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ArrowLeft,
  Check,
  ImagePlus,
  PencilLine,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Row = { term: string; definition: string }

const aiSuggestions: Row[] = [
  { term: 'photosynthesis', definition: 'fotosynteza' },
  { term: 'ecosystem', definition: 'ekosystem' },
  { term: 'cell membrane', definition: 'błona komórkowa' },
  { term: 'nucleus', definition: 'jądro komórkowe' },
  { term: 'chlorophyll', definition: 'chlorofil' },
]

export function NewSetView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialMode = searchParams.get('mode') === 'ai' ? 'ai' : 'manual'
  const [mode, setMode] = useState<'manual' | 'ai'>(initialMode)

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/flashcards"
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-foreground/70 hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Anuluj
      </Link>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Nowy zestaw fiszek
        </h1>
        <p className="mt-1 text-sm text-foreground/70">Wybierz sposób tworzenia fiszek.</p>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border bg-card/70 p-1.5 backdrop-blur-sm sm:max-w-md">
        <ModeTab active={mode === 'manual'} onClick={() => setMode('manual')} icon={<PencilLine className="size-4" />}>
          Dodaj ręcznie
        </ModeTab>
        <ModeTab active={mode === 'ai'} onClick={() => setMode('ai')} icon={<Sparkles className="size-4" />}>
          Generuj z AI
        </ModeTab>
      </div>

      {mode === 'manual' ? <ManualForm onDone={() => router.push('/flashcards')} /> : <AiForm onDone={() => router.push('/flashcards')} />}
    </div>
  )
}

function ModeTab({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
        active ? 'bg-brand text-brand-foreground shadow-sm' : 'text-foreground/70 hover:bg-accent',
      )}
    >
      {icon}
      {children}
    </button>
  )
}

function SetTitleInput() {
  return (
    <input
      placeholder="Nazwa zestawu, np. Angielski — Rozdział 5"
      className="h-12 w-full rounded-2xl border border-border bg-card px-4 text-base font-medium text-card-foreground shadow-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
    />
  )
}

function ManualForm({ onDone }: { onDone: () => void }) {
  const [rows, setRows] = useState<Row[]>([
    { term: '', definition: '' },
    { term: '', definition: '' },
    { term: '', definition: '' },
  ])

  function update(i: number, key: keyof Row, value: string) {
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, [key]: value } : row)))
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onDone()
      }}
      className="flex flex-col gap-4"
    >
      <SetTitleInput />

      <div className="flex flex-col gap-2">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-2 rounded-2xl border border-border bg-card p-3 shadow-sm">
            <span className="w-6 shrink-0 text-center text-sm font-medium text-muted-foreground">
              {i + 1}
            </span>
            <input
              value={row.term}
              onChange={(e) => update(i, 'term', e.target.value)}
              placeholder="Pojęcie / słowo"
              className="h-10 flex-1 rounded-xl border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            />
            <input
              value={row.definition}
              onChange={(e) => update(i, 'definition', e.target.value)}
              placeholder="Definicja / tłumaczenie"
              className="h-10 flex-1 rounded-xl border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            />
            <button
              type="button"
              onClick={() => setRows((r) => (r.length > 1 ? r.filter((_, idx) => idx !== i) : r))}
              aria-label="Usuń fiszkę"
              className="flex size-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setRows((r) => [...r, { term: '', definition: '' }])}
        className="flex h-11 items-center justify-center gap-2 rounded-xl border border-dashed border-border text-sm font-medium text-foreground/70 transition-colors hover:bg-accent"
      >
        <Plus className="size-4" />
        Dodaj fiszkę
      </button>

      <div className="flex justify-end">
        <button
          type="submit"
          className="flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          <Check className="size-4" />
          Zapisz zestaw
        </button>
      </div>
    </form>
  )
}

function AiForm({ onDone }: { onDone: () => void }) {
  const [generated, setGenerated] = useState<Row[] | null>(null)

  return (
    <div className="flex flex-col gap-4">
      <SetTitleInput />

      {!generated ? (
        <>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-border bg-card/70 px-6 py-12 text-center backdrop-blur-sm transition-colors hover:bg-card">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-brand/15 text-brand">
              <ImagePlus className="size-7" />
            </span>
            <span className="text-sm font-medium text-card-foreground">
              Prześlij zdjęcie strony podręcznika
            </span>
            <span className="text-xs text-muted-foreground">
              PNG lub JPG · AI rozpozna słówka i utworzy fiszki
            </span>
            <input type="file" accept="image/*" className="hidden" />
          </label>

          <button
            type="button"
            onClick={() => setGenerated(aiSuggestions)}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-brand-foreground shadow-sm shadow-brand/30 transition-colors hover:bg-brand/90"
          >
            <Sparkles className="size-4" />
            Generuj fiszki z AI
          </button>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 rounded-2xl border border-brand/30 bg-brand/10 p-3 text-sm text-foreground">
            <Sparkles className="size-4 shrink-0 text-brand" />
            AI wygenerowało {generated.length} fiszek. Sprawdź i edytuj przed zapisaniem.
          </div>

          <div className="flex flex-col gap-2">
            {generated.map((row, i) => (
              <div key={i} className="flex items-center gap-2 rounded-2xl border border-border bg-card p-3 shadow-sm">
                <span className="w-6 shrink-0 text-center text-sm font-medium text-muted-foreground">
                  {i + 1}
                </span>
                <input
                  defaultValue={row.term}
                  className="h-10 flex-1 rounded-xl border border-input bg-background px-3 text-sm text-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                />
                <input
                  defaultValue={row.definition}
                  className="h-10 flex-1 rounded-xl border border-input bg-background px-3 text-sm text-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                />
                <button
                  type="button"
                  onClick={() => setGenerated((g) => g?.filter((_, idx) => idx !== i) ?? null)}
                  aria-label="Usuń fiszkę"
                  className="flex size-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setGenerated(null)}
              className="flex h-11 items-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              Wgraj inne zdjęcie
            </button>
            <button
              type="button"
              onClick={onDone}
              className="flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              <Check className="size-4" />
              Zapisz zestaw
            </button>
          </div>
        </>
      )}
    </div>
  )
}
