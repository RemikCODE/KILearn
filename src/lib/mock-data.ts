// Mockowane dane, których jeszcze nie zastąpiliśmy realną logiką/backendem.
//
// Zestawy fiszek i kategorie NIE są już tutaj — żyją w useFlashcardSets /
// useCategories (localStorage, gotowe pod Supabase). Aplikacja startuje
// pusta, bez seedowanych przykładowych danych.

import type { User, AppNotification } from '@/lib/types'

export const mockUser: User = {
  id: 'local-user',
  name: 'Ola Kowalska',
  email: 'ola.kowalska@gmail.com',
  avatar: '/user-avatar.png',
  plan: 'free',
}

export const notifications: AppNotification[] = []

export const tutorMethods = [
  {
    id: 'm1',
    title: 'Metoda równań',
    description: 'Rozwiążemy zadanie budując i przekształcając równanie krok po kroku.',
  },
  {
    id: 'm2',
    title: 'Metoda graficzna',
    description: 'Naszkicujemy sytuację i odczytamy rozwiązanie z wykresu.',
  },
  {
    id: 'm3',
    title: 'Metoda prób i szacowania',
    description: 'Zaczniemy od oszacowania wyniku i będziemy go stopniowo uściślać.',
  },
]

export const dashboardStats = [
  { label: 'Do powtórki dziś', value: '0', unit: 'słówek' },
  { label: 'Seria nauki', value: '0', unit: 'dni' },
  { label: 'Opanowane', value: '0', unit: 'fiszek' },
]
