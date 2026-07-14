import Link from 'next/link'
import { Clock, Layers } from 'lucide-react'
import { PageHeader } from '@/components/app/page-header'
import { NewSetButton } from '@/components/app/new-set-button'
import { flashcardSets, folders } from '@/lib/mock-data'

export default function FlashcardsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Fiszki"
        description="Twórz zestawy ręcznie lub generuj je z AI ze zdjęcia podręcznika."
        action={<NewSetButton />}
      />

      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-brand px-3.5 py-1.5 text-sm font-medium text-brand-foreground">
          Wszystkie
        </span>
        {folders.map((folder) => (
          <span
            key={folder.id}
            className="rounded-full border border-border bg-card/70 px-3.5 py-1.5 text-sm font-medium text-foreground/80 backdrop-blur-sm"
          >
            {folder.name}
          </span>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {flashcardSets.map((set) => (
          <Link
            key={set.id}
            href={`/flashcards/${set.id}`}
            className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-brand/15 text-brand transition-transform group-hover:scale-105">
                  <Layers className="size-5" />
                </span>
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  {set.cardCount} fiszek
                </span>
              </div>
              <h2 className="mt-4 font-semibold text-card-foreground text-balance">{set.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground text-pretty">{set.description}</p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="size-3.5" />
              Ostatnia nauka: {set.lastStudied}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
