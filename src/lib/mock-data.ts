// Mocked data for the KILearn UI. Replace with real API/Supabase calls later.

export type User = {
  name: string
  email: string
  avatar: string
  plan: 'free' | 'premium'
}

export type Flashcard = {
  id: string
  term: string
  definition: string
}

export type FlashcardSet = {
  id: string
  title: string
  description: string
  color: string // token-based accent used for the cover
  cardCount: number
  lastStudied: string
  folderId: string | null
  cards: Flashcard[]
}

export type Folder = {
  id: string
  name: string
  setCount: number
}

export type AppNotification = {
  id: string
  title: string
  body: string
  time: string
  unread: boolean
  type: 'reminder' | 'ai' | 'system'
}

export const mockUser: User = {
  name: 'Ola Kowalska',
  email: 'ola.kowalska@gmail.com',
  avatar: '/user-avatar.png',
  plan: 'free',
}

export const folders: Folder[] = [
  { id: 'f1', name: 'Angielski', setCount: 3 },
  { id: 'f2', name: 'Biologia', setCount: 2 },
  { id: 'f3', name: 'Historia', setCount: 1 },
]

export const flashcardSets: FlashcardSet[] = [
  {
    id: 's1',
    title: 'Angielski — Phrasal Verbs',
    description: 'Najważniejsze czasowniki frazowe do matury',
    color: 'brand',
    cardCount: 24,
    lastStudied: 'wczoraj',
    folderId: 'f1',
    cards: [
      { id: 'c1', term: 'give up', definition: 'poddać się, zrezygnować' },
      { id: 'c2', term: 'look after', definition: 'opiekować się' },
      { id: 'c3', term: 'run into', definition: 'natknąć się na kogoś' },
      { id: 'c4', term: 'put off', definition: 'odkładać na później' },
      { id: 'c5', term: 'carry on', definition: 'kontynuować' },
    ],
  },
  {
    id: 's2',
    title: 'Biologia — Komórka',
    description: 'Budowa i funkcje organelli komórkowych',
    color: 'primary',
    cardCount: 18,
    lastStudied: '3 dni temu',
    folderId: 'f2',
    cards: [
      { id: 'c1', term: 'Mitochondrium', definition: 'Centrum energetyczne komórki (ATP)' },
      { id: 'c2', term: 'Rybosom', definition: 'Miejsce syntezy białek' },
      { id: 'c3', term: 'Jądro komórkowe', definition: 'Przechowuje materiał genetyczny' },
      { id: 'c4', term: 'Aparat Golgiego', definition: 'Modyfikuje i sortuje białka' },
    ],
  },
  {
    id: 's3',
    title: 'Historia — II wojna światowa',
    description: 'Kluczowe daty i wydarzenia 1939–1945',
    color: 'chart-5',
    cardCount: 32,
    lastStudied: 'tydzień temu',
    folderId: 'f3',
    cards: [
      { id: 'c1', term: '1 września 1939', definition: 'Wybuch II wojny światowej' },
      { id: 'c2', term: '1 sierpnia 1944', definition: 'Wybuch powstania warszawskiego' },
      { id: 'c3', term: '8 maja 1945', definition: 'Kapitulacja III Rzeszy' },
    ],
  },
  {
    id: 's4',
    title: 'Angielski — Idiomy',
    description: 'Popularne idiomy w mowie potocznej',
    color: 'chart-3',
    cardCount: 15,
    lastStudied: 'dzisiaj',
    folderId: 'f1',
    cards: [
      { id: 'c1', term: 'piece of cake', definition: 'bułka z masłem, coś łatwego' },
      { id: 'c2', term: 'break a leg', definition: 'powodzenia!' },
      { id: 'c3', term: 'hit the books', definition: 'zabrać się do nauki' },
    ],
  },
]

export const notifications: AppNotification[] = [
  {
    id: 'n1',
    title: 'Czas na powtórkę!',
    body: 'Masz 12 słówek do powtórzenia w zestawie „Phrasal Verbs”.',
    time: '2 godz. temu',
    unread: true,
    type: 'reminder',
  },
  {
    id: 'n2',
    title: 'Fiszki wygenerowane',
    body: 'AI utworzyło 18 fiszek ze zdjęcia „Biologia — Komórka”. Sprawdź i zatwierdź.',
    time: '5 godz. temu',
    unread: true,
    type: 'ai',
  },
  {
    id: 'n3',
    title: 'Seria 5 dni!',
    body: 'Świetna robota — uczysz się już 5 dni z rzędu. Tak trzymaj!',
    time: 'wczoraj',
    unread: false,
    type: 'system',
  },
]

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
  { label: 'Do powtórki dziś', value: '12', unit: 'słówek' },
  { label: 'Seria nauki', value: '5', unit: 'dni' },
  { label: 'Opanowane', value: '148', unit: 'fiszek' },
]
