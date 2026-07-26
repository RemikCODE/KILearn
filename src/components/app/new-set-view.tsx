'use client'

import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ImagePlus,
  PencilLine,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCategories } from '@/hooks/use-categories'
import { useFlashcardSets } from '@/hooks/use-flashcard-sets'
import { CategoryPopup } from '@/components/app/category-popup'
import { useOutsideClick } from '@/hooks/use-outside-click'

type Row = { term: string; definition: string }

const aiSuggestions: Row[] = [
  { term: 'photosynthesis', definition: 'fotosynteza' },
  { term: 'ecosystem', definition: 'ekosystem' },
  { term: 'cell membrane', definition: 'błona komórkowa' },
  { term: 'nucleus', definition: 'jądro komórkowe' },
  { term: 'chlorophyll', definition: 'chlorofil' },
]

export function NewSetView() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialMode = searchParams.get('mode') === 'ai' ? 'ai' : 'manual'
  const [mode, setMode] = useState<'manual' | 'ai'>(initialMode)

  const { categories, createCategory } = useCategories()
  const { createSet } = useFlashcardSets()

  const [title, setTitle] = useState('')
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [categoryPickerOpen, setCategoryPickerOpen] = useState(false)
  const [categoryPopupOpen, setCategoryPopupOpen] = useState(false)

  const selectedCategory = categories.find((c) => c.id === categoryId) ?? null
  const categoryPickerRef = useOutsideClick<HTMLDivElement>(categoryPickerOpen, () =>
    setCategoryPickerOpen(false),
  )

  async function handleSave(rows: Row[]) {
    await createSet({
      title,
      categoryId,
      cards: rows,
    })
    navigate('/flashcards')
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/flashcards"
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

      <div className="flex flex-col gap-4 sm:max-w-md">
        <SetTitleInput value={title} onChange={setTitle} />

        <div className="relative" ref={categoryPickerRef}>
          <button
            type="button"
            onClick={() => setCategoryPickerOpen((o) => !o)}
            className="flex h-11 w-full items-center justify-between rounded-xl border border-border bg-card px-3.5 text-sm text-card-foreground shadow-sm transition-colors hover:bg-accent"
          >
            <span className={selectedCategory ? 'text-card-foreground' : 'text-muted-foreground'}>
              {selectedCategory ? selectedCategory.name : 'Bez kategorii'}
            </span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </button>

          {categoryPickerOpen && (
            <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-popover p-1.5 text-popover-foreground shadow-xl shadow-black/20">
              <button
                type="button"
                onClick={() => {
                  setCategoryId(null)
                  setCategoryPickerOpen(false)
                }}
                className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm hover:bg-accent"
              >
                Bez kategorii
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    setCategoryId(category.id)
                    setCategoryPickerOpen(false)
                  }}
                  className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm hover:bg-accent"
                >
                  {category.name}
                </button>
              ))}
              <div className="my-1 h-px bg-border" />
              <button
                type="button"
                onClick={() => {
                  setCategoryPickerOpen(false)
                  setCategoryPopupOpen(true)
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-brand hover:bg-accent"
              >
                <Plus className="size-4" />
                Utwórz nową kategorię
              </button>
            </div>
          )}
        </div>
      </div>

      {mode === 'manual' ? (
        <ManualForm onSave={handleSave} />
      ) : (
        <AiForm onSave={handleSave} />
      )}

      <CategoryPopup
        open={categoryPopupOpen}
        onClose={() => setCategoryPopupOpen(false)}
        onCreate={async (name) => {
          const created = await createCategory(name)
          setCategoryId(created.id)
        }}
      />
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

function SetTitleInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Nazwa zestawu, np. Angielski — Rozdział 5"
      className="h-12 w-full rounded-2xl border border-border bg-card px-4 text-base font-medium text-card-foreground shadow-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
    />
  )
}

function ManualForm({ onSave }: { onSave: (rows: Row[]) => void }) {
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
        onSave(rows)
      }}
      className="flex flex-col gap-4"
    >
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

function AiForm({ onSave }: { onSave: (rows: Row[]) => void }) {
  const [generated, setGenerated] = useState<Row[] | null>(null)

  return (
    <div className="flex flex-col gap-4">
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
                  onChange={(e) =>
                    setGenerated((g) => g?.map((r, idx) => (idx === i ? { ...r, term: e.target.value } : r)) ?? null)
                  }
                  className="h-10 flex-1 rounded-xl border border-input bg-background px-3 text-sm text-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                />
                <input
                  defaultValue={row.definition}
                  onChange={(e) =>
                    setGenerated((g) => g?.map((r, idx) => (idx === i ? { ...r, definition: e.target.value } : r)) ?? null)
                  }
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
              onClick={() => onSave(generated)}
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
