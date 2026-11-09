import { plannedSessionIds, savedContentIds } from '../data/mine'
import { sessions } from '../data/sessions'
import type { Route } from '../lib/route'
import { NoteIcon } from './RoomNotes'
import { SectionNav } from './SectionNav'

const dayLabel = (date: string) => new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short' })

export function MyPage({ onGo }: { onGo: (route: Route) => void }) {
  const planned = sessions.filter((session) => plannedSessionIds.includes(session.id))
  const saved = sessions.flatMap((session) =>
    session.contents.filter((content) => savedContentIds.includes(content.id)).map((content) => ({ content, session })),
  )

  return (
    <main className="section-page">
      <header className="site-header shell">
        <span className="wordmark">CHI 2027</span>
        <SectionNav current="my" onGo={onGo} />
      </header>
      <div className="section-body shell">
        <h1>My</h1>
        <div className="map-layout">
          <section className="section-panel" aria-label="Schedule">
            <h2><NoteIcon kind="planned" size={22} /></h2>
            <ul className="link-list">
              {planned.map((session) => (
                <li key={session.id}>
                  <button type="button" onClick={() => onGo({ view: 'session', id: session.id })}>
                    <strong>{session.title}</strong>
                    <span>{dayLabel(session.date)} {session.startTime} · {session.room}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
          <section className="section-panel" aria-label="Saved papers">
            <h2><NoteIcon kind="saved" size={22} /></h2>
            <ul className="link-list">
              {saved.map(({ content, session }) => (
                <li key={content.id}>
                  <button type="button" onClick={() => onGo({ view: 'session', id: session.id })}>
                    <strong>{content.title}</strong>
                    <span>{session.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  )
}
