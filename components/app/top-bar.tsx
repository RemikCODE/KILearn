'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DollarSign, Menu, Search, X } from 'lucide-react'
import { BrandLogo } from '@/components/brand-logo'
import { AccountDropdown } from '@/components/app/account-dropdown'
import { CreateSetMenu } from '@/components/app/create-set-menu'

export function TopBar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const [query, setQuery] = useState('')

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-panel-border bg-panel px-4 text-panel-foreground sm:px-6">
      <Link href="/dashboard" className="shrink-0">
        <BrandLogo size="sm" className="hidden sm:flex" />
        <BrandLogo size="sm" showText={false} className="sm:hidden" />
      </Link>

      <div className="relative mx-auto flex w-full max-w-md items-center">
        <Search className="pointer-events-none absolute left-3.5 size-4 text-panel-muted" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Szukaj fiszek, zestawów..."
          className="h-10 w-full rounded-full border border-panel-border bg-panel-accent pr-9 pl-10 text-sm text-panel-foreground placeholder:text-panel-muted focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 [&::-webkit-search-cancel-button]:appearance-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Wyczyść wyszukiwanie"
            className="absolute right-3 flex size-5 items-center justify-center rounded-full text-panel-muted transition-colors hover:bg-panel-border hover:text-panel-foreground"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
        <Link
          href="/premium"
          aria-label="Plany Premium"
          className="flex size-9 items-center justify-center rounded-full border border-brand/40 bg-brand/10 text-brand transition-colors hover:bg-brand/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <DollarSign className="size-5" />
        </Link>

        <CreateSetMenu />

        <AccountDropdown />

        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Otwórz menu boczne"
          className="flex size-9 items-center justify-center rounded-full text-panel-foreground transition-colors hover:bg-panel-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Menu className="size-5" />
        </button>
      </div>
    </header>
  )
}
