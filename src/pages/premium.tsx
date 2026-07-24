import { useState } from 'react'
import { Check, Crown, Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/app/page-header'

const plans = {
  monthly: { price: '19,99 zł', period: '/ mies.', note: 'Rozliczane miesięcznie' },
  yearly: { price: '149,99 zł', period: '/ rok', note: 'Oszczędzasz 37%' },
}

const features = [
  'Nielimitowane zestawy fiszek',
  'AI Tutor bez limitów',
  'Generowanie fiszek ze zdjęć i PDF',
  'Tryb offline',
  'Zaawansowane statystyki nauki',
  'Priorytetowe wsparcie',
]

export function PremiumPage() {
  const [cycle, setCycle] = useState<'monthly' | 'yearly'>('yearly')
  const plan = plans[cycle]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="KILearn Premium" description="Odblokuj pełnię możliwości nauki." />

      <section className="relative overflow-hidden rounded-3xl border border-brand/30 bg-gradient-to-br from-brand/15 to-primary/10 p-8 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-brand text-brand-foreground">
          <Crown className="size-7" />
        </span>
        <h2 className="mt-4 text-2xl font-semibold text-foreground text-balance">
          Ucz się szybciej z Premium
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-foreground/70 text-pretty">
          Nielimitowane fiszki, AI Tutor i inteligentne powtórki — wszystko w jednym miejscu.
        </p>

        <div className="mx-auto mt-6 inline-flex rounded-xl border border-border bg-card/70 p-1">
          <button
            type="button"
            onClick={() => setCycle('monthly')}
            aria-pressed={cycle === 'monthly'}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
              cycle === 'monthly' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            Miesięcznie
          </button>
          <button
            type="button"
            onClick={() => setCycle('yearly')}
            aria-pressed={cycle === 'yearly'}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
              cycle === 'yearly' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
            }`}
          >
            Rocznie
          </button>
        </div>

        <div className="mt-5 flex items-end justify-center gap-1">
          <span className="text-4xl font-semibold text-foreground">{plan.price}</span>
          <span className="mb-1 text-sm text-muted-foreground">{plan.period}</span>
        </div>
        <p className="mt-1 text-xs font-medium text-brand">{plan.note}</p>

        <button className="mt-6 inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-brand py-3 font-semibold text-brand-foreground transition-colors hover:bg-brand/90">
          <Sparkles className="size-4" />
          Rozpocznij 7 dni za darmo
        </button>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h3 className="mb-4 text-sm font-semibold text-card-foreground">Co zyskujesz</h3>
        <ul className="grid gap-3 sm:grid-cols-2">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-3 text-sm text-card-foreground">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand">
                <Check className="size-3.5" />
              </span>
              {f}
            </li>
          ))}
        </ul>
      </section>

      <p className="text-center text-xs text-muted-foreground">
        Możesz anulować w dowolnym momencie. Bez zobowiązań.
      </p>
    </div>
  )
}
