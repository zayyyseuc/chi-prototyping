import type { Interest } from '../data/interests'
import { plannedSessionIds } from '../data/mine'
import { sessions } from '../data/sessions'
import { overlapsPlan } from '../lib/access'
import type { Route } from '../lib/route'
import type { Session } from '../types'
import { ForYouTicker } from './ForYouTicker'
import { NoteIcon, RoomNotes } from './RoomNotes'

// One preview per session, in priority order: plan state, then what is worth knowing about the room,
// then what is relevant to you.
export function AccessPreview({ session, interests, onGo }: { session: Session; interests: Interest[]; onGo: (route: Route) => void }) {
  const planned = plannedSessionIds.includes(session.id)
  const conflict = overlapsPlan(session, sessions, plannedSessionIds)

  return (
    <div className="access-preview">
      <div className="access-row">
        {(planned || conflict) && (
          <button type="button" className={`plan-icon ${conflict ? 'is-conflict' : 'is-planned'}`} title={conflict ? 'Overlaps your plan' : 'In your plan'} aria-label={conflict ? 'Overlaps your plan' : 'In your plan'} onClick={() => onGo({ view: 'my' })}>
            <NoteIcon kind={conflict ? 'conflict' : 'planned'} size={18} />
          </button>
        )}
        <RoomNotes room={session.room} />
      </div>
      <ForYouTicker session={session} interests={interests} />
    </div>
  )
}
