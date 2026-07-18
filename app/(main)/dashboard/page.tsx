import Link from 'next/link'
import { ArrowRight, Layers, Lightbulb, PlayCircle, Plus } from 'lucide-react'
import { dashboardStats, flashcardSets, mockUser } from '@/lib/mock-data'

export default function DashboardPage() {
  const recent = flashcardSets[0]
  const firstName = mockUser.name.split(' ')[0]

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
        <Link
          href={`/flashcards/${recent.id}`}
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
                {recent.cardCount} fiszek · ostatnio {recent.lastStudied}
              </p>
            </div>
            <span className="flex size-12 items-center justify-center rounded-2xl bg-brand text-brand-foreground transition-transform group-hover:scale-110">
              <ArrowRight className="size-5" />
            </span>
          </div>
          <div className="mt-6">
            <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
              <span>Postęp zestawu</span>
              <span>68%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[68%] rounded-full bg-brand" />
            </div>
          </div>
        </Link>

        <div className="flex flex-col gap-4">
          <ActionCard
            href="/flashcards/new?mode=manual"
            icon={<Plus className="size-5" />}
            title="Utwórz fiszki"
            description="Ręcznie lub z AI"
          />
          <ActionCard
            href="/tutor"
            icon={<Lightbulb className="size-5" />}
            title="AI Tutor"
            description="Rozwiąż zadanie krok po kroku"
          />
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Twoje zestawy</h2>
          <Link href="/flashcards" className="text-sm font-medium text-foreground/80 hover:text-foreground">
            Zobacz wszystkie
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {flashcardSets.slice(0, 3).map((set) => (
            <Link
              key={set.id}
              href={`/flashcards/${set.id}`}
              className="group flex items-center gap-3 rounded-2xl border border-border bg-card/80 p-4 backdrop-blur-sm transition-colors hover:bg-card"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand">
                <Layers className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-card-foreground">
                  {set.title}
                </span>
                <span className="block text-xs text-muted-foreground">{set.cardCount} fiszek</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

function ActionCard({
  href,
  icon,
  title,
  description,
}: {
  href: string
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <Link
      href={href}
      className="group flex flex-1 items-center gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
    >
      <span className="flex size-11 items-center justify-center rounded-2xl bg-brand/15 text-brand">
        {icon}
      </span>
      <span>
        <span className="block font-semibold text-card-foreground">{title}</span>
        <span className="block text-sm text-muted-foreground">{description}</span>
      </span>
    </Link>
  )
}
