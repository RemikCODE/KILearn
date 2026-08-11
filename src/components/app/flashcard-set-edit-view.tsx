'use client'

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Check,
  Layers,
  PencilLine,
  Plus,
  Trash2,
  X,
} from 'lucide-react'
import type { FlashcardSet } from '@/lib/types'
import { useFlashcardSets } from '@/hooks/use-flashcard-sets'

type EditableCard = { id: string; term: string; definition: string }

export function FlashcardSetEditView({ set }: { set: FlashcardSet }) {
  const navigate = useNavigate()
  const { updateSet } = useFlashcardSets()

  const [title, setTitle] = useState(set.title)
  const [description, setDescription] = useState(set.description)
  const [cards, setCards] = useState<EditableCard[]>(
    set.cards.map((c) => ({ id: c.id, term: c.term, definition: c.definition })),
  )
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  function updateCard(id: string, key: 'term' | 'definition', value: string) {
    setCards((cs) => cs.map((c) => (c.id === id ? { ...c, [key]: value } : c)))
  }

  function removeCard(id: string) {
    setCards((cs) => cs.filter((c) => c.id !== id))
    if (editingId === id) setEditingId(null)
  }

  function addCard() {
    const id = `new-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    setCards((cs) => [...cs, { id, term: '', definition: '' }])
    setEditingId(id)
  }

  async function handleSave() {
    setSaving(true)
    try {
      await updateSet(set.id, {
        title: title.trim() || 'Bez nazwy',
        description: description.trim(),
        cards: cards
          .filter((c) => c.term.trim() !== '' || c.definition.trim() !== '')
          .map((c) => ({ id: c.id, term: c.term.trim(), definition: c.definition.trim() })),
      })
      navigate(`/flashcards/${set.id}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        to={`/flashcards/${set.id}`}
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-foreground/70 hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Anuluj
      </Link>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand/15 text-brand">
            <Layers className="size-6" />
          </span>
          <div className="flex flex-1 flex-col gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground" htmlFor="set-title">
                Nazwa zestawu
              </label>
              <input
                id="set-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nazwa zestawu"
                className="h-11 w-full max-w-md rounded-xl border border-border bg-card px-3.5 text-base font-semibold text-card-foreground shadow-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground" htmlFor="set-description">
                Opis (opcjonalnie)
              </label>
              <input
                id="set-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Krótki opis zestawu"
                className="h-10 w-full max-w-md rounded-xl border border-border bg-card px-3.5 text-sm text-card-foreground shadow-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-foreground/80">Fiszki w zestawie</h2>

        {cards.length === 0 ? (
          <p className="rounded-2xl border border-border bg-card/80 p-4 text-sm text-muted-foreground">
            Brak fiszek. Dodaj pierwszą poniżej.
          </p>
        ) : (
          cards.map((card, i) => {
            const isEditing = editingId === card.id
            return (
              <div
                key={card.id}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card/80 p-4 backdrop-blur-sm"
              >
                <span className="w-6 shrink-0 text-sm font-medium text-muted-foreground">{i + 1}</span>

                {isEditing ? (
                  <>
                    <input
                      autoFocus
                      value={card.term}
                      onChange={(e) => updateCard(card.id, 'term', e.target.value)}
                      placeholder="Pojęcie / słowo"
                      className="h-10 flex-1 rounded-xl border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                    />
                    <span className="hidden h-8 w-px bg-border sm:block" />
                    <input
                      value={card.definition}
                      onChange={(e) => updateCard(card.id, 'definition', e.target.value)}
                      placeholder="Definicja / tłumaczenie"
                      className="h-10 flex-1 rounded-xl border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                    />
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      aria-label="Zakończ edycję fiszki"
                      className="flex size-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <Check className="size-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 font-medium text-card-foreground">
                      {card.term || <span className="text-muted-foreground">(puste pojęcie)</span>}
                    </span>
                    <span className="hidden h-8 w-px bg-border sm:block" />
                    <span className="flex-1 text-sm text-muted-foreground">
                      {card.definition || '(pusta definicja)'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditingId(card.id)}
                      aria-label="Edytuj fiszkę"
                      title="Edytuj fiszkę"
                      className="flex size-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-accent hover:text-brand"
                    >
                      <PencilLine className="size-4" />
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => removeCard(card.id)}
                  aria-label="Usuń fiszkę"
                  className="flex size-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            )
          })
        )}

        <button
          type="button"
          onClick={addCard}
          className="flex h-11 items-center justify-center gap-2 rounded-xl border border-dashed border-border text-sm font-medium text-foreground/70 transition-colors hover:bg-accent"
        >
          <Plus className="size-4" />
          Dodaj fiszkę
        </button>
      </div>

      <div className="flex justify-end gap-2">
        <Link
          to={`/flashcards/${set.id}`}
          className="flex h-11 items-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          <X className="size-4" />
          Anuluj
        </Link>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Check className="size-4" />
          Zapisz zmiany
        </button>
      </div>
    </div>
  )
}
