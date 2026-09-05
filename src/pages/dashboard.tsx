import { Link } from 'react-router-dom'
import { ArrowRight, Layers, Lightbulb, PlayCircle, Plus, Sparkles } from 'lucide-react'
import { dashboardStats, mockUser } from '@/lib/mock-data'
import { useFlashcardSets } from '@/hooks/use-flashcard-sets'

export function DashboardPage() {
  const { sets } = useFlashcardSets()
  const firstName = mockUser.name.split(' ')[0]

  const recent = [...sets].sort((a, b) => {
    const aTime = a.lastStudiedAt ?? a.createdAt
    const bTime = b.lastStudiedAt ?? b.createdAt
    return bTime.localeCompare(aTime)
  })[0]

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl">
          Cześć, {firstName}!
        </h1>
        <p className="mt-1 text-sm text-foreground/70">Gotowy na dzisiejszą porcję nauki?</p>
      </div>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {dashboardStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card/80 p-4 backdrop-blur-sm"
          >
            <p className="text-2xl font-semibold text-foreground">
              {stat.value} <span className="text-sm font-normal text-muted-foreground">{stat.unit}</span>
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {recent ? (
          <Link
            to={`/flashcards/${recent.id}`}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg lg:col-span-2"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/15 px-3 py-1 text-xs font-medium text-brand">
                  <PlayCircle className="size-3.5" />
                  Kontynuuj naukę
                </span>
                <h2 className="mt-4 text-xl font-semibold text-card-foreground">{recent.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {recent.cards.length} fiszek
                  {recent.lastStudiedAt
                    ? ` · ostatnio ${new Date(recent.lastStudiedAt).toLocaleDateString('pl-PL')}`
                    : ''}
                </p>
              </div>
              <span className="flex size-12 items-center justify-center rounded-2xl bg-brand text-brand-foreground transition-transform group-hover:scale-110">
                <ArrowRight className="size-5" />
              </span>
            </div>
          </Link>
        ) : (
          <div className="flex flex-col items-start justify-center gap-2 rounded-3xl border border-dashed border-border bg-card/50 p-6 lg:col-span-2">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-brand/15 text-brand">
              <Sparkles className="size-5" />
            </span>
            <p className="font-medium text-card-foreground">Nie masz jeszcze żadnych zestawów</p>
            <p className="text-sm text-muted-foreground">Utwórz pierwszy zestaw, żeby zacząć naukę.</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <ActionCard
            to="/flashcards/new?mode=manual"
            icon={<Plus className="size-5" />}
            title="Utwórz fiszki"
            description="Ręcznie lub z AI"
            accent="primary"
          />
          <ActionCard
            to="/tutor"
            icon={<Lightbulb className="size-5" />}
            title="AI Tutor"
            description="Rozwiąż zadanie krok po kroku"
            accent="brand"
          />

          
        </div>
      </section>

      <div className="flex flex-col gap-4">
        <ActionCard
            to="/known-questions"
            icon={<Sparkles className="size-4" />}
            title="Polski - Schowek Wiedzy"
            description="Polski schowek na pytania jawne"
            accent="brand"
          />
      </div>

      {sets.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Twoje zestawy</h2>
            <Link to="/flashcards" className="text-sm font-medium text-foreground/80 hover:text-foreground">
              Zobacz wszystkie
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sets.slice(0, 3).map((set) => (
              <Link
                key={set.id}
                to={`/flashcards/${set.id}`}
                className="group flex items-center gap-3 rounded-2xl border border-border bg-card/80 p-4 backdrop-blur-sm transition-colors hover:bg-card"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand">
                  <Layers className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-card-foreground">
                    {set.title}
                  </span>
                  <span className="block text-xs text-muted-foreground">{set.cards.length} fiszek</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function ActionCard({
  to,
  icon,
  title,
  description,
  accent,
}: {
  to: string
  icon: React.ReactNode
  title: string
  description: string
  accent: 'primary' | 'brand'
}) {
  return (
    <Link
      to={to}
      className="group flex flex-1 items-center gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
    >
      <span
        className={
          accent === 'brand'
            ? 'flex size-11 items-center justify-center rounded-2xl bg-brand/15 text-brand'
            : 'flex size-11 items-center justify-center rounded-2xl bg-primary/15 text-primary'
        }
      >
        {icon}
      </span>
      <span>
        <span className="block font-semibold text-card-foreground">{title}</span>
        <span className="block text-sm text-muted-foreground">{description}</span>
      </span>
    </Link>
  )
}
