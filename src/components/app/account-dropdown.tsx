import { useCallback, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from 'next-themes'
import {
  Crown,
  LogOut,
  MessageSquarePlus,
  Moon,
  Settings,
  ShieldCheck,
  Sun,
} from 'lucide-react'
import { useOutsideClick } from '@/hooks/use-outside-click'
import { mockUser } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export function AccountDropdown() {
  const navigate = useNavigate()
  const { resolvedTheme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const ref = useOutsideClick<HTMLDivElement>(open, close)

  const isDark = resolvedTheme === 'dark'

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Menu konta"
        aria-expanded={open}
        className="flex size-9 overflow-hidden rounded-full ring-2 ring-transparent transition hover:ring-brand/60 focus-visible:outline-none focus-visible:ring-brand"
      >
        <img
          src={mockUser.avatar || '/placeholder.svg'}
          alt={mockUser.name}
          width={36}
          height={36}
          className="size-full object-cover"
        />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-64 origin-top-right overflow-hidden rounded-2xl border border-border bg-popover p-1.5 text-popover-foreground shadow-xl shadow-black/20">
          <div className="flex items-center gap-3 px-2.5 py-2.5">
            <img
              src={mockUser.avatar || '/placeholder.svg'}
              alt=""
              width={40}
              height={40}
              className="size-10 rounded-full object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{mockUser.name}</p>
              <p className="truncate text-xs text-muted-foreground">{mockUser.email}</p>
            </div>
          </div>

          <Separator />

          <MenuLink to="/settings" icon={<Settings className="size-4" />} onClick={close}>
            Ustawienia
          </MenuLink>

          <button
            type="button"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-sm transition-colors hover:bg-accent"
          >
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            {isDark ? 'Tryb jasny' : 'Tryb ciemny'}
          </button>

          <Separator />

          <button
            type="button"
            onClick={() => {
              close()
              navigate('/')
            }}
            className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-sm transition-colors hover:bg-accent"
          >
            <LogOut className="size-4" />
            Wyloguj
          </button>

          <Separator />

          <MenuLink to="/settings" icon={<ShieldCheck className="size-4" />} onClick={close}>
            Polityka prywatności
          </MenuLink>
          <MenuLink to="/settings" icon={<MessageSquarePlus className="size-4" />} onClick={close}>
            Komentarze i sugestie
          </MenuLink>
          <MenuLink
            to="/premium"
            icon={<Crown className="size-4" />}
            onClick={close}
            className="font-semibold text-brand hover:bg-brand/10"
          >
            Subskrybuj
          </MenuLink>
        </div>
      )}
    </div>
  )
}

function Separator() {
  return <div className="my-1 h-px bg-border" />
}

function MenuLink({
  to,
  icon,
  children,
  onClick,
  className,
}: {
  to: string
  icon: React.ReactNode
  children: React.ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm transition-colors hover:bg-accent',
        className,
      )}
    >
      {icon}
      {children}
    </Link>
  )
}
