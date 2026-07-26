'use client'

import { useCallback, useEffect, useState } from 'react'

export type StudyMode = 'normal' | 'kilearn'
export type StudyDirection = 'term-to-definition' | 'definition-to-term'
export type CardResult = 'correct' | 'wrong'

type StudyProgressData = {
  mode: StudyMode
  direction: StudyDirection
  progressTrackingEnabled: boolean
  currentIndex: number
  results: Record<string, CardResult>
  // 'first-pass' = normalna kolejność wszystkich fiszek.
  // 'repeat-wrong' = powtarzamy tylko te oznaczone jako "źle", aż wszystkie będą "dobrze".
  phase: 'first-pass' | 'repeat-wrong'
}

const DEFAULTS: StudyProgressData = {
  mode: 'kilearn', // domyślny tryb to KILearn, zgodnie z ustaleniami
  direction: 'term-to-definition', // domyślnie pojęcie -> definicja
  progressTrackingEnabled: true,
  currentIndex: 0,
  results: {},
  phase: 'first-pass',
}

function storageKey(setId: string) {
  return `kilearn:study-progress:${setId}`
}

function loadProgress(setId: string): StudyProgressData {
  try {
    const raw = localStorage.getItem(storageKey(setId))
    if (!raw) return { ...DEFAULTS }
    return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<StudyProgressData>) }
  } catch {
    return { ...DEFAULTS }
  }
}

function saveProgress(setId: string, data: StudyProgressData) {
  localStorage.setItem(storageKey(setId), JSON.stringify(data))
}

export function useStudyProgress(setId: string, allCardIds: string[]) {
  const [data, setData] = useState<StudyProgressData>(() => loadProgress(setId))

  useEffect(() => {
    setData(loadProgress(setId))
  }, [setId])

  useEffect(() => {
    saveProgress(setId, data)
  }, [setId, data])

  const setMode = useCallback((mode: StudyMode) => {
    setData((d) => ({ ...d, mode }))
  }, [])

  const setDirection = useCallback((direction: StudyDirection) => {
    setData((d) => ({ ...d, direction }))
  }, [])

  const setProgressTrackingEnabled = useCallback((enabled: boolean) => {
    setData((d) => ({ ...d, progressTrackingEnabled: enabled }))
  }, [])

  const reset = useCallback(() => {
    setData((d) => ({ ...d, currentIndex: 0, results: {}, phase: 'first-pass' }))
  }, [])

  // Kolejka fiszek do pokazania w bieżącej fazie: wszystkie, albo tylko te
  // oznaczone jako "źle" (w fazie powtórki błędnych odpowiedzi).
  const activeCardIds = data.phase === 'repeat-wrong'
    ? allCardIds.filter((id) => data.results[id] === 'wrong')
    : allCardIds

  const isCompleted = data.phase === 'repeat-wrong' && activeCardIds.length === 0

  const markResult = useCallback((cardId: string, result: CardResult) => {
    setData((d) => ({
      ...d,
      results: { ...d.results, [cardId]: result },
    }))
  }, [])

  // Przechodzi do kolejnej fiszki; jeśli to koniec bieżącej fazy, decyduje
  // czy przejść do powtórki błędnych, czy zakończyć sesję.
  const advance = useCallback(() => {
    setData((d) => {
      const queue = d.phase === 'repeat-wrong'
        ? allCardIds.filter((id) => d.results[id] === 'wrong')
        : allCardIds

      const nextIndex = d.currentIndex + 1

      if (nextIndex < queue.length) {
        return { ...d, currentIndex: nextIndex }
      }

      // koniec bieżącej kolejki — sprawdź czy zostały jakieś błędne fiszki
      const stillWrong = allCardIds.filter((id) => d.results[id] === 'wrong')
      if (stillWrong.length === 0) {
        return { ...d, currentIndex: nextIndex, phase: 'repeat-wrong' } // isCompleted=true (activeCardIds puste)
      }

      return { ...d, currentIndex: 0, phase: 'repeat-wrong' }
    })
  }, [allCardIds])

  return {
    mode: data.mode,
    setMode,
    direction: data.direction,
    setDirection,
    progressTrackingEnabled: data.progressTrackingEnabled,
    setProgressTrackingEnabled,
    currentIndex: data.currentIndex,
    activeCardIds,
    isCompleted,
    markResult,
    advance,
    reset,
  }
}
