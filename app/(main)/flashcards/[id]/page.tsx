import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { FlashcardSetView } from '@/components/app/flashcard-set-view'
import { flashcardSets } from '@/lib/mock-data'

export default async function FlashcardSetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const set = flashcardSets.find((s) => s.id === id)

  if (!set) {
    return (
      <div className="flex flex-col items-start gap-4 py-12">
        <p className="text-foreground/80">Nie znaleziono takiego zestawu.</p>
        <Link
          href="/flashcards"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
        >
          <ArrowLeft className="size-4" />
          Wróć do fiszek
        </Link>
      </div>
    )
  }

  return <FlashcardSetView set={set} />
}
