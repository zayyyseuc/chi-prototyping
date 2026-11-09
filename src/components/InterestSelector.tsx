import { useEffect, useRef } from 'react'
import { availableInterests, type Interest } from '../data/interests'

interface Props {
  selected: Interest[]
  onChange: (interests: Interest[]) => void
  onClose: () => void
}

export function InterestSelector({ selected, onChange, onClose }: Props) {
  const closeButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeButton.current?.focus()
    const handleKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const toggle = (interest: Interest) => {
    onChange(selected.includes(interest)
      ? selected.filter((item) => item !== interest)
      : [...selected, interest])
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="interest-dialog" role="dialog" aria-modal="true" aria-labelledby="interest-title">
        <div className="dialog-header">
          <h2 id="interest-title">Interests</h2>
          <button ref={closeButton} type="button" className="icon-button" onClick={onClose} aria-label="Close interest setup">×</button>
        </div>
        <fieldset className="interest-grid">
          <legend className="sr-only">Research interests</legend>
          {availableInterests.map((interest) => (
            <label key={interest} className={selected.includes(interest) ? 'is-selected' : ''}>
              <input type="checkbox" checked={selected.includes(interest)} onChange={() => toggle(interest)} />
              <span>{interest}</span>
            </label>
          ))}
        </fieldset>
        <div className="dialog-footer">
          <button type="button" className="primary-button" onClick={onClose}>Done</button>
        </div>
      </section>
    </div>
  )
}
