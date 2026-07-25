'use client'

import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  Layers,
  PlayCircle,
  RotateCcw,
  X,
} from 'lucide-react'
import type { FlashcardSet } from '@/lib/mock-data'

export function FlashcardSetView({ set }: { set: FlashcardSet }) {
  const [studying, setStudying] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/flashcards"
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-foreground/70 hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Wszystkie zestawy
      </Link>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand/15 text-brand">
              <Layers className="size-6" />
            </span>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-card-foreground text-balance">
                {set.title}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground text-pretty">{set.description}</p>
              <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                <span>{set.cardCount} fiszek</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  {set.lastStudied}
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setStudying(true)}
            className="flex h-11 items-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-brand-foreground shadow-sm shadow-brand/30 transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <PlayCircle className="size-5" />
            Rozpocznij naukę
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-foreground/80">Fiszki w zestawie</h2>
        {set.cards.map((card, i) => (
          <div
            key={card.id}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card/80 p-4 backdrop-blur-sm"
          >
            <span className="w-6 shrink-0 text-sm font-medium text-muted-foreground">{i + 1}</span>
            <span className="flex-1 font-medium text-card-foreground">{card.term}</span>
            <span className="hidden h-8 w-px bg-border sm:block" />
            <span className="flex-1 text-sm text-muted-foreground">{card.definition}</span>
          </div>
        ))}
      </div>

      {studying && <StudySession set={set} onClose={() => setStudying(false)} />}
    </div>
  )
}

function StudySession({ set, onClose }: { set: FlashcardSet; onClose: () => void }) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const card = set.cards[index]
  const total = set.cards.length

  function go(delta: number) {
    var t = index + delta
    if (t < 0 || t >= total) {
      return
    }

    setFlipped(false)
    setIndex((i) => (i + delta + total) % total)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between border-b border-border px-4 sm:px-6">
        <span className="text-sm font-medium text-foreground">{set.title}</span>
        <span className="text-sm text-muted-foreground">
          {index + 1} / {total}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Zakończ naukę"
          className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-6 px-4 py-8">
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          className="group relative flex min-h-64 w-full items-center justify-center rounded-3xl border border-border bg-card p-8 text-center shadow-lg transition-transform hover:-translate-y-0.5"
        >
          <span className="absolute top-4 left-4 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <RotateCcw className="size-3.5" />
            {flipped ? 'Definicja' : 'Pojęcie'}
          </span>
          <span className="text-2xl font-semibold text-card-foreground text-balance">
            {flipped ? card.definition : card.term}
          </span>
          <span className="absolute bottom-4 text-xs text-muted-foreground">
            Kliknij, aby {flipped ? 'ukryć' : 'pokazać'} odpowiedź
          </span>
        </button>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            className="flex size-12 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted"
            aria-label="Poprzednia fiszka"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="flex h-12 items-center gap-2 rounded-full bg-brand px-8 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-brand/90"
          >
            Następna
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
