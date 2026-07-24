import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthShell } from '@/components/auth/auth-shell'
import { GoogleButton } from '@/components/auth/google-button'
import { TextField } from '@/components/ui/text-field'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Mock only — no real auth. Just navigate into the app.
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    navigate('/dashboard')
  }

  return (
    <AuthShell
      title="Zaloguj się"
      subtitle="Kontynuuj naukę tam, gdzie skończyłeś."
      footer={
        <>
          Nie masz konta?{' '}
          <Link to="/register" className="font-semibold text-brand hover:underline">
            Zarejestruj się
          </Link>
        </>
      }
    >
      <GoogleButton label="Zaloguj się przez Google" onClick={() => navigate('/dashboard')} />

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium text-muted-foreground">lub e-mailem</span>
        <span className="h-px flex-1 bg-border" />
      </div>

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
        <TextField
          id="password"
          label="Hasło"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          hint={
            <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">
              Nie pamiętasz hasła?
            </Link>
          }
        />
        <button
          type="submit"
          className="mt-2 h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Zaloguj się
        </button>
      </form>
    </AuthShell>
  )
}
