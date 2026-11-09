import { useLayout } from '../lib/layout'
import type { Route } from '../lib/route'

type View = 'start' | 'program' | 'map' | 'people' | 'my'

export function SectionNav({ current, onGo }: { current: View; onGo: (route: Route) => void }) {
  const layout = useLayout()
  const items: { view: View; label: string }[] = [
    ...(layout === 'day' ? [{ view: 'start' as View, label: 'Today' }] : []),
    { view: 'program', label: 'Program' },
    { view: 'map', label: 'Map' },
    { view: 'people', label: 'People' },
    { view: 'my', label: 'My' },
  ]
  return (
    <nav className="section-nav" aria-label="Sections">
      {items.map((item) => (
        <button
          type="button"
          key={item.view}
          className={current === item.view ? 'is-active' : ''}
          aria-current={current === item.view ? 'page' : undefined}
          onClick={() => onGo({ view: item.view })}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}
