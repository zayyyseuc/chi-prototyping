import type { ConferenceDay } from '../types'

interface Props {
  days: ConferenceDay[]
  selectedDate: string
  onSelect: (date: string) => void
  markedDates?: string[]
}

export function DateNavigation({ days, selectedDate, onSelect, markedDates = [] }: Props) {
  return (
    <nav className="date-nav" aria-label="Conference dates">
      <div className="date-scroll">
        {days.map((day) => (
          <button
            type="button"
            key={day.id}
            className={`date-tab ${selectedDate === day.id ? 'is-active' : ''}`}
            aria-current={selectedDate === day.id ? 'date' : undefined}
            onClick={() => onSelect(day.id)}
          >
            <span>{day.dayName}</span>
            <strong>{day.shortDate}</strong>
            {markedDates.includes(day.id) && <i className="date-dot" aria-label="Topic appears on this day" />}
          </button>
        ))}
      </div>
    </nav>
  )
}
