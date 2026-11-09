import type { Interest } from '../data/interests'
import { conferenceDays, sessions, sessionsByDate } from '../data/sessions'
import { getSessionsByTopic } from '../lib/relevance'
import type { Route } from '../lib/route'
import { DateNavigation } from './DateNavigation'
import { SectionNav } from './SectionNav'
import { SessionGallery } from './SessionGallery'

interface Props {
  selectedDate: string
  onSelectDate: (date: string) => void
  interests: Interest[]
  onOpenInterests: () => void
  onGo: (route: Route) => void
  topic: string | null
  onTopic: (keyword: string) => void
}

export function ProgramPage(props: Props) {
  const currentDay = conferenceDays.find((day) => day.id === props.selectedDate)!
  const daySessions = sessionsByDate(props.selectedDate)
  const markedDates = props.topic ? [...new Set(getSessionsByTopic(sessions, props.topic).map((session) => session.date))] : []

  return (
    <main className="program-page">
      <header className="site-header shell">
        <span className="wordmark">CHI 2027</span>
        <SectionNav current="program" onGo={props.onGo} />
      </header>

      <section className="program-intro shell">
        <h1>Program</h1>
      </section>

      <div className="date-nav-wrap shell">
        <DateNavigation days={conferenceDays} selectedDate={props.selectedDate} onSelect={props.onSelectDate} markedDates={markedDates} />
      </div>

      <section className="program-content shell">
        <div className="gallery-heading">
          <h2>{currentDay.longDate}</h2>
          <div className="experiment-tools">
            <button type="button" className="interest-button" onClick={props.onOpenInterests}>
              <span aria-hidden="true">◎</span> Interests <span className="interest-count">{props.interests.length}</span>
            </button>
          </div>
        </div>

        <SessionGallery sessions={daySessions} interests={props.interests} topic={props.topic} onTopic={props.onTopic} onGo={props.onGo} />
      </section>

    </main>
  )
}
