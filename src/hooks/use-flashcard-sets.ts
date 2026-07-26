'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Flashcard, FlashcardSet } from '@/lib/types'
import { generateId, nowIso, readAll, writeAll } from '@/lib/local-store'

const STORAGE_KEY = 'flashcard-sets'
const CHANGE_EVENT = 'kilearn:flashcard-sets-changed'

// Na razie nie ma prawdziwej autentykacji, więc wszystkie zestawy "należą"
// do tego stałego id. Gdy podepniemy Supabase Auth, to id będzie brane
// z sesji zalogowanego użytkownika zamiast tej stałej.
export const CURRENT_USER_ID = 'local-user'

const ACCENT_COLORS = ['brand', 'primary', 'chart-3', 'chart-5'] as const

async function loadSets(): Promise<FlashcardSet[]> {
  return readAll<FlashcardSet>(STORAGE_KEY)
}

async function saveSets(sets: FlashcardSet[]): Promise<void> {
  await writeAll(STORAGE_KEY, sets)
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT))
}

export type CreateSetInput = {
  title: string
  description?: string
  categoryId: string | null
  cards: Array<{ term: string; definition: string }>
}

export function useFlashcardSets() {
  const [sets, setSets] = useState<FlashcardSet[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    loadSets().then((items) => {
      setSets(items)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    refresh()
    window.addEventListener(CHANGE_EVENT, refresh)
    return () => window.removeEventListener(CHANGE_EVENT, refresh)
  }, [refresh])

  const createSet = useCallback(async (input: CreateSetInput): Promise<FlashcardSet> => {
    const current = await loadSets()

    const cards: Flashcard[] = input.cards
      .filter((c) => c.term.trim() !== '' || c.definition.trim() !== '')
      .map((c) => ({ id: generateId(), term: c.term.trim(), definition: c.definition.trim() }))

    const set: FlashcardSet = {
      id: generateId(),
      title: input.title.trim() || 'Bez nazwy',
      description: input.description?.trim() ?? '',
      color: ACCENT_COLORS[current.length % ACCENT_COLORS.length],
      categoryId: input.categoryId,
      cards,
      createdAt: nowIso(),
      lastStudiedAt: null,
      ownerId: CURRENT_USER_ID,
    }

    await saveSets([...current, set])
    return set
  }, [])

  const updateSet = useCallback(async (id: string, patch: Partial<FlashcardSet>): Promise<void> => {
    const current = await loadSets()
    const updated = current.map((s) => (s.id === id ? { ...s, ...patch } : s))
    await saveSets(updated)
  }, [])

  const deleteSet = useCallback(async (id: string): Promise<void> => {
    const current = await loadSets()
    await saveSets(current.filter((s) => s.id !== id))
  }, [])

  const moveToCategory = useCallback(async (id: string, categoryId: string | null): Promise<void> => {
    await updateSet(id, { categoryId })
  }, [updateSet])

  const markStudied = useCallback(async (id: string): Promise<void> => {
    await updateSet(id, { lastStudiedAt: nowIso() })
  }, [updateSet])

  // Kopiuje cudzy zestaw do konta bieżącego użytkownika jako nową,
  // niezależną kopię — oryginał pozostaje nietknięty.
  const copySet = useCallback(async (sourceSet: FlashcardSet): Promise<FlashcardSet> => {
    const current = await loadSets()

    const copy: FlashcardSet = {
      ...sourceSet,
      id: generateId(),
      title: `${sourceSet.title} (kopia)`,
      cards: sourceSet.cards.map((c) => ({ ...c, id: generateId() })),
      createdAt: nowIso(),
      lastStudiedAt: null,
      ownerId: CURRENT_USER_ID,
    }

    await saveSets([...current, copy])
    return copy
  }, [])

  const getById = useCallback(
    (id: string) => sets.find((s) => s.id === id),
    [sets],
  )

  return {
    sets,
    loading,
    createSet,
    updateSet,
    deleteSet,
    moveToCategory,
    markStudied,
    copySet,
    getById,
  }
}
