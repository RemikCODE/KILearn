import { Bell, Sparkles, Trophy } from 'lucide-react'
import { PageHeader } from '@/components/app/page-header'
import { notifications, type AppNotification } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const iconMap: Record<AppNotification['type'], React.ComponentType<{ className?: string }>> = {
  reminder: Bell,
  ai: Sparkles,
  system: Trophy,
}

export default function NotificationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Powiadomienia"
        description="Przypomnienia o powtórkach, gotowe fiszki z AI i Twoje osiągnięcia."
      />

      <ul className="flex flex-col gap-2">
        {notifications.map((n) => {
          const Icon = iconMap[n.type]
          return (
            <li
              key={n.id}
              className={cn(
                'flex items-start gap-4 rounded-2xl border border-border p-4 backdrop-blur-sm transition-colors',
                n.unread ? 'bg-card' : 'bg-card/60',
              )}
            >
              <span
                className={cn(
                  'flex size-10 shrink-0 items-center justify-center rounded-xl',
                  n.type === 'ai'
                    ? 'bg-brand/15 text-brand'
                    : n.type === 'system'
                      ? 'bg-primary/15 text-primary'
                      : 'bg-muted text-muted-foreground',
                )}
              >
                <Icon className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-card-foreground">{n.title}</p>
                  {n.unread && <span className="size-2 shrink-0 rounded-full bg-brand" />}
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground text-pretty">{n.body}</p>
                <p className="mt-1.5 text-xs text-muted-foreground">{n.time}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
