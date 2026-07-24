import { Routes, Route } from 'react-router-dom'
import { MainLayout } from '@/components/app/main-layout'
import { LoginPage } from '@/pages/login'
import { RegisterPage } from '@/pages/register'
import { ForgotPasswordPage } from '@/pages/forgot-password'
import { DashboardPage } from '@/pages/dashboard'
import { FlashcardsPage } from '@/pages/flashcards'
import { FlashcardSetPage } from '@/pages/flashcard-set'
import { NewFlashcardSetPage } from '@/pages/new-flashcard-set'
import { NotificationsPage } from '@/pages/notifications'
import { PremiumPage } from '@/pages/premium'
import { SettingsPage } from '@/pages/settings'
import { TutorPage } from '@/pages/tutor'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/flashcards" element={<FlashcardsPage />} />
        <Route path="/flashcards/new" element={<NewFlashcardSetPage />} />
        <Route path="/flashcards/:id" element={<FlashcardSetPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/tutor" element={<TutorPage />} />
      </Route>
    </Routes>
  )
}
