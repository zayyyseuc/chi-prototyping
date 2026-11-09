import type { Interest } from '../data/interests'
import { plannedSessionIds } from '../data/mine'
import { sessions } from '../data/sessions'
import { overlapsPlan } from '../lib/access'
import type { Route } from '../lib/route'
import type { Session } from '../types'
import { AccessPreview } from './AccessPreview'
import { RoomMap } from './RoomMap'

interface Props {
  session: Session
  interests: Interest[]
  topicState: 'none' | 'match' | 'dim'
  activeTopic: string | null
  onTopic: (keyword: string) => void
  onGo: (route: Route) => void
}

export function SessionCard({ session, interests, topicState, activeTopic, onTopic, onGo }: Props) {
  const planned = plannedSessionIds.includes(session.id)
  const conflict = overlapsPlan(session, sessions, plannedSessionIds)

  return (
    <article className={`session-card topic-${topicState} ${conflict ? 'is-conflict' : planned ? 'is-planned' : ''}`}>
      <div className="card-head">
        <span className="category">{session.category}</span>
        <span className="card-link" aria-hidden="true">↗</span>
      </div>
      <h3>
        <button type="button" className="card-open" onClick={() => onGo({ view: 'session', id: session.id })}>{session.title}</button>
      </h3>
      <dl className="card-meta">
        <div><dt>Time</dt><dd>{session.startTime}–{session.endTime}</dd></div>
        <div>
          <dt>Room</dt>
          <dd>
            <button type="button" className="room-link" onClick={() => onGo({ view: 'map', room: session.room })}>
              <RoomMap room={session.room} />{session.room}
            </button>
          </dd>
        </div>
      </dl>
      <p className="card-description">{session.description}</p>

      <div className="card-extras">
        <div className="keyword-list" aria-label="Session keywords">
          {session.keywords.slice(0, 4).map((keyword) => (
            <button
              type="button"
              key={keyword}
              className={activeTopic === keyword.toLowerCase() ? 'is-active' : ''}
              aria-pressed={activeTopic === keyword.toLowerCase()}
              onClick={() => onTopic(keyword)}
            >
              {keyword}
            </button>
          ))}
        </div>

        <AccessPreview session={session} interests={interests} onGo={onGo} />
      </div>
    </article>
  )
}
