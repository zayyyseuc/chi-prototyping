import { sessions } from '../data/sessions'
import { getPeople, getPersonEntries } from '../lib/people'
import type { Route } from '../lib/route'
import { SectionNav } from './SectionNav'

const dayLabel = (date: string) => new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short' })
const people = getPeople(sessions)

export function PeoplePage({ person, onGo }: { person?: string; onGo: (route: Route) => void }) {
  const entries = person ? getPersonEntries(sessions, person) : []

  return (
    <main className="section-page">
      <header className="site-header shell">
        <span className="wordmark">CHI 2027</span>
        <SectionNav current="people" onGo={onGo} />
      </header>
      <div className="section-body shell">
        <h1>People</h1>
        <div className="people-layout">
          <ul className="people-list">
            {people.map((name) => (
              <li key={name}>
                <button type="button" className={name === person ? 'is-active' : ''} aria-pressed={name === person} onClick={() => onGo({ view: 'people', person: name })}>
                  {name}
                </button>
              </li>
            ))}
          </ul>
          {person && (
            <section className="section-panel" aria-label={person}>
              <h2>{person}</h2>
              <ul className="link-list">
                {entries.map((entry) => (
                  <li key={`${entry.sessionId}-${entry.contentTitle}`}>
                    <button type="button" onClick={() => onGo({ view: 'session', id: entry.sessionId })}>
                      <strong>{entry.contentTitle}</strong>
                      <span>{dayLabel(entry.date)} {entry.startTime} · {entry.room} · {entry.sessionTitle}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </main>
  )
}
