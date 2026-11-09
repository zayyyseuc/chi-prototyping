import type { DisplayMode } from '../types'

interface Props {
  mode: DisplayMode
  onChange: (mode: DisplayMode) => void
}

const modes: { value: DisplayMode; label: string }[] = [
  { value: 'contents', label: 'Contents' },
  { value: 'topics', label: 'Topics' },
  { value: 'for-you', label: 'For You' },
]

export function DisplayModeSwitcher({ mode, onChange }: Props) {
  return (
    <div className="mode-control">
      <span className="control-label" id="preview-mode-label">Card preview</span>
      <div className="segmented" role="group" aria-labelledby="preview-mode-label">
        {modes.map((item) => (
          <button
            type="button"
            key={item.value}
            className={mode === item.value ? 'is-active' : ''}
            aria-pressed={mode === item.value}
            onClick={() => onChange(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}
