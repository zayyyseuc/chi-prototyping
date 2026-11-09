import { rooms } from '../data/rooms'
import type { Session } from '../types'

export const minutes = (time: string) => {
  const [clock, meridiem] = time.split(' ')
  const [h, m] = clock.split(':').map(Number)
  return ((h % 12) + (meridiem === 'PM' ? 12 : 0)) * 60 + m
}

export function overlapsPlan(session: Session, all: Session[], plannedIds: string[]): boolean {
  if (plannedIds.includes(session.id)) return false
  return all.some((other) =>
    plannedIds.includes(other.id) &&
    other.date === session.date &&
    minutes(other.startTime) < minutes(session.endTime) &&
    minutes(session.startTime) < minutes(other.endTime),
  )
}

export type RoomNoteKey = 'crowded' | 'loud' | 'no-step-free' | 'warm' | 'cool' | 'unknown'
export interface RoomNote { key: RoomNoteKey; label: string }

// Only things worth knowing before going; empty when the room has no issues.
export function getRoomNotes(room: string): RoomNote[] {
  const info = rooms[room]
  if (!info) return [{ key: 'unknown', label: 'Room details unavailable' }]
  const notes: RoomNote[] = []
  if (info.crowding === 'high') notes.push({ key: 'crowded', label: 'Likely crowded' })
  if (!info.sensoryFriendly) notes.push({ key: 'loud', label: 'Not sensory-friendly' })
  if (!info.stepFree) notes.push({ key: 'no-step-free', label: 'No step-free access' })
  if (info.temperature === 'warm') notes.push({ key: 'warm', label: 'Often warm' })
  if (info.temperature === 'cool') notes.push({ key: 'cool', label: 'Often cool' })
  return notes
}
