import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { FlashcardSetEditView } from '@/components/app/flashcard-set-edit-view'
import { useFlashcardSets, CURRENT_USER_ID } from '@/hooks/use-flashcard-sets'

export function FlashcardEditPage() {
  const { id } = useParams<{ id: string }>()
  const { getById, loading } = useFlashcardSets()
  const set = id ? getById(id) : undefined

  if (loading) return null

  if (!set || set.ownerId !== CURRENT_USER_ID) {
    return (
      <div className="flex flex-col items-start gap-4 py-12">
        <p className="text-foreground/80">Nie znaleziono takiego zestawu.</p>
        <Link
          to="/flashcards"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
        >
          <ArrowLeft className="size-4" />
          Wróć do fiszek
        </Link>
      </div>
    )
  }

  return <FlashcardSetEditView set={set} />
}
