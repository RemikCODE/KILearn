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
