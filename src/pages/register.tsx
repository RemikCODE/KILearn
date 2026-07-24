import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthShell } from '@/components/auth/auth-shell'
import { GoogleButton } from '@/components/auth/google-button'
import { TextField } from '@/components/ui/text-field'

export function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  function update(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    navigate('/dashboard')
  }

  return (
    <AuthShell
      title="Załóż konto"
      subtitle="Dołącz do KILearn i ucz się mądrzej."
      footer={
        <>
          Masz już konto?{' '}
          <Link to="/" className="font-semibold text-brand hover:underline">
            Zaloguj się
          </Link>
        </>
      }
    >
      <GoogleButton label="Zarejestruj się przez Google" onClick={() => navigate('/dashboard')} />

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium text-muted-foreground">lub e-mailem</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField
          id="name"
          label="Imię"
          placeholder="Jak masz na imię?"
          autoComplete="given-name"
          value={form.name}
          onChange={update('name')}
          required
        />
        <TextField
          id="email"
          label="Adres e-mail"
          type="email"
          placeholder="twoj@email.com"
          autoComplete="email"
          value={form.email}
          onChange={update('email')}
          required
        />
        <TextField
          id="password"
          label="Hasło"
          type="password"
          placeholder="Min. 8 znaków"
          autoComplete="new-password"
          value={form.password}
          onChange={update('password')}
          required
        />
        <button
          type="submit"
          className="mt-2 h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Utwórz konto
        </button>
        <p className="text-center text-xs text-muted-foreground text-pretty">
          Rejestrując się akceptujesz Regulamin oraz Politykę prywatności.
        </p>
      </form>
    </AuthShell>
  )
}
