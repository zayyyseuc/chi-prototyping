import type { Layout } from '../lib/layout'

export function LayoutSwitch({ layout, onChange }: { layout: Layout; onChange: (layout: Layout) => void }) {
  return (
    <div className="layout-switch" role="group" aria-label="Layout">
      {(['classic', 'day'] as Layout[]).map((item) => (
        <button type="button" key={item} className={layout === item ? 'is-active' : ''} aria-pressed={layout === item} onClick={() => onChange(item)}>
          {item === 'classic' ? 'Classic' : 'Day'}
        </button>
      ))}
    </div>
  )
}
