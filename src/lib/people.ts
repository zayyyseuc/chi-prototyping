import type { Session } from '../types'

export interface Appearance {
  sessionId: string
  sessionTitle: string
  date: string
  startTime: string
  contentTitle: string
}

// Other places an author appears in the program (People section, previewed in Program).
export function getOtherAppearances(sessions: Session[], author: string, currentSessionId: string): Appearance[] {
  return sessions.flatMap((session) =>
    session.id === currentSessionId
      ? []
      : session.contents
          .filter((content) => content.authors.includes(author))
          .map((content) => ({
            sessionId: session.id,
            sessionTitle: session.title,
            date: session.date,
            startTime: session.startTime,
            contentTitle: content.title,
          })),
  )
}

export interface PersonEntry {
  contentTitle: string
  sessionId: string
  sessionTitle: string
  date: string
  startTime: string
  room: string
}

export function getPeople(sessions: Session[]): string[] {
  return [...new Set(sessions.flatMap((session) => session.contents.flatMap((content) => content.authors)))].sort((a, b) => a.localeCompare(b))
}

export function getPersonEntries(sessions: Session[], person: string): PersonEntry[] {
  return sessions.flatMap((session) =>
    session.contents
      .filter((content) => content.authors.includes(person))
      .map((content) => ({
        contentTitle: content.title,
        sessionId: session.id,
        sessionTitle: session.title,
        date: session.date,
        startTime: session.startTime,
        room: session.room,
      })),
  )
}
