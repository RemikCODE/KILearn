'use client'

import { useState } from 'react'
import {
  BookOpen,
  ChevronDown,
  FileText,
  FolderPlus,
  Plus,
  Trash2,
} from 'lucide-react'
import { useKnownQuestions } from '@/hooks/use-known-questions'
import { KnownQuestionsExplorer } from '@/components/app/known-questions-explorer'
import { KnownQuestionEditor } from '@/components/app/known-question-editor'
import type { KnownQuestion } from '@/lib/types'
import { cn } from '@/lib/utils'

export function KnownQuestionsView() {
  const {
    lectures,
    questions,
    createLecture,
    deleteLecture,
    createQuestion,
    updateQuestion,
    deleteQuestion,
  } = useKnownQuestions()

  const [explorerOpen, setExplorerOpen] = useState(false)
  const [selectedLectureId, setSelectedLectureId] = useState<string | null>(null)
  const [editingQuestion, setEditingQuestion] = useState<KnownQuestion | null>(null)

  const selectedLecture = lectures.find((l) => l.id === selectedLectureId) ?? null
  const lectureQuestions = questions
    .filter((q) => q.lectureId === selectedLectureId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  function handleSelectLecture(id: string) {
    setSelectedLectureId(id)
    setEditingQuestion(null)
  }

  async function handleAddQuestion() {
    if (!selectedLectureId) return
    const q = await createQuestion(selectedLectureId)
    setEditingQuestion(q)
  }

  if (editingQuestion) {
    return (
      <KnownQuestionEditor
        question={editingQuestion}
        onBack={() => setEditingQuestion(null)}
        onDelete={(id) => {
          deleteQuestion(id)
          setEditingQuestion(null)
        }}
        onChangeTitle={(id, title) => updateQuestion(id, { title })}
        onChangeContent={(id, content) => updateQuestion(id, { content })}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Pasek wyboru lektury */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setExplorerOpen(true)}
          className="flex h-11 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium text-card-foreground shadow-sm transition-colors hover:bg-accent"
        >
          <BookOpen className="size-4 text-brand" />
          {selectedLecture ? selectedLecture.name : 'Wybierz lekturę'}
          <ChevronDown className="size-4 text-muted-foreground" />
        </button>

        <button
          type="button"
          onClick={() => setExplorerOpen(true)}
          className="flex h-11 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-brand-foreground shadow-sm shadow-brand/30 transition-colors hover:bg-brand/90"
        >
          <FolderPlus className="size-4" />
          Dodaj lekturę
        </button>
      </div>

      {/* Zawartość wybranej lektury */}
      {selectedLecture ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-2xl bg-brand/15 text-brand">
                <BookOpen className="size-5" />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-card-foreground">{selectedLecture.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {lectureQuestions.length}{' '}
                  {lectureQuestions.length === 1 ? 'pytanie' : 'pytań'} w tej lekturze
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddQuestion}
              className="flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-brand-foreground shadow-sm shadow-brand/30 transition-colors hover:bg-brand/90"
            >
              <Plus className="size-4" />
              Nowe pytanie
            </button>
          </div>

          {lectureQuestions.length === 0 ? (
            <button
              type="button"
              onClick={handleAddQuestion}
              className="flex flex-col items-center gap-2 rounded-3xl border-2 border-dashed border-border bg-card/60 p-10 text-center transition-colors hover:border-ring hover:bg-card"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-brand/15 text-brand">
                <FileText className="size-6" />
              </span>
              <span className="font-medium text-card-foreground">Brak pytań w tej lekturze</span>
              <span className="text-sm text-muted-foreground">
                Kliknij, aby dodać pierwsze pytanie jawne
              </span>
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-foreground/80">Pytania do lektury</h3>
              {lectureQuestions.map((q, i) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setEditingQuestion(q)}
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-card/80 p-4 text-left backdrop-blur-sm transition-colors hover:border-ring hover:bg-card"
                >
                  <span className="w-6 shrink-0 text-sm font-medium text-muted-foreground">
                    {i + 1}
                  </span>
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                    <FileText className="size-4" />
                  </span>
                  <span className="flex-1 truncate font-medium text-card-foreground">{q.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(q.updatedAt).toLocaleDateString('pl-PL')}
                  </span>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm(`Usunąć pytanie "${q.title}"?`)) deleteQuestion(q.id)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.stopPropagation()
                        deleteQuestion(q.id)
                      }
                    }}
                    title="Usuń pytanie"
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                  >
                    <Trash2 className="size-4" />
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setExplorerOpen(true)}
          className={cn(
            'flex flex-col items-center gap-2 rounded-3xl border-2 border-dashed border-border bg-card/60 p-10 text-center transition-colors hover:border-ring hover:bg-card',
          )}
        >
          <span className="flex size-12 items-center justify-center rounded-2xl bg-brand/15 text-brand">
            <FolderPlus className="size-6" />
          </span>
          <span className="font-medium text-card-foreground">Wybierz lekturę</span>
          <span className="text-sm text-muted-foreground">
            Otwórz eksplorator, żeby wybrać lub dodać lekturę z pytaniami jawnymi
          </span>
        </button>
      )}

      <KnownQuestionsExplorer
        open={explorerOpen}
        lectures={lectures}
        selectedLectureId={selectedLectureId}
        onClose={() => setExplorerOpen(false)}
        onSelect={handleSelectLecture}
        onCreateLecture={createLecture}
        onDeleteLecture={deleteLecture}
      />
    </div>
  )
}
