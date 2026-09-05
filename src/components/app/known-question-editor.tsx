'use client'

import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Trash2,
  Save,
} from 'lucide-react'
import type { KnownQuestion } from '@/lib/types'
import { cn } from '@/lib/utils'

type KnownQuestionEditorProps = {
  question: KnownQuestion
  onBack: () => void
  onDelete: (id: string) => void
  onChangeTitle: (id: string, title: string) => void
  onChangeContent: (id: string, content: string) => void
}

export function KnownQuestionEditor({
  question,
  onBack,
  onDelete,
  onChangeTitle,
  onChangeContent,
}: KnownQuestionEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const saveTimerRef = useRef<number | null>(null)
  const [title, setTitle] = useState(question.title)
  const [saved, setSaved] = useState(false)

  // Ustawiamy treść TYLKO raz (po zamontowaniu / zmianie pytania), żeby
  // re-render po autozapisie nie nadpisywał DOM-u i nie gubił liter/kursora.
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = question.content
    }
    return () => {
      if (saveTimerRef.current !== null) window.clearTimeout(saveTimerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id])

  function exec(command: string, value?: string) {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    scheduleSave()
  }

  function scheduleSave() {
    setSaved(false)
    if (saveTimerRef.current !== null) window.clearTimeout(saveTimerRef.current)
    saveTimerRef.current = window.setTimeout(() => {
      saveTimerRef.current = null
      flushSave()
      setSaved(true)
    }, 500)
  }

  function flushSave() {
    if (saveTimerRef.current !== null) {
      window.clearTimeout(saveTimerRef.current)
      saveTimerRef.current = null
    }
    if (editorRef.current) {
      onChangeContent(question.id, editorRef.current.innerHTML)
    }
    setSaved(true)
  }

  function commitTitle(value: string) {
    setTitle(value)
    onChangeTitle(question.id, value)
  }

  function handleDelete() {
    if (!confirm('Usunąć to pytanie? Tej operacji nie można cofnąć.')) return
    onDelete(question.id)
  }

  const toolbarBtn =
    'flex size-8 items-center justify-center rounded-lg text-foreground/70 transition-colors hover:bg-muted hover:text-foreground'

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Wróć do pytań
        </button>

        <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
          <Save className="size-3.5 text-positive" />
          {saved ? 'Zapisano' : 'Zapisywane automatycznie...'}
        </span>
      </div>

      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-1 border-b border-border bg-panel-accent/40 px-3 py-2">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec('bold')}
            className={toolbarBtn}
            title="Pogrubienie"
          >
            <Bold className="size-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec('italic')}
            className={toolbarBtn}
            title="Kursywa"
          >
            <Italic className="size-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec('underline')}
            className={toolbarBtn}
            title="Podkreślenie"
          >
            <Underline className="size-4" />
          </button>

          <span className="mx-1 h-5 w-px bg-border" />

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec('formatBlock', 'H2')}
            className={toolbarBtn}
            title="Nagłówek 1"
          >
            <Heading1 className="size-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec('formatBlock', 'H3')}
            className={toolbarBtn}
            title="Nagłówek 2"
          >
            <Heading2 className="size-4" />
          </button>

          <span className="mx-1 h-5 w-px bg-border" />

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec('insertUnorderedList')}
            className={toolbarBtn}
            title="Lista punktowana"
          >
            <List className="size-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec('insertOrderedList')}
            className={toolbarBtn}
            title="Lista numerowana"
          >
            <ListOrdered className="size-4" />
          </button>

          <span className="flex-1" />

          <button
            type="button"
            onClick={handleDelete}
            className={cn(toolbarBtn, 'hover:bg-destructive/10 hover:text-destructive')}
            title="Usuń pytanie"
          >
            <Trash2 className="size-4" />
          </button>
        </div>

        <div className="flex flex-col gap-2 p-5">
          <input
            value={title}
            onChange={(e) => commitTitle(e.target.value)}
            onBlur={() => setSaved(true)}
            placeholder="Wpisz treść pytania..."
            className="w-full bg-transparent text-xl font-semibold text-card-foreground placeholder:text-muted-foreground focus-visible:outline-none"
          />

          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={scheduleSave}
            onBlur={flushSave}
            className="min-h-96 w-full cursor-text rounded-2xl border border-border bg-background/40 p-4 text-sm leading-relaxed text-card-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 [&_h2]:mb-2 [&_h2]:mt-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mb-1.5 [&_h3]:mt-2.5 [&_h3]:text-base [&_h3]:font-semibold [&_ul]:ml-4 [&_ul]:list-disc [&_ol]:ml-4 [&_ol]:list-decimal [&_li]:my-1"
          />

          <span className="text-right text-xs text-muted-foreground/70 sm:hidden">Zapisywane automatycznie</span>
        </div>
      </div>
    </div>
  )
}
