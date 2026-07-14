import Link from 'next/link'
import Image from 'next/image'
import { Bell, Crown, Globe, LogOut, Palette, ShieldCheck } from 'lucide-react'
import { PageHeader } from '@/components/app/page-header'
import { ThemeToggle } from '@/components/app/theme-toggle'
import { ToggleSwitch } from '@/components/ui/toggle-switch'
import { mockUser } from '@/lib/mock-data'

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Ustawienia" description="Zarządzaj kontem i preferencjami aplikacji." />

      <section className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
        <Image
          src={mockUser.avatar || '/placeholder.svg'}
          alt=""
          width={64}
          height={64}
          className="size-16 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-semibold text-card-foreground">{mockUser.name}</p>
          <p className="truncate text-sm text-muted-foreground">{mockUser.email}</p>
        </div>
        <button className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted">
          Edytuj profil
        </button>
      </section>

      <SettingsGroup icon={<Palette className="size-4" />} title="Wygląd">
        <SettingRow label="Motyw" description="Wybierz jasny, ciemny lub systemowy.">
          <ThemeToggle />
        </SettingRow>
      </SettingsGroup>

      <SettingsGroup icon={<Bell className="size-4" />} title="Powiadomienia">
        <SettingRow label="Przypomnienia o nauce" description="Codzienne przypomnienie o powtórkach.">
          <ToggleSwitch defaultChecked label="Przypomnienia o nauce" />
        </SettingRow>
        <SettingRow label="Powiadomienia AI" description="Info o wygenerowanych fiszkach.">
          <ToggleSwitch defaultChecked label="Powiadomienia AI" />
        </SettingRow>
        <SettingRow label="E-mail" description="Podsumowania tygodniowe na e-mail.">
          <ToggleSwitch label="Powiadomienia e-mail" />
        </SettingRow>
      </SettingsGroup>

      <SettingsGroup icon={<Globe className="size-4" />} title="Preferencje nauki">
        <SettingRow label="Automatyczne odsłuchiwanie" description="Czytaj słówka na głos.">
          <ToggleSwitch label="Automatyczne odsłuchiwanie" />
        </SettingRow>
        <SettingRow label="Mieszaj fiszki" description="Losowa kolejność podczas nauki.">
          <ToggleSwitch defaultChecked label="Mieszaj fiszki" />
        </SettingRow>
      </SettingsGroup>

      <Link
        href="/premium"
        className="flex items-center gap-4 rounded-2xl border border-brand/40 bg-brand/10 p-5 transition-colors hover:bg-brand/15"
      >
        <span className="flex size-11 items-center justify-center rounded-2xl bg-brand text-brand-foreground">
          <Crown className="size-5" />
        </span>
        <span className="flex-1">
          <span className="block font-semibold text-foreground">Przejdź na Premium</span>
          <span className="block text-sm text-foreground/70">Nielimitowane fiszki i AI Tutor.</span>
        </span>
      </Link>

      <SettingsGroup icon={<ShieldCheck className="size-4" />} title="Konto">
        <Link href="/" className="flex items-center gap-3 px-1 py-2 text-sm font-medium text-destructive">
          <LogOut className="size-4" />
          Wyloguj się
        </Link>
      </SettingsGroup>
    </div>
  )
}

function SettingsGroup({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-card-foreground">
        <span className="text-muted-foreground">{icon}</span>
        {title}
      </div>
      <div className="divide-y divide-border">{children}</div>
    </section>
  )
}

function SettingRow({
  label,
  description,
  children,
}: {
  label: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-card-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  )
}
