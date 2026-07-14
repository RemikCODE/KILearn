import { GraduationCap } from 'lucide-react'
import { cn } from '@/lib/utils'

type BrandLogoProps = {
  className?: string
  iconClassName?: string
  textClassName?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: { box: 'size-8', icon: 'size-4', text: 'text-lg' },
  md: { box: 'size-10', icon: 'size-5', text: 'text-xl' },
  lg: { box: 'size-14', icon: 'size-7', text: 'text-3xl' },
}

export function BrandLogo({
  className,
  iconClassName,
  textClassName,
  showText = true,
  size = 'md',
}: BrandLogoProps) {
  const s = sizeMap[size]
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-2xl bg-brand text-brand-foreground shadow-lg shadow-brand/30',
          s.box,
          iconClassName,
        )}
        aria-hidden="true"
      >
        <GraduationCap className={s.icon} />
      </div>
      {showText && (
        <span className={cn('font-semibold tracking-tight', s.text, textClassName)}>
          KI<span className="text-brand">Learn</span>
        </span>
      )}
    </div>
  )
}
