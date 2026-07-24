import type { ReactNode } from 'react'
import { BrandLogo } from '@/components/brand-logo'

type AuthShellProps = {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <main className="app-gradient flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <BrandLogo size="lg" showText={false} className="mb-4" />
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            KI<span className="text-brand">Learn</span>
          </h1>
          <p className="mt-1 text-sm text-white/70">Ucz się szybciej z fiszkami i AI</p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-2xl shadow-black/20 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-card-foreground">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-muted-foreground text-pretty">{subtitle}</p>}
          </div>
          {children}
        </div>

        {footer && <div className="mt-6 text-center text-sm text-white/80">{footer}</div>}
      </div>
    </main>
  )
}
