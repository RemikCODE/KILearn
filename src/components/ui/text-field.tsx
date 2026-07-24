import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  hint?: ReactNode
  containerClassName?: string
}

export function TextField({ label, hint, id, className, containerClassName, ...props }: TextFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-card-foreground">
          {label}
        </label>
        {hint}
      </div>
      <input
        id={id}
        className={cn(
          'h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
          className,
        )}
        {...props}
      />
    </div>
  )
}
