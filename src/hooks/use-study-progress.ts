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

// Stan "świeżo po ukończeniu": wraca do first-pass i czyści wyniki, ale
// ZACHOWUJE wybrane przez użytkownika mode/direction/progressTrackingEnabled
// — reset dotyczy tylko postępu, nie preferencji nauki.
function freshPass(d: StudyProgressData): StudyProgressData {
  return { ...d, currentIndex: 0, results: {}, phase: 'first-pass' }
}

export function useStudyProgress(setId: string, allCardIds: string[]) {
  const [data, setData] = useState<StudyProgressData>(() => loadProgress(setId))

  // Przy (ponownym) wejściu w sesję nauki danego zestawu: jeśli poprzedni
  // stan to już ukończony przebieg (faza powtórki bez nic do powtórzenia),
  // od razu zaczynamy czysto. Dzięki temu "Rozpocznij naukę" zawsze działa
  // od razu, bez ręcznego resetu w zębatce po wcześniejszym ukończeniu.
  useEffect(() => {
    const loaded = loadProgress(setId)
    const loadedIsCompleted =
      loaded.phase === 'repeat-wrong' &&
      allCardIds.filter((id) => loaded.results[id] === 'wrong').length === 0 &&
      allCardIds.some((id) => loaded.results[id] !== undefined) // było w ogóle cokolwiek ocenione

    setData(loadedIsCompleted ? freshPass(loaded) : loaded)
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setData((d) => freshPass(d))
  }, [])

  // Kolejka fiszek do pokazania w bieżącej fazie: wszystkie, albo tylko te
  // oznaczone jako "źle" (w fazie powtórki błędnych odpowiedzi).
  const activeCardIds = data.phase === 'repeat-wrong'
    ? allCardIds.filter((id) => data.results[id] === 'wrong')
    : allCardIds

  // Ukończone = byliśmy w fazie powtórki i nic już nie zostało do powtórzenia.
  // To stan WYŚWIETLANY (żeby pokazać ekran "Ukończyłeś zestaw!"), ale NIE
  // jest utrwalany — patrz advance(), który od razu po wejściu w ten stan
  // czyści wyniki, więc kolejne "Rozpocznij naukę" zawsze zaczyna od zera.
  const isCompleted = data.phase === 'repeat-wrong' && activeCardIds.length === 0

  const markResult = useCallback((cardId: string, result: CardResult) => {
    setData((d) => ({
      ...d,
      results: { ...d.results, [cardId]: result },
    }))
  }, [])

  const markStatus = useCallback((cardId: string) => {
    //sprawdzamy czy karta ma juz wynik i go zwracamy

    if (data.results[cardId] !== undefined) {
      return data.results[cardId]
    }
  }, [data?.results])

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
        // Zestaw ukończony. Zostajemy w tym stanie (isCompleted=true), żeby
        // pokazać ekran "Ukończyłeś zestaw!" — same postępy czyścimy dopiero
        // przy KOLEJNYM wejściu w naukę tego zestawu (patrz efekt wyżej),
        // żeby ekran ukończenia zdążył się wyświetlić.
        return { ...d, currentIndex: nextIndex, phase: 'repeat-wrong' }
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
    markStatus,
    advance,
    reset,
  }
}
