import { savedContentIds } from '../data/mine'
import { conferenceDays, sessions } from '../data/sessions'
import { getSavedLinks, getSessionsByTopic } from '../lib/relevance'
import type { Route } from '../lib/route'
import type { Session } from '../types'
import { RoomMap } from './RoomMap'
import { ContentItem } from './ContentItem'

export function SessionDetail({ session, onBack, onGo, topic, onTopic }: { session: Session; onBack: () => void; onGo: (route: Route) => void; topic: string | null; onTopic: (keyword: string) => void }) {
  // The topic is shared with the Program page. Only dim papers here if this session actually touches it.
  const touches = topic !== null && session.contents.some((content) => content.keywords.some((keyword) => keyword.toLowerCase() === topic))
  const activeKeyword = touches ? topic : null
  const elsewhere = topic ? getSessionsByTopic(sessions, topic).filter((other) => other.id !== session.id) : []
  const day = conferenceDays.find((item) => item.id === session.date)

  return (
    <main className="detail-page">
      <div className="detail-nav shell">
        <button type="button" className="back-button" onClick={onBack}><span aria-hidden="true">←</span> Program</button>
      </div>

      <header className="detail-hero shell">
        <p className="eyebrow">{session.category}</p>
        <h1>{session.title}</h1>
        <p className="detail-description">{session.description}</p>
      </header>

      <div className="detail-layout shell">
        <aside className="detail-meta" aria-label="Session information">
          <dl>
            <div><dt>Date</dt><dd>{day?.longDate}</dd></div>
            <div><dt>Time</dt><dd>{session.startTime}–{session.endTime}</dd></div>
            <div><dt>Room</dt><dd><button type="button" className="room-link" onClick={() => onGo({ view: 'map', room: session.room })}><RoomMap room={session.room} />{session.room}</button></dd></div>
          </dl>
          <div className="detail-keywords">
            {session.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}
          </div>
          {elsewhere.length > 0 && (
            <ul className="link-list elsewhere">
              {elsewhere.map((other) => (
                <li key={other.id}>
                  <button type="button" onClick={() => onGo({ view: 'session', id: other.id })}>
                    <strong>{other.title}</strong>
                    <span>{new Date(`${other.date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short' })} {other.startTime}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <section className="contents-list" aria-labelledby="contents-title">
          <h2 id="contents-title" className="sr-only">Contents</h2>
          {session.contents.map((content, index) => <ContentItem
            key={content.id}
            content={content}
            index={index}
            sessionId={session.id}
            savedLink={getSavedLinks(sessions, content.id, savedContentIds)[0]}
            onGo={onGo}
            activeKeyword={activeKeyword}
            onKeyword={onTopic}
          />)}
        </section>
      </div>
    </main>
  )
}
