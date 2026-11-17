import type { Interest } from '../data/interests'
import { plannedSessionIds, savedContentIds } from '../data/mine'
import { rooms } from '../data/rooms'
import { conferenceDays, sessions } from '../data/sessions'

/**
 * Public, fictional site data passed to the server-side AI proxy as grounding.
 * Keeping this builder close to the UI data means the assistant cannot drift
 * away from what the visitor can actually see on the prototype.
 */
export function buildChatKnowledge(interests: Interest[]) {
  const plannedSessions = sessions.filter((session) => plannedSessionIds.includes(session.id))
  const savedPapers = sessions.flatMap((session) =>
    session.contents
      .filter((content) => savedContentIds.includes(content.id))
      .map((content) => ({ ...content, sessionId: session.id, sessionTitle: session.title })),
  )

  return JSON.stringify({
    site: {
      name: 'CHI 2027 Program prototype',
      note: 'All conference content in this prototype is fictional.',
      sections: ['Today', 'Program', 'Map', 'People', 'My'],
    },
    dates: conferenceDays,
    sessions,
    rooms,
    visitor: {
      interests,
      plannedSessions,
      savedPapers,
    },
  })
}

