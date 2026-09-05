import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  GraduationCap,
  Layers,
  MousePointerClick,
  School,
  Sparkles,
  Timer,
  Zap,
} from 'lucide-react'
import { BrandLogo } from '@/components/brand-logo'
import { BrainMascot3D } from '@/components/landing/brain-mascot-3d'
import { PreviewCarousel } from '@/components/landing/preview-carousel'
import { SloganTicker } from '@/components/landing/slogan-ticker'

const featureCards = [
  {
    icon: MousePointerClick,
    title: 'Pamięć motoryczna',
    text: 'Klikanie, przesuwanie i krótkie akcje pomagają mózgowi zapamiętywać pojęcia trwalej.',
  },
  {
    icon: Timer,
    title: 'Szybsze powtórki',
    text: 'Krótkie sesje zamiast wielogodzinnego zakuwania — idealne przed sprawdzianem.',
  },
  {
    icon: Brain,
    title: 'Trudne pojęcia prościej',
    text: 'Rozbijaj skomplikowane tematy na małe kroki i wracaj do nich w odpowiednim momencie.',
  },
]

const steps = [
  'Wybierz temat, którego chcesz się nauczyć.',
  'Przerób go na interaktywne fiszki i mini-zadania.',
  'Powtarzaj w krótkich seriach, a KILearn podpowie tempo.',
]

