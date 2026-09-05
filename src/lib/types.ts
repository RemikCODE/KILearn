// Współdzielone typy domenowe aplikacji KILearn.
// Kształt tych typów jest celowo zgodny z tym, jak docelowo będą wyglądać
// tabele w Supabase (id jako string/uuid, ownerId, timestampy ISO), żeby
// przejście z localStorage na prawdziwy backend nie wymagało przepisywania
// komponentów, tylko podmianę implementacji hooków/serwisów.
 
export type JSONPunkt ={
  x: number;
  y: number;
  t: number;
}

export type JSONStroke = {
  points: JSONPunkt[];
}

export type CheckRequest = {
  target : string;
  strokes : JSONStroke[];
}

export type CheckResponse = {
  ok: boolean;
  recognized: string;
  target: string;
  confidence: number;
}

export type User = {
  id: string
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

export type Category = {
  id: string
  name: string
  createdAt: string // ISO date
}

export type FlashcardSet = {
  id: string
  title: string
  description: string
  color: string // token-based accent used for the cover
  categoryId: string | null // zestaw należy do co najwyżej jednej kategorii
  cards: Flashcard[]
  createdAt: string // ISO date
  lastStudiedAt: string | null // ISO date, null = nigdy nie uczono się
  ownerId: string // przygotowane pod właściciela zestawu (Supabase auth uid)
}

export type AppNotification = {
  id: string
  title: string
  body: string
  time: string
  unread: boolean
  type: 'reminder' | 'ai' | 'system'
}

// Schowek wiedzy (pytania jawne z polskiego):
// lektura = "folder", notatka = plik z odpowiedzią na konkretne pytanie maturalne.
export type Lecture = {
  id: string
  name: string
  createdAt: string // ISO date
}

export type KnownQuestion = {
  id: string
  lectureId: string // do której lektury (folderu) należy notatka
  title: string
  content: string // HTML treści notatki
  createdAt: string // ISO date
  updatedAt: string // ISO date
}
