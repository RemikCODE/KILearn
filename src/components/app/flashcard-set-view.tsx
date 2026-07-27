'use client'

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Check,
  Clock,
  Copy,
  Folder,
  Layers,
  PencilLine,
  PlayCircle,
  RotateCcw,
  Trash2,
  X,
} from 'lucide-react'
import type { FlashcardSet } from '@/lib/types'
import { CURRENT_USER_ID, useFlashcardSets } from '@/hooks/use-flashcard-sets'
import { useCategories } from '@/hooks/use-categories'
import { useStudyProgress } from '@/hooks/use-study-progress'
import { StudySettingsMenu } from '@/components/app/study-settings-menu'
import { cn } from '@/lib/utils'

export function FlashcardSetView({ set }: { set: FlashcardSet }) {
  const [studying, setStudying] = useState(false)
  const navigate = useNavigate()
  const { markStudied, copySet, deleteSet, moveToCategory } = useFlashcardSets()
  const { categories } = useCategories()
  const isOwner = set.ownerId === CURRENT_USER_ID

  const cardIds = set.cards.map((c) => c.id)
  const progress = useStudyProgress(set.id, cardIds)

  function startStudying() {
    setStudying(true)
    markStudied(set.id)
  }

  function handleDelete() {
    if (!confirm(`Usunąć zestaw "${set.title}"? Tej operacji nie można cofnąć.`)) return
    deleteSet(set.id)
    navigate('/flashcards')
  }

  const ownerActions = isOwner ? (
    <>
      <Link
        to={`/flashcards/${set.id}/edit`}
        className="flex h-10 items-center gap-2 rounded-xl px-2.5 text-sm text-popover-foreground transition-colors hover:bg-accent"
      >
        <PencilLine className="size-4" />
        Edytuj zestaw
      </Link>

      <MoveToCategoryList
        categories={categories}
        currentCategoryId={set.categoryId}
        onSelect={(categoryId) => moveToCategory(set.id, categoryId)}
      />

      <button
        type="button"
        onClick={handleDelete}
        className="flex h-10 items-center gap-2 rounded-xl px-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
      >
        <Trash2 className="size-4" />
        Usuń zestaw
      </button>
    </>
  ) : undefined

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
              {set.description && (
                <p className="mt-1 text-sm text-muted-foreground text-pretty">{set.description}</p>
              )}
              <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                <span>{set.cards.length} fiszek</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  {set.lastStudiedAt ? new Date(set.lastStudiedAt).toLocaleDateString('pl-PL') : 'Jeszcze nie uczono się'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isOwner && (
              <button
                type="button"
                onClick={() => copySet(set)}
                className="flex h-11 items-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                <Copy className="size-4" />
                Kopiuj i nadpisz
              </button>
            )}

            <StudySettingsMenu
              mode={progress.mode}
              onModeChange={progress.setMode}
              direction={progress.direction}
              onDirectionChange={progress.setDirection}
              progressTrackingEnabled={progress.progressTrackingEnabled}
              onProgressTrackingChange={progress.setProgressTrackingEnabled}
              onReset={progress.reset}
              ownerActions={ownerActions}
            />

            <button
              type="button"
              onClick={startStudying}
              disabled={set.cards.length === 0}
              className="flex h-11 items-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-brand-foreground shadow-sm shadow-brand/30 transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <PlayCircle className="size-5" />
              Rozpocznij naukę
            </button>
          </div>
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

function MoveToCategoryList({
  categories,
  currentCategoryId,
  onSelect,
}: {
  categories: { id: string; name: string }[]
  currentCategoryId: string | null
  onSelect: (categoryId: string | null) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 w-full items-center gap-2 rounded-xl px-2.5 text-sm text-popover-foreground transition-colors hover:bg-accent"
      >
        <Folder className="size-4" />
        Przenieś do kategorii
      </button>
      {open && (
        <div className="mt-1 flex flex-col gap-0.5 rounded-xl bg-muted/40 p-1">
          <button
            type="button"
            onClick={() => {
              onSelect(null)
              setOpen(false)
            }}
            className={cn(
              'rounded-lg px-2.5 py-1.5 text-left text-xs',
              !currentCategoryId ? 'bg-brand/15 text-brand' : 'hover:bg-accent',
            )}
          >
            Bez kategorii
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                onSelect(c.id)
                setOpen(false)
              }}
              className={cn(
                'rounded-lg px-2.5 py-1.5 text-left text-xs',
                currentCategoryId === c.id ? 'bg-brand/15 text-brand' : 'hover:bg-accent',
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function StudySession({ set, onClose }: { set: FlashcardSet; onClose: () => void }) {
  const cardIds = set.cards.map((c) => c.id)
  const progress = useStudyProgress(set.id, cardIds)
  const cardsById = new Map(set.cards.map((c) => [c.id, c]))

  // Nauka bez śledzenia postępu: prosta, liniowa nawigacja lokalna,
  // bez zapamiętywania i bez powtórki błędnych (jak dawniej).
  const [freeIndex, setFreeIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [revealed, setRevealed] = useState(false) // KILearn: czy pokazano odpowiedź po "Zatwierdź"

  // Liczniki bieżącej sesji ("Umiem" / "Powtórzę") — czysto informacyjne,
  // nieprzechowywane między sesjami, tylko żeby widzieć postęp na żywo.
  const [correctCount, setCorrectCount] = useState(0)
  const [wrongCount, setWrongCount] = useState(0)

  const total = set.cards.length
  const trackingOn = progress.progressTrackingEnabled

  const activeIds = trackingOn ? progress.activeCardIds : cardIds
  const activeIndex = trackingOn ? progress.currentIndex : freeIndex
  const currentCard = activeIds.length > 0 ? cardsById.get(activeIds[activeIndex]) : undefined

  const showTermFirst = progress.direction === 'term-to-definition'
  const front = currentCard ? (showTermFirst ? currentCard.term : currentCard.definition) : ''
  const back = currentCard ? (showTermFirst ? currentCard.definition : currentCard.term) : ''

  function goFree(delta: number) {
    const next = freeIndex + delta
    if (next < 0 || next >= total) return // blokada: nie da się wyjść poza pierwszą/ostatnią fiszkę
    setFlipped(false)
    setFreeIndex(next)
  }

  function markAndAdvance(result: 'correct' | 'wrong') {
    if (!currentCard) return
    if (result === 'correct') setCorrectCount((n) => n + 1)
    else setWrongCount((n) => n + 1)
    progress.markResult(currentCard.id, result)
    progress.advance()
    setFlipped(false)
    setRevealed(false)
  }

  const isCompleted = trackingOn && progress.isCompleted

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between border-b border-border px-4 sm:px-6">
        <span className="text-sm font-medium text-foreground">{set.title}</span>

        <div className="flex items-center gap-4">
          {trackingOn && (correctCount > 0 || wrongCount > 0) && (
            <span className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1 text-brand">
                <Check className="size-3.5" />
                {correctCount}
              </span>
              <span className="flex items-center gap-1 text-destructive">
                <X className="size-3.5" />
                {wrongCount}
              </span>
            </span>
          )}
          {!isCompleted && (
            <span className="text-sm text-muted-foreground">
              {activeIndex + 1} / {activeIds.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <StudySettingsMenu
            mode={progress.mode}
            onModeChange={progress.setMode}
            direction={progress.direction}
            onDirectionChange={progress.setDirection}
            progressTrackingEnabled={progress.progressTrackingEnabled}
            onProgressTrackingChange={progress.setProgressTrackingEnabled}
            onReset={() => {
              progress.reset()
              setFreeIndex(0)
              setFlipped(false)
              setRevealed(false)
              setCorrectCount(0)
              setWrongCount(0)
            }}
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Zakończ naukę"
            className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-6 px-4 py-8">
        {isCompleted ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="flex size-16 items-center justify-center rounded-3xl bg-brand/15 text-brand">
              <Check className="size-8" />
            </span>
            <h2 className="text-xl font-semibold text-foreground">Ukończyłeś zestaw!</h2>
            <p className="text-sm text-muted-foreground">
              Umiałeś {correctCount} z {correctCount + wrongCount > 0 ? correctCount + wrongCount : total} fiszek za pierwszym razem.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 flex h-11 items-center gap-2 rounded-xl bg-brand px-6 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-brand/90"
            >
              Zakończ
            </button>
          </div>
        ) : !currentCard ? null : progress.mode === 'normal' ? (
          <>
            <button
              type="button"
              onClick={() => setFlipped((f) => !f)}
              className="group relative flex min-h-64 w-full items-center justify-center rounded-3xl border border-border bg-card p-8 text-center shadow-lg transition-transform hover:-translate-y-0.5"
            >
              <span className="absolute top-4 left-4 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <RotateCcw className="size-3.5" />
                {flipped ? (showTermFirst ? 'Definicja' : 'Pojęcie') : showTermFirst ? 'Pojęcie' : 'Definicja'}
              </span>
              <span className="text-2xl font-semibold text-card-foreground text-balance">
                {flipped ? back : front}
              </span>
              <span className="absolute bottom-4 text-xs text-muted-foreground">
                Kliknij, aby {flipped ? 'ukryć' : 'pokazać'} odpowiedź
              </span>
            </button>

            <SessionControls
              trackingOn={trackingOn}
              canGoBack={activeIndex > 0}
              canGoForward={activeIndex < activeIds.length - 1}
              onBack={() => goFree(-1)}
              onForward={() => goFree(1)}
              onWrong={() => markAndAdvance('wrong')}
              onCorrect={() => markAndAdvance('correct')}
            />
          </>
        ) : (
          <>
            <div className="flex min-h-64 w-full flex-col items-center justify-center gap-4 rounded-3xl border border-border bg-card p-8 text-center shadow-lg">
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <PencilLine className="size-3.5" />
                Napisz: {showTermFirst ? 'definicję' : 'pojęcie'}
              </span>
              <span className="text-xl font-semibold text-card-foreground text-balance">{front}</span>

              {/* Placeholder canvasu do rozpoznawania pisma odręcznego — bez logiki rozpoznawania na tym etapie. */}
              <div className="mt-2 flex h-40 w-full max-w-sm items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 text-xs text-muted-foreground">
                Canvas do pisania (wkrótce)
              </div>

              {revealed ? (
                <p className="text-sm text-muted-foreground">
                  Poprawna odpowiedź: <span className="font-semibold text-card-foreground">{back}</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => setRevealed(true)}
                  className="flex h-10 items-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-brand/90"
                >
                  <Check className="size-4" />
                  Zatwierdź
                </button>
              )}
            </div>

            {revealed && (
              <SessionControls
                trackingOn={trackingOn}
                canGoBack={activeIndex > 0}
                canGoForward={activeIndex < activeIds.length - 1}
                onBack={() => {
                  goFree(-1)
                  setRevealed(false)
                }}
                onForward={() => {
                  goFree(1)
                  setRevealed(false)
                }}
                onWrong={() => markAndAdvance('wrong')}
                onCorrect={() => markAndAdvance('correct')}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

function SessionControls({
  trackingOn,
  canGoBack,
  canGoForward,
  onBack,
  onForward,
  onWrong,
  onCorrect,
}: {
  trackingOn: boolean
  canGoBack: boolean
  canGoForward: boolean
  onBack: () => void
  onForward: () => void
  onWrong: () => void
  onCorrect: () => void
}) {
  // Gdy śledzenie postępu jest włączone, sesja jest jednokierunkowa: użytkownik
  // ocenia każdą fiszkę ("Powtórzę" / "Umiem"), co decyduje czy wróci ona w
  // powtórce na końcu zestawu. Bez śledzenia postępu to zwykła, swobodna
  // nawigacja przód/tył, bez oceniania.
  if (trackingOn) {
    return (
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={onWrong}
          className="flex h-12 items-center gap-2 rounded-full border border-destructive/40 bg-destructive/10 px-6 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/20"
        >
          Powtórzę
        </button>
        <button
          type="button"
          onClick={onCorrect}
          className="flex h-12 items-center gap-2 rounded-full bg-brand px-8 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-brand/90"
        >
          <Check className="size-4" />
          Umiem
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center gap-3">
      <button
        type="button"
        onClick={onBack}
        disabled={!canGoBack}
        className="flex size-12 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Poprzednia fiszka"
      >
        <ArrowLeft className="size-5" />
      </button>
      <button
        type="button"
        onClick={onForward}
        disabled={!canGoForward}
        className="flex h-12 items-center gap-2 rounded-full bg-brand px-8 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Następna
      </button>
    </div>
  )
}
