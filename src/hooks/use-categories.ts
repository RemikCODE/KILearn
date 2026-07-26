'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Category } from '@/lib/types'
import { generateId, nowIso, readAll, writeAll } from '@/lib/local-store'

const STORAGE_KEY = 'categories'

// Prosty event, żeby wiele instancji hooka (np. sidebar + strona /flashcards)
// zobaczyło zmianę natychmiast, bez przeładowania strony.
const CHANGE_EVENT = 'kilearn:categories-changed'

async function loadCategories(): Promise<Category[]> {
  return readAll<Category>(STORAGE_KEY)
}

async function saveCategories(categories: Category[]): Promise<void> {
  await writeAll(STORAGE_KEY, categories)
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT))
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    loadCategories().then((items) => {
      setCategories(items)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    refresh()
    window.addEventListener(CHANGE_EVENT, refresh)
    return () => window.removeEventListener(CHANGE_EVENT, refresh)
  }, [refresh])

  const createCategory = useCallback(async (name: string): Promise<Category> => {
    const trimmed = name.trim()
    const current = await loadCategories()

    const category: Category = {
      id: generateId(),
      name: trimmed,
      createdAt: nowIso(),
    }

    await saveCategories([...current, category])
    return category
  }, [])

  const renameCategory = useCallback(async (id: string, name: string): Promise<void> => {
    const current = await loadCategories()
    const updated = current.map((c) => (c.id === id ? { ...c, name: name.trim() } : c))
    await saveCategories(updated)
  }, [])

  const deleteCategory = useCallback(async (id: string): Promise<void> => {
    const current = await loadCategories()
    await saveCategories(current.filter((c) => c.id !== id))
  }, [])

  return {
    categories,
    loading,
    createCategory,
    renameCategory,
    deleteCategory,
  }
}
