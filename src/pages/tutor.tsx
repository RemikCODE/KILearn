import { PageHeader } from '@/components/app/page-header'
import { AiTutorView } from '@/components/app/ai-tutor-view'

export function TutorPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="AI Tutor"
        description="Wpisz zadanie, a AI wyjaśni je krok po kroku."
      />
      <AiTutorView />
    </div>
  )
}
