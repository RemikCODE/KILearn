import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, MailCheck } from 'lucide-react'
import { AuthShell } from '@/components/auth/auth-shell'
import { TextField } from '@/components/ui/text-field'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <AuthShell
      title={sent ? 'Sprawdź skrzynkę' : 'Zresetuj hasło'}
      subtitle={
        sent
          ? undefined
          : 'Podaj adres e-mail powiązany z kontem, a wyślemy Ci link do zresetowania hasła.'
      }
      footer={
        <Link to="/" className="inline-flex items-center gap-1.5 font-medium text-white/80 hover:text-white">
          <ArrowLeft className="size-4" />
          Wróć do logowania
        </Link>
      }
    >
      {sent ? (
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <MailCheck className="size-7" />
          </div>
          <p className="text-sm text-muted-foreground text-pretty">
            Wysłaliśmy link resetujący na adres{' '}
            <span className="font-medium text-card-foreground">{email || 'twój e-mail'}</span>. Sprawdź
            skrzynkę odbiorczą oraz folder spam.
          </p>
          <button
            type="button"
            onClick={() => setSent(false)}
            className="text-sm font-medium text-primary hover:underline"
          >
            Wyślij ponownie
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField
            id="email"
            label="Adres e-mail"
            type="email"
            placeholder="twoj@email.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="mt-2 h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Wyślij link resetujący
          </button>
        </form>
      )}
    </AuthShell>
  )
}
