'use client'

import { useState } from 'react'
import { Check, ImagePlus, Lightbulb, RotateCcw, Send } from 'lucide-react'
import { PageHeader } from '@/components/app/page-header'
import { tutorMethods } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

type Stage = 'input' | 'methods' | 'steps'

const guidedSteps = [
  'Zacznij od wypisania danych z zadania. Co dokładnie wiesz, a czego szukasz? Zapisz to własnymi słowami.',
  'Zastanów się, jaka zależność łączy te wielkości. Jakiego wzoru lub reguły możesz tu użyć?',
  'Podstaw znane wartości do zależności i zapisz równanie — jeszcze go nie rozwiązuj.',
  'Przekształć równanie tak, aby szukana wielkość została sama po jednej stronie.',
  'Wykonaj obliczenia i sprawdź jednostki. Czy wynik ma sens w kontekście zadania?',
]

export function AiTutorView() {
  const [stage, setStage] = useState<Stage>('input')
  const [problem, setProblem] = useState('')
  const [method, setMethod] = useState<string | null>(null)
  const [stepIndex, setStepIndex] = useState(0)

  function reset() {
    setStage('input')
    setProblem('')
    setMethod(null)
    setStepIndex(0)
  }

  return (
    <div className="flex flex-col gap-6"> 
      <PageHeader
        title=""
        description="Wklej zadanie, a AI naprowadzi Cię na rozwiązanie krok po kroku — bez podawania gotowej odpowiedzi."
        action={
          stage !== 'input' ? (
            <button
              type="button"
              onClick={reset}
              className="flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <RotateCcw className="size-4" />
              Nowe zadanie
            </button>
          ) : undefined
        }
      />

      {stage === 'input' && (
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="Wpisz lub wklej treść zadania..."
            rows={5}
            className="w-full resize-none rounded-2xl border border-input bg-background p-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent">
              <ImagePlus className="size-4 text-brand" />
              Dodaj zdjęcie zadania
              <input type="file" accept="image/*" className="hidden" />
            </label>
            <button
              type="button"
              onClick={() => setStage('methods')}
              disabled={!problem.trim()}
              className="flex h-10 items-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-brand-foreground shadow-sm shadow-brand/30 transition-colors hover:bg-brand/90 disabled:pointer-events-none disabled:opacity-50"
            >
              <Send className="size-4" />
              Zaczynamy
            </button>
          </div>
        </div>
      )}

      {stage !== 'input' && (
        <div className="flex flex-col gap-4">
          <ChatBubble>
            Świetnie! Przeanalizowałem Twoje zadanie. Zanim zaczniemy — nie podam Ci gotowej odpowiedzi.
            Poprowadzę Cię tak, żebyś doszedł do niej samodzielnie. Wybierz metodę, którą chcesz spróbować:
          </ChatBubble>

          <div className="grid gap-3 sm:grid-cols-3">
            {tutorMethods.map((m) => (
              <button
                key={m.id}
                type="button"
                disabled={stage === 'steps'}
                onClick={() => {
                  setMethod(m.id)
                  setStage('steps')
                  setStepIndex(0)
                }}
                className={cn(
                  'flex flex-col gap-1.5 rounded-2xl border p-4 text-left transition-all',
                  method === m.id
                    ? 'border-brand bg-brand/10'
                    : 'border-border bg-card hover:-translate-y-0.5 hover:shadow-md',
                  stage === 'steps' && method !== m.id && 'opacity-50',
                )}
              >
                <span className="flex size-9 items-center justify-center rounded-xl bg-brand/15 text-brand">
                  <Lightbulb className="size-4.5" />
                </span>
                <span className="mt-1 text-sm font-semibold text-card-foreground">{m.title}</span>
                <span className="text-xs text-muted-foreground text-pretty">{m.description}</span>
              </button>
            ))}
          </div>

          {stage === 'steps' && (
            <div className="flex flex-col gap-3">
              {guidedSteps.slice(0, stepIndex + 1).map((step, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <ChatBubble>
                    <span className="mb-1 block text-xs font-semibold tracking-wide text-brand uppercase">
                      Krok {i + 1} z {guidedSteps.length}
                    </span>
                    {step}
                  </ChatBubble>
                </div>
              ))}

              {stepIndex < guidedSteps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setStepIndex((i) => i + 1)}
                  className="flex h-11 w-fit items-center gap-2 self-end rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                >
                  <Check className="size-4" />
                  Zrobione, dalej
                </button>
              ) : (
                <div className="flex items-center gap-2 self-end rounded-xl border border-brand/30 bg-brand/10 px-4 py-2.5 text-sm font-medium text-foreground">
                  <Check className="size-4 text-brand" />
                  To wszystkie wskazówki. Dokończ obliczenia samodzielnie — dasz radę!
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ChatBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand text-brand-foreground">
        <Lightbulb className="size-5" />
      </span>
      <div className="max-w-2xl rounded-2xl rounded-tl-sm border border-border bg-card p-4 text-sm text-card-foreground shadow-sm text-pretty">
        {children}
      </div>
    </div>
  )
}
