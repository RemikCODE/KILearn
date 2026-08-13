import type { JSONStroke, CheckRequest, CheckResponse } from '@/lib/types'
import type { StudyDirection } from '@/hooks/use-study-progress'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
const ENDPOINT_SPRAWDZ_PISMO = `${API_URL}/check`

export async function SendData(
    strokes: JSONStroke[],
    pojecie: string,
    definicja: string,
    kierunek: StudyDirection,
): Promise<CheckResponse> {
    
    const target = kierunek === 'term-to-definition' ? definicja : pojecie
    const wysylka: CheckRequest = { strokes, target }

    try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000)

        const response = await fetch(ENDPOINT_SPRAWDZ_PISMO, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(wysylka),
            signal: controller.signal
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
            throw new Error(`Serwer zgłosił problem (Status: ${response.status}). Spróbuj ponownie później.`)
        }

        const data: CheckResponse = await response.json()
        
        return data

    } catch (error: any) {
        if (error.name === 'AbortError') {
            throw new Error('Połączenie z serwerem trwało zbyt długo. Sprawdź swój internet.')
        }
        
        throw new Error(error.message || 'Brak połączenia z internetem. Upewnij się, że jesteś online.')
    }
}
