'use client'

import { useCallback, useEffect, useState } from 'react'
import type { KnownQuestion, Lecture } from '@/lib/types'
import { generateId, nowIso, readAll, writeAll } from '@/lib/local-store'

const LECTURES_KEY = 'known-questions:lectures'
const QUESTIONS_KEY = 'known-questions:questions'

const CHANGE_EVENT = 'kilearn:known-questions-changed'

async function loadLectures(): Promise<Lecture[]> {
  return readAll<Lecture>(LECTURES_KEY)
}

async function loadQuestions(): Promise<KnownQuestion[]> {
  return readAll<KnownQuestion>(QUESTIONS_KEY)
}

async function notify() {
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT))
}

export function useKnownQuestions() {
  const [lectures, setLectures] = useState<Lecture[]>([])
  const [questions, setQuestions] = useState<KnownQuestion[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    Promise.all([loadLectures(), loadQuestions()]).then(([l, q]) => {
      setLectures(l)
      setQuestions(q)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    refresh()
    window.addEventListener(CHANGE_EVENT, refresh)
    return () => window.removeEventListener(CHANGE_EVENT, refresh)
  }, [refresh])

  const createLecture = useCallback(async (name: string): Promise<Lecture> => {
    const trimmed = name.trim()
    const current = await loadLectures()
    const lecture: Lecture = {
      id: generateId(),
      name: trimmed,
      createdAt: nowIso(),
    }
    await writeAll(LECTURES_KEY, [...current, lecture])
    await notify()
    return lecture
  }, [])

  const renameLecture = useCallback(async (id: string, name: string): Promise<void> => {
    const current = await loadLectures()
    const updated = current.map((l) => (l.id === id ? { ...l, name: name.trim() } : l))
    await writeAll(LECTURES_KEY, updated)
    await notify()
  }, [])

  const deleteLecture = useCallback(async (id: string): Promise<void> => {
    const lectures = await loadLectures()
    const questions = await loadQuestions()
    await writeAll(
      LECTURES_KEY,
      lectures.filter((l) => l.id !== id),
    )
    await writeAll(
      QUESTIONS_KEY,
      questions.filter((q) => q.lectureId !== id),
    )
    await notify()
  }, [])

  const createQuestion = useCallback(
    async (lectureId: string, title?: string): Promise<KnownQuestion> => {
      const trimmedTitle = (title ?? '').trim() || 'Bez tytułu'
      const current = await loadQuestions()
      const now = nowIso()
      const question: KnownQuestion = {
        id: generateId(),
        lectureId,
        title: trimmedTitle,
        content: '',
        createdAt: now,
        updatedAt: now,
      }
      await writeAll(QUESTIONS_KEY, [...current, question])
      await notify()
      return question
    },
    [],
  )

  const updateQuestion = useCallback(
    async (id: string, patch: Partial<Pick<KnownQuestion, 'title' | 'content'>>): Promise<void> => {
      const current = await loadQuestions()
      const updated = current.map((q) =>
        q.id === id ? { ...q, ...patch, updatedAt: nowIso() } : q,
      )
      await writeAll(QUESTIONS_KEY, updated)
      await notify()
    },
    [],
  )

  const deleteQuestion = useCallback(async (id: string): Promise<void> => {
    const current = await loadQuestions()
    await writeAll(
      QUESTIONS_KEY,
      current.filter((q) => q.id !== id),
    )
    await notify()
  }, [])

  return {
    lectures,
    questions,
    loading,
    createLecture,
    renameLecture,
    deleteLecture,
    createQuestion,
    updateQuestion,
    deleteQuestion,
  }
}
