'use client'

import { useMemo, useRef, useState } from 'react'
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
  Search,
  Shuffle,
  Trash2,
  Undo2,
  X,
} from 'lucide-react'
import type { FlashcardSet } from '@/lib/types'
import { CURRENT_USER_ID, useFlashcardSets } from '@/hooks/use-flashcard-sets'
import { useCategories } from '@/hooks/use-categories'
import { useStudyProgress } from '@/hooks/use-study-progress'
import { StudySettingsMenu } from '@/components/app/study-settings-menu'
import { cn } from '@/lib/utils'
import CanvasDoPisania from '@/components/ui/CanvasDoPisania'

export function FlashcardSetView({ set }: { set: FlashcardSet }) {
  const [studying, setStudying] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
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

  const filteredCards = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return set.cards
    return set.cards.filter(
      (c) => c.term.toLowerCase().includes(q) || c.definition.toLowerCase().includes(q),
    )
  }, [set.cards, searchQuery])

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
        <label className="text-sm font-semibold text-foreground/80" htmlFor="card-search">
          Wyszukaj pojęcie
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="card-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Szukaj po pojęciu lub definicji..."
            className="h-10 w-full rounded-xl border border-border bg-card pl-10 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 [&::-webkit-search-cancel-button]:appearance-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Wyczyść wyszukiwanie"
              className="absolute top-1/2 right-3 flex size-5 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
        <h2 className="mt-1 text-sm font-semibold text-foreground/80">Fiszki w zestawie</h2>
        {filteredCards.length === 0 ? (
          <p className="rounded-2xl border border-border bg-card/80 p-4 text-sm text-muted-foreground">
            Brak fiszek pasujących do wyszukiwania.
          </p>
        ) : (
          filteredCards.map((card, i) => (
            <div
              key={card.id}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card/80 p-4 backdrop-blur-sm"
            >
              <span className="w-6 shrink-0 text-sm font-medium text-muted-foreground">{i + 1}</span>
              <span className="flex-1 font-medium text-card-foreground">{card.term}</span>
              <span className="hidden h-8 w-px bg-border sm:block" />
              <span className="flex-1 text-sm text-muted-foreground">{card.definition}</span>
            </div>
          ))
        )}
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

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function StudySession({ set, onClose }: { set: FlashcardSet; onClose: () => void }) {
  const cardIds = set.cards.map((c) => c.id)
  const [cardOrder, setCardOrder] = useState(() => [...cardIds])
  const [randomOrderEnabled, setRandomOrderEnabled] = useState(false)
  const progress = useStudyProgress(set.id, cardOrder)
  const cardsById = new Map(set.cards.map((c) => [c.id, c]))

  const [freeIndex, setFreeIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [revealed, setRevealed] = useState(false)

  const [correctCount, setCorrectCount] = useState(0)
  const [wrongCount, setWrongCount] = useState(0)
  const countsUndoRef = useRef<Array<{ correct: number; wrong: number }>>([])
  const countsRef = useRef({ correct: 0, wrong: 0 })
  countsRef.current = { correct: correctCount, wrong: wrongCount }

  const total = cardOrder.length
  const trackingOn = progress.progressTrackingEnabled

  const activeIds = trackingOn ? progress.activeCardIds : cardOrder
  const activeIndex = trackingOn ? progress.currentIndex : freeIndex
  const currentCard = activeIds.length > 0 ? cardsById.get(activeIds[activeIndex]) : undefined

  const showTermFirst = progress.direction === 'term-to-definition'
  const front = currentCard ? (showTermFirst ? currentCard.term : currentCard.definition) : ''
  const back = currentCard ? (showTermFirst ? currentCard.definition : currentCard.term) : ''

  function handleShuffle() {
    if (randomOrderEnabled) {
      setRandomOrderEnabled(false)
      setCardOrder([...cardIds])
    } else {
      setRandomOrderEnabled(true)

      if (cardIds.length <= 1) {
        setCardOrder(cardIds);
      } else {
        const aktulaneid = activeIds[activeIndex]
        let shuffled = shuffleArray(cardIds)

        while (shuffled[0] === aktulaneid) {
          shuffled = shuffleArray(cardIds)
        }

        setCardOrder(shuffled)
      }
    }
    setFreeIndex(0)
    progress.reset()
    setFlipped(false)
    setRevealed(false)
    setCorrectCount(0)
    setWrongCount(0)
    countsUndoRef.current = []
  }

  function goFree(delta: number) {
    const next = freeIndex + delta
    if (next < 0 || next >= total) return
    setFlipped(false)
    setFreeIndex(next)
  }

  function markAndAdvance(result: 'correct' | 'wrong') {
    if (!currentCard) return

    if (trackingOn) {
      progress.saveUndoPoint()
      countsUndoRef.current.push({ ...countsRef.current })
    }

    if (progress.markStatus(currentCard.id) === 'wrong' && result === 'correct') {
      progress.markResult(currentCard.id, result)
      setCorrectCount((n) => n + 1)
      setWrongCount((n) => n - 1)

      progress.advance()
      setFlipped(false)
      setRevealed(false)
      return
    }

    if (result === 'correct') setCorrectCount((n) => n + 1)
    else setWrongCount((n) => n + 1)
    progress.markResult(currentCard.id, result)
    progress.advance()
    setFlipped(false)
    setRevealed(false)
  }

  function handleUndo() {
    if (!progress.undo()) return
    const prevCounts = countsUndoRef.current.pop()
    if (prevCounts) {
      setCorrectCount(prevCounts.correct)
      setWrongCount(prevCounts.wrong)
    }
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
              <span className="flex items-center gap-1 text-positive">
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
              setCardOrder([...cardIds])
              setRandomOrderEnabled(false)
              setFreeIndex(0)
              setFlipped(false)
              setRevealed(false)
              setCorrectCount(0)
              setWrongCount(0)
              countsUndoRef.current = []
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

      <div className="mx-auto flex w-full max-w-4xl flex-1 items-center gap-3 px-4 py-8 sm:gap-4">
        <StudyMiniPanel active={randomOrderEnabled} onShuffle={handleShuffle} />

        <div className="flex min-w-0 flex-1 flex-col justify-center gap-6">
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
              <FlipCard
                flipped={flipped}
                front={front}
                back={back}
                frontLabel={showTermFirst ? 'Pojęcie' : 'Definicja'}
                backLabel={showTermFirst ? 'Definicja' : 'Pojęcie'}
                onFlip={() => setFlipped((f) => !f)}
              />

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


                <CanvasDoPisania text={front} />

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

        <StudySidePanel
          showUndo={trackingOn && !isCompleted}
          canUndo={progress.canUndo}
          onUndo={handleUndo}
        />
      </div>
    </div>
  )
}

function StudyMiniPanel({ active, onShuffle }: { active: boolean; onShuffle: () => void }) {
  return (
    <aside className="flex w-11 shrink-0 flex-col items-center gap-2 rounded-2xl border border-border bg-card/80 p-2 shadow-sm">
      <button
        type="button"
        onClick={onShuffle}
        aria-label="Losuj kolejność fiszek"
        aria-pressed={active}
        title={active ? 'Wyłącz losową kolejność' : 'Włącz losową kolejność'}
        className={cn(
          'flex size-9 items-center justify-center rounded-xl transition-colors',
          active
            ? 'text-brand'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        )}
      >
        <Shuffle className="size-4" />
      </button>
    </aside>
  )
}

function StudySidePanel({
  showUndo,
  canUndo,
  onUndo,
}: {
  showUndo: boolean
  canUndo: boolean
  onUndo: () => void
}) {
  return (
    <aside className="flex w-11 shrink-0 flex-col items-center gap-2 rounded-2xl border border-border bg-card/80 p-2 shadow-sm">
      {showUndo && (
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          aria-label="Cofnij ostatnią ocenę"
          title="Cofnij"
          className="flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Undo2 className="size-4" />
        </button>
      )}
    </aside>
  )
}

function FlipCard({
  flipped,
  front,
  back,
  frontLabel,
  backLabel,
  onFlip,
}: {
  flipped: boolean
  front: string
  back: string
  frontLabel: string
  backLabel: string
  onFlip: () => void
}) {
  return (
    <button
      type="button"
      onClick={onFlip}
      className="group w-full [perspective:1000px]"
    >
      <div
        className={cn(
          'relative min-h-64 w-full transition-transform duration-500 [transform-style:preserve-3d]',
          flipped && '[transform:rotateY(180deg)]',
        )}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-border bg-card p-8 text-center shadow-lg [backface-visibility:hidden]">
          <span className="absolute top-4 left-4 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <RotateCcw className="size-3.5" />
            {frontLabel}
          </span>
          <span className="text-2xl font-semibold text-card-foreground text-balance">{front}</span>

          <span className="absolute bottom-4 text-xs text-muted-foreground">Kliknij, aby pokazać odpowiedź</span>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-border bg-card p-8 text-center shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <span className="absolute top-4 left-4 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <RotateCcw className="size-3.5" />
            {backLabel}
          </span>
          <span className="text-2xl font-semibold text-card-foreground text-balance">{back}</span>
          <span className="absolute bottom-4 text-xs text-muted-foreground">Kliknij, aby ukryć odpowiedź</span>
        </div>
      </div>
    </button>
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
          className="flex h-12 items-center gap-2 rounded-full bg-brand px-8 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-brand/90 border border-positive"
        >
          <Check className="size-4 text-positive" />
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
