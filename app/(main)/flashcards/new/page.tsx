import { Suspense } from 'react'
import { NewSetView } from '@/components/app/new-set-view'

export default function NewFlashcardSetPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-sm text-foreground/60">Ładowanie...</div>}>
      <NewSetView />
    </Suspense>
  )
}
