import { PageHeader } from '@/components/app/page-header'
import {KnownQuestionsView} from '@/components/app/known-questions-view'

export function KnownQuestionsPage() {
    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Polski - Schowek Wiedzy"
                description="Tutaj znajdziesz wszystkie pytania jawne, które zostały zapisane w Twoim schowku wiedzy."
            />
            <KnownQuestionsView/>
        </div>
    )
}