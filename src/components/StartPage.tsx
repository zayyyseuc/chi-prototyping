import type { CSSProperties } from 'react'
import type { Interest } from '../data/interests'
import { plannedSessionIds, savedContentIds } from '../data/mine'
import { conferenceDays, sessions, sessionsByDate } from '../data/sessions'
import { minutes, overlapsPlan } from '../lib/access'
import { getForYouFeed, type ForYouEntry } from '../lib/relevance'
import type { Route } from '../lib/route'
import type { Session } from '../types'
import { DateNavigation } from './DateNavigation'
import { NoteIcon, RoomNotes } from './RoomNotes'
import { RoomMap } from './RoomMap'
import { SectionNav } from './SectionNav'

interface Props {
  interests: Interest[]
  selectedDate: string
  onSelectDate: (date: string) => void
  onOpenInterests: () => void
  onGo: (route: Route) => void
}

type Variant = 'planned' | 'conflict' | 'suggest'

const isReason = (entry: ForYouEntry) => entry.key.startsWith('saved') || entry.key.startsWith('match')

function SlotCard({ session, variant, interests, onGo }: { session: Session; variant: Variant; interests: Interest[]; onGo: (route: Route) => void }) {
  const reasons = getForYouFeed(session, interests, sessions, savedContentIds).slice(0, 2)
  return (
    <article className={`slot-card is-${variant}`}>
      <h3>
        <button type="button" className="slot-open" onClick={() => onGo({ view: 'session', id: session.id })}>{session.title}</button>
      </h3>
      <div className="slot-meta">
        {variant !== 'suggest' && (
          <span className={`slot-state ${variant === 'conflict' ? 'is-conflict' : ''}`} title={variant === 'conflict' ? 'Overlaps your plan' : 'In your plan'}>
            <NoteIcon kind={variant === 'conflict' ? 'conflict' : 'planned'} size={18} />
          </span>
        )}
        <button type="button" className="room-link" onClick={() => onGo({ view: 'map', room: session.room })}>
          <RoomMap room={session.room} />{session.room}
        </button>
        <RoomNotes room={session.room} />
      </div>
      {variant !== 'planned' && reasons.length > 0 && (
        <ul className="reasons">
          {reasons.map((entry) => (
            <li key={entry.key}>
              <span className="for-you-title">{entry.text}</span>
              {entry.tag && <span className="for-you-tags">{entry.tag}</span>}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

// The day as a timeline: each slot is one decision. Planned sessions anchor it, clashes are flagged,
// free slots are filled with sessions that have a reason to matter to you.
export function StartPage({ interests, selectedDate, onSelectDate, onOpenInterests, onGo }: Props) {
  const day = [...sessionsByDate(selectedDate)].sort((a, b) => minutes(a.startTime) - minutes(b.startTime))
  const slots = [...new Set(day.map((session) => session.startTime))].map((start) => {
    const inSlot = day.filter((session) => session.startTime === start)
    const score = (session: Session) => getForYouFeed(session, interests, sessions, savedContentIds).filter(isReason).length
    const planned = inSlot.find((session) => plannedSessionIds.includes(session.id))
    const others = inSlot.filter((session) => session !== planned && score(session) > 0).sort((a, b) => score(b) - score(a))
    return { start, end: inSlot[0].endTime, planned, others }
  })
  const next = slots.find((slot) => slot.planned)?.planned
  const longDate = conferenceDays.find((item) => item.id === selectedDate)?.longDate

  const [clock, meridiem] = next ? next.startTime.split(' ') : ['', '']

  return (
    <main className="start-page">
      <header className="site-header shell">
        <span className="wordmark">CHI 2027</span>
        <SectionNav current="start" onGo={onGo} />
      </header>

      <div className="date-nav-wrap shell">
        <DateNavigation days={conferenceDays} selectedDate={selectedDate} onSelect={onSelectDate} />
      </div>

      <div className="start-body shell">
        <div className="gallery-heading">
          <h2>{longDate}</h2>
          <button type="button" className="interest-button" onClick={onOpenInterests}>
            <span aria-hidden="true">◎</span> Interests <span className="interest-count">{interests.length}</span>
          </button>
        </div>

        {next && (
          <section className="next-up" key={`${selectedDate}-${next.id}`} aria-label="Next session">
            <div className="next-main">
              <span className="next-clock">{clock}<small>{meridiem}</small></span>
              <h1>
                <button type="button" className="slot-open" onClick={() => onGo({ view: 'session', id: next.id })}>{next.title}</button>
              </h1>
              <RoomNotes room={next.room} />
            </div>
            <button type="button" className="next-map" onClick={() => onGo({ view: 'map', room: next.room })}>
              <RoomMap room={next.room} />
              <span>{next.room}</span>
            </button>
          </section>
        )}

        <ol className="timeline" key={selectedDate}>
          {slots.map((slot, index) => {
            const tone = slot.planned ? 'planned' : slot.others.length > 0 ? 'suggest' : 'gap'
            const clash = !!slot.planned && slot.others.some((session) => overlapsPlan(session, sessions, plannedSessionIds))
            return (
              <li key={slot.start} className="timeline-slot" style={{ '--i': index } as CSSProperties}>
                <span className="slot-time">{slot.start}<small>{slot.end}</small></span>
                <span className={`slot-node is-${tone} ${clash ? 'has-clash' : ''}`} aria-hidden="true" />
                <div className="slot-cards">
                  {slot.planned && <SlotCard session={slot.planned} variant="planned" interests={interests} onGo={onGo} />}
                  {slot.others.slice(0, slot.planned ? 1 : 2).map((session) => (
                    <SlotCard
                      key={session.id}
                      session={session}
                      variant={overlapsPlan(session, sessions, plannedSessionIds) ? 'conflict' : 'suggest'}
                      interests={interests}
                      onGo={onGo}
                    />
                  ))}
                  {!slot.planned && slot.others.length === 0 && <span className="slot-gap" aria-hidden="true" />}
                </div>
              </li>
            )
          })}
        </ol>

        <button type="button" className="all-sessions" onClick={() => onGo({ view: 'program' })}>
          Program <span aria-hidden="true">→</span>
        </button>
      </div>
    </main>
  )
}
