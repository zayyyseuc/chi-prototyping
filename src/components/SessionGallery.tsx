import type { Interest } from '../data/interests'
import { sessions as allSessions } from '../data/sessions'
import { getSessionsByTopic } from '../lib/relevance'
import type { Route } from '../lib/route'
import type { Session } from '../types'
import { SessionCard } from './SessionCard'

interface Props {
  sessions: Session[]
  interests: Interest[]
  topic: string | null
  onTopic: (keyword: string) => void
  onGo: (route: Route) => void
}

export function SessionGallery({ sessions, interests, topic, onTopic, onGo }: Props) {
  const matchIds = new Set(topic ? getSessionsByTopic(allSessions, topic).map((session) => session.id) : [])

  return (
    <section className="session-gallery" aria-label="Sessions">
      {sessions.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          interests={interests}
          topicState={!topic ? 'none' : matchIds.has(session.id) ? 'match' : 'dim'}
          activeTopic={topic}
          onTopic={onTopic}
          onGo={onGo}
        />
      ))}
    </section>
  )
}
