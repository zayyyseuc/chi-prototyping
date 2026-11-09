import type { ReactElement } from 'react'
import { getRoomNotes, type RoomNoteKey } from '../lib/access'

export type IconKind = RoomNoteKey | 'planned' | 'conflict' | 'saved'

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

const icons: Record<IconKind, ReactElement> = {
  planned: (
    <g {...stroke}><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4M9 15l2 2 4-4" /></g>
  ),
  conflict: (
    <g {...stroke}><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4M12 13v3M12 18.2h.01" /></g>
  ),
  saved: (
    <g {...stroke}><path d="M7 4h10v16l-5-3.5L7 20z" /></g>
  ),
  crowded: (
    <g {...stroke}><circle cx="8" cy="8" r="2.5" /><path d="M3 19c0-3 2.2-5 5-5s5 2 5 5" /><circle cx="16.5" cy="9" r="2" /><path d="M15 14.3c3-.6 6 1.2 6 4.7" /></g>
  ),
  loud: (
    <g {...stroke}><path d="M4 9.5v5h3.5L12 18V6L7.5 9.5z" /><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" /></g>
  ),
  'no-step-free': (
    <g {...stroke}><path d="M3 19h4v-4h4v-4h4V7h6" /><path d="M4 4l16 16" /></g>
  ),
  warm: (
    <g {...stroke}><circle cx="12" cy="12" r="3.6" /><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8" /></g>
  ),
  cool: (
    <g {...stroke}><path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9" /><path d="M10 4.5l2 1.8 2-1.8M10 19.5l2-1.8 2 1.8" /></g>
  ),
  unknown: (
    <g {...stroke} strokeDasharray="2.5 2.5"><circle cx="12" cy="12" r="9" /><path strokeDasharray="none" d="M9.5 9.5a2.5 2.5 0 1 1 3.6 2.3c-.8.4-1.1 1-1.1 1.8M12 17h.01" /></g>
  ),
}

export function NoteIcon({ kind, size = 16 }: { kind: IconKind; size?: number }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">{icons[kind]}</svg>
}

// Room accessibility/comfort info as icons. `labeled` adds the text (used on the Map page).
export function RoomNotes({ room, labeled = false }: { room: string; labeled?: boolean }) {
  const notes = getRoomNotes(room)
  if (notes.length === 0) return null
  return (
    <ul className={`room-notes ${labeled ? 'is-labeled' : ''}`}>
      {notes.map((note) => (
        <li key={note.key} className={`note-${note.key}`} title={note.label} aria-label={labeled ? undefined : note.label}>
          <NoteIcon kind={note.key} />
          {labeled && <span>{note.label}</span>}
        </li>
      ))}
    </ul>
  )
}
