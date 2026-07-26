// Prosty, generyczny adapter trwałości danych.
//
// Cel: cała reszta aplikacji (hooki typu useCategories, useFlashcardSets)
// rozmawia z danymi przez async funkcje (readAll/writeAll), a NIE bezpośrednio
// przez `localStorage.getItem`. Dzięki temu podmiana na Supabase później to
// tylko napisanie nowej implementacji tego samego kontraktu, bez zmiany
// komponentów ani hooków, które z niego korzystają.

const PREFIX = 'kilearn:'

export async function readAll<T>(key: string): Promise<T[]> {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (!raw) return []
    return JSON.parse(raw) as T[]
  } catch {
    return []
  }
}

export async function writeAll<T>(key: string, items: T[]): Promise<void> {
  localStorage.setItem(PREFIX + key, JSON.stringify(items))
}

export function generateId(): string {
  return crypto.randomUUID()
}

export function nowIso(): string {
  return new Date().toISOString()
}