function usePointerParallax() {
  const brainRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const target = { x: 0, y: 0 }
    const current = { x: 0, y: 0 }
    let raf = 0

    function onPointerMove(event: PointerEvent) {
      target.x = (event.clientX / window.innerWidth - 0.5) * 2
      target.y = (event.clientY / window.innerHeight - 0.5) * 2
    }

    // piszemy transformy bezpośrednio do DOM (rAF) zamiast setState,
    // żeby ruch myszy nie wymuszał re-renderu Reacta (w tym kanwy WebGL)
    function tick() {
      current.x += (target.x - current.x) * 0.1
      current.y += (target.y - current.y) * 0.1

      if (brainRef.current) {
        brainRef.current.style.transform = `translate3d(${current.x * 22}px, ${current.y * 14}px, 0) rotateX(${current.y * -5}deg) rotateY(${current.x * 7}deg)`
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${current.x * -34}px, ${current.y * -20}px, 0)`
      }

      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onPointerMove)
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return { brainRef, glowRef }
}

export function LandingPage() {
  const { brainRef, glowRef } = usePointerParallax()

  return (
    <main className="landing-shell relative min-h-screen overflow-hidden text-white">
      <div className="landing-bg" aria-hidden="true" />
      <div className="landing-grid" aria-hidden="true" />

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="landing-glow" ref={glowRef} />
        <div className="landing-brain-stage" ref={brainRef}>
          <BrainMascot3D />
        </div>
        <div className="landing-orbit landing-orbit--one" />
        <div className="landing-orbit landing-orbit--two" />
      </div>

      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-black/35 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" aria-label="KILearn — strona główna" className="shrink-0">
            <BrandLogo size="md" iconClassName="bg-orange-500 text-black shadow-orange-500/30" textClassName="text-white" />
          </Link>

          <div className="hidden items-center gap-6 text-sm font-medium text-white/70 md:flex">
            <a href="#jak-to-dziala" className="transition hover:text-white">
              Jak to działa
            </a>
            <a href="#dla-kogo" className="transition hover:text-white">
              Dla kogo
            </a>
            <a href="#preview" className="transition hover:text-white">
              Podgląd
            </a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/85 transition hover:border-orange-300/60 hover:bg-white/10 hover:text-white"
            >
              Zaloguj się
            </Link>
            <Link
              to="/register"
              className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-black shadow-lg shadow-orange-500/30 transition hover:bg-orange-400"
            >
              Utwórz konto
            </Link>
          </div>
        </nav>
      </header>

      <section className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-4 pb-32 pt-28 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="max-w-2xl">
            <div className="landing-kicker">
              <Sparkles className="size-4" />
              Kinestetyczna nauka dla szkoły, studiów i codziennych wyzwań
            </div>
            <h1 className="mt-6 max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Ucz się szybciej.
              <span className="block bg-gradient-to-r from-orange-200 via-orange-400 to-amber-200 bg-clip-text text-transparent">
                Zapamiętuj ruchem.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">
              KILearn zamienia żmudne pojęcia w interaktywne powtórki. Angażuje pamięć motoryczną,
              skraca czas nauki i pomaga ogarnąć trudne tematy — w szkole i poza nią.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/register" className="landing-cta-primary">
                Zacznij naukę
                <ArrowRight className="size-4" />
              </Link>
              <a href="#preview" className="landing-cta-secondary">
                Zobacz podgląd aplikacji
              </a>
            </div>

            <div className="mt-10 grid max-w-lg grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                ['3×', 'szybsze powtórki'],
                ['15 min', 'krótka sesja'],
                ['100%', 'focus na pojęciach'],
              ].map(([value, label]) => (
                <div className="landing-stat" key={label}>
                  <p className="text-2xl font-semibold text-orange-200">{value}</p>
                  <p className="mt-1 text-xs text-white/60">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div id="preview" className="landing-preview-wrap min-w-0">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-200/80">Live preview</p>
                <h2 className="mt-1 text-2xl font-semibold text-white">Miejsca na realne screeny aplikacji</h2>
              </div>
              <div className="hidden rounded-full border border-orange-300/25 bg-orange-400/10 px-3 py-1 text-xs font-medium text-orange-100 sm:block">
                auto-slide
              </div>
            </div>
            <PreviewCarousel />
          </div>
        </div>
      </section>

      <section id="jak-to-dziala" className="relative z-10 mx-auto max-w-7xl px-4 pb-28 sm:px-6 lg:px-8">
        <div className="landing-section-head">
          <p className="landing-eyebrow">Jak to działa</p>
          <h2 className="landing-section-title">Nauka, która nie jest płaska</h2>
          <p className="landing-section-copy">
            Zamiast tylko czytać notatki, wykonujesz mikro-ruchy: odkrywasz odpowiedzi, przeciągasz elementy,
            klikasz powtórki i wracasz do trudnych pojęć dokładnie wtedy, kiedy trzeba.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {featureCards.map((feature) => (
            <article className="landing-card" key={feature.title}>
              <div className="landing-card-icon">
                <feature.icon className="size-5" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/70">{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="dla-kogo" className="relative z-10 mx-auto max-w-7xl px-4 pb-36 sm:px-6 lg:px-8">
        <div className="landing-split">
          <div>
            <p className="landing-eyebrow">Dla kogo</p>
            <h2 className="landing-section-title">Do szkoły, na studia i do wszystkiego, co wymaga ogarnięcia</h2>
            <p className="landing-section-copy mt-4">
              KILearn pasuje do przedmiotów ścisłych, humanistycznych, języków, egzaminów i szybkich powtórek
              przed zajęciami. Jeśli coś jest żmudne, zamieniasz to w serię krótkich, wykonalnych kroków.
            </p>
          </div>

          <div className="landing-card landing-card--steps">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-orange-500 text-black">
                <GraduationCap className="size-5" />
              </span>
              <div>
                <p className="font-semibold text-white">Prosty plan na trudne pojęcia</p>
                <p className="text-sm text-white/60">Trzy kroki, zero chaosu.</p>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {steps.map((step, index) => (
                <div className="flex gap-3" key={step}>
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-orange-200">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-6 text-white/70">{step}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-2 rounded-2xl border border-orange-300/20 bg-orange-400/10 p-3 text-sm text-orange-50">
              <CheckCircle2 className="size-4 shrink-0 text-orange-200" />
              Mniej stresu, więcej kontroli nad materiałem.
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-5xl px-4 pb-40 text-center sm:px-6 lg:px-8">
        <div className="landing-final-card">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-orange-500 text-black shadow-lg shadow-orange-500/30">
            <Zap className="size-6" />
          </div>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Gotowy, żeby uczyć się mądrzej?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            Wejdź do KILearn, ustaw pierwszy zestaw i przekonaj się, że trudne pojęcia mogą wejść szybciej —
            bez nudy i bez płaskiego zakuwania.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/register" className="landing-cta-primary justify-center">
              Utwórz darmowe konto
              <Layers className="size-4" />
            </Link>
            <Link to="/login" className="landing-cta-secondary justify-center">
              Mam już konto
            </Link>
          </div>
          <p className="mt-5 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.24em] text-white/40">
            <School className="size-4" />
            KILearn — nauka przez działanie
          </p>
        </div>
      </section>

      <SloganTicker />
    </main>
  )
}