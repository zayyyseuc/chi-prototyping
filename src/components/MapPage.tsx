import { roomPlan } from '../data/rooms'
import { sessions } from '../data/sessions'
import type { Route } from '../lib/route'
import { RoomNotes } from './RoomNotes'
import { SectionNav } from './SectionNav'

const dayLabel = (date: string) => new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short' })

export function MapPage({ room, onGo }: { room?: string; onGo: (route: Route) => void }) {
  const inRoom = room ? sessions.filter((session) => session.room === room) : []

  return (
    <main className="section-page">
      <header className="site-header shell">
        <span className="wordmark">CHI 2027</span>
        <SectionNav current="map" onGo={onGo} />
      </header>
      <div className="section-body shell">
        <h1>Map</h1>
        <div className="map-layout">
          <div className="floor-plan" role="group" aria-label="Floor plan">
            {Object.entries(roomPlan).map(([name, plan]) => (
              <button
                type="button"
                key={name}
                className={name === room ? 'is-active' : ''}
                style={{ gridColumn: `${plan.col + 1} / span ${plan.span}`, gridRow: plan.row + 1 }}
                aria-pressed={name === room}
                onClick={() => onGo({ view: 'map', room: name })}
              >
                {name}
              </button>
            ))}
          </div>
          {room && (
            <section className="section-panel" aria-label={room}>
              <h2>{room}</h2>
              <RoomNotes room={room} labeled />
              <ul className="link-list">
                {inRoom.map((session) => (
                  <li key={session.id}>
                    <button type="button" onClick={() => onGo({ view: 'session', id: session.id })}>
                      <span>{dayLabel(session.date)} {session.startTime}</span> {session.title}
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
