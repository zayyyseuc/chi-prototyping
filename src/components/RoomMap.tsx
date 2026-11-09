import { roomPlan } from '../data/rooms'

const COLS = 4
const ROWS = 3
const CELL = 8
const GAP = 2

// Tiny floor plan with the session's room filled in. Location is shown by position, not words.
export function RoomMap({ room }: { room: string }) {
  const target = roomPlan[room]
  return (
    <svg className="room-map" viewBox={`0 0 ${COLS * (CELL + GAP) - GAP} ${ROWS * (CELL + GAP) - GAP}`} role="img" aria-label={`${room} on the floor plan`}>
      {Object.entries(roomPlan).map(([name, plan]) => (
        <rect
          key={name}
          x={plan.col * (CELL + GAP)}
          y={plan.row * (CELL + GAP)}
          width={plan.span * CELL + (plan.span - 1) * GAP}
          height={CELL}
          rx="1"
          className={name === room && target ? 'is-here' : ''}
        />
      ))}
      {target && (
        <rect
          className="pulse"
          x={target.col * (CELL + GAP)}
          y={target.row * (CELL + GAP)}
          width={target.span * CELL + (target.span - 1) * GAP}
          height={CELL}
          rx="1"
        />
      )}
    </svg>
  )
}
