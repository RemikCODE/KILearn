'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Bell,
  Folder,
  Home,
  Layers,
  Lightbulb,
  Plus,
  X,
} from 'lucide-react'
import { folders } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const primaryNav = [
  { href: '/dashboard', label: 'Strona główna', icon: Home },
  { href: '/notifications', label: 'Powiadomienia', icon: Bell, badge: 2 },
]

const studyNav = [
  { href: '/flashcards', label: 'Fiszki', icon: Layers },
  { href: '/tutor', label: 'AI Tutor', icon: Lightbulb },
]

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname()

  const isActive = (href: string) =>
    pathname === href || (href !== '/dashboard' && pathname.startsWith(href))

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={cn(
          'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <aside
        className={cn(
          'fixed top-0 right-0 z-50 flex h-full w-72 flex-col border-l border-panel-border bg-panel text-panel-foreground shadow-2xl transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
        aria-label="Menu nawigacji"
      >
        <div className="flex h-16 items-center justify-between border-b border-panel-border px-4">
          <span className="text-sm font-semibold">Menu</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Zamknij menu"
            className="flex size-8 items-center justify-center rounded-full text-panel-muted transition-colors hover:bg-panel-accent hover:text-panel-foreground"
          >
            <X className="size-4.5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="flex flex-col gap-1">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <NavItem item={item} active={isActive(item.href)} onClose={onClose} />
              </li>
            ))}
          </ul>

          <div className="mt-5 mb-2 flex items-center justify-between px-3">
            <span className="text-xs font-semibold tracking-wide text-panel-muted uppercase">
              Twoje foldery
            </span>
          </div>
          <ul className="flex flex-col gap-1">
            <li>
              <button
                type="button"
                onClick={onClose}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-panel-muted transition-colors hover:bg-panel-accent hover:text-panel-foreground"
              >
                <span className="flex size-5 items-center justify-center rounded-md border border-dashed border-current">
                  <Plus className="size-3.5" />
                </span>
                Nowy folder
              </button>
            </li>
            {folders.map((folder) => (
              <li key={folder.id}>
                <Link
                  href="/flashcards"
                  onClick={onClose}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-panel-accent"
                >
                  <span className="flex items-center gap-3">
                    <Folder className="size-4 text-brand" />
                    {folder.name}
                  </span>
                  <span className="text-xs text-panel-muted">{folder.setCount}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="my-4 h-px bg-panel-border" />

          <ul className="flex flex-col gap-1">
            {studyNav.map((item) => (
              <li key={item.href}>
                <NavItem item={item} active={isActive(item.href)} onClose={onClose} />
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}

type NavItemData = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

function NavItem({ item, active, onClose }: { item: NavItemData; active: boolean; onClose: () => void }) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      onClick={onClose}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
        active
          ? 'bg-brand text-brand-foreground shadow-sm shadow-brand/30'
          : 'text-panel-foreground hover:bg-panel-accent',
      )}
    >
      <span className="flex items-center gap-3">
        <Icon className="size-4.5" />
        {item.label}
      </span>
      {item.badge ? (
        <span
          className={cn(
            'flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold',
            active ? 'bg-brand-foreground/20 text-brand-foreground' : 'bg-brand text-brand-foreground',
          )}
        >
          {item.badge}
        </span>
      ) : null}
    </Link>
  )
}
