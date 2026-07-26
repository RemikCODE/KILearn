'use client'

import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Clock, Layers, Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/app/page-header'
import { NewSetButton } from '@/components/app/new-set-button'
import { useCategories } from '@/hooks/use-categories'
import { useFlashcardSets } from '@/hooks/use-flashcard-sets'
import { cn } from '@/lib/utils'

export function FlashcardsPage() {
  const { categories } = useCategories()
  const { sets, loading } = useFlashcardSets()
  const [searchParams, setSearchParams] = useSearchParams()

  const activeCategoryId = searchParams.get('category')

  const visibleSets = useMemo(() => {
    if (!activeCategoryId) return sets
    return sets.filter((s) => s.categoryId === activeCategoryId)
  }, [sets, activeCategoryId])

  function selectCategory(id: string | null) {
    if (!id) {
      searchParams.delete('category')
    } else {
      searchParams.set('category', id)
    }
    setSearchParams(searchParams, { replace: true })
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Fiszki"
        description="Twórz zestawy ręcznie lub generuj je z AI ze zdjęcia podręcznika."
        action={<NewSetButton />}
      />

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => selectCategory(null)}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
              !activeCategoryId
                ? 'bg-brand text-brand-foreground'
                : 'border border-border bg-card/70 text-foreground/80 backdrop-blur-sm hover:bg-card',
            )}
          >
            Wszystkie
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => selectCategory(category.id)}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
                activeCategoryId === category.id
                  ? 'bg-brand text-brand-foreground'
                  : 'border border-border bg-card/70 text-foreground/80 backdrop-blur-sm hover:bg-card',
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      {!loading && visibleSets.length === 0 && (
        <EmptyState hasCategoryFilter={Boolean(activeCategoryId)} />
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleSets.map((set) => {
          const category = categories.find((c) => c.id === set.categoryId)
          return (
            <Link
              key={set.id}
              to={`/flashcards/${set.id}`}
              className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-brand/15 text-brand transition-transform group-hover:scale-105">
                    <Layers className="size-5" />
                  </span>
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    {set.cards.length} fiszek
                  </span>
                </div>
                <h2 className="mt-4 font-semibold text-card-foreground text-balance">{set.title}</h2>
                {set.description && (
                  <p className="mt-1 text-sm text-muted-foreground text-pretty">{set.description}</p>
                )}
                {category && (
                  <span className="mt-2 inline-block rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {category.name}
                  </span>
                )}
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="size-3.5" />
                {set.lastStudiedAt ? `Ostatnia nauka: ${new Date(set.lastStudiedAt).toLocaleDateString('pl-PL')}` : 'Jeszcze nie uczono się'}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function EmptyState({ hasCategoryFilter }: { hasCategoryFilter: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-brand/15 text-brand">
        <Sparkles className="size-7" />
      </span>
      <p className="font-medium text-card-foreground">
        {hasCategoryFilter ? 'Brak zestawów w tej kategorii' : 'Nie masz jeszcze żadnych zestawów'}
      </p>
      <p className="max-w-sm text-sm text-muted-foreground">
        {hasCategoryFilter
          ? 'Utwórz nowy zestaw i przypisz go do tej kategorii.'
          : 'Utwórz pierwszy zestaw ręcznie albo wygeneruj go z AI ze zdjęcia podręcznika.'}
      </p>
    </div>
  )
}
