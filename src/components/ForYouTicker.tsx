import { useEffect, useState } from 'react'
import type { Interest } from '../data/interests'
import { savedContentIds } from '../data/mine'
import { sessions } from '../data/sessions'
import { getForYouFeed } from '../lib/relevance'
import type { Session } from '../types'

const INTERVAL_MS = 3600

// Entries fade in and out one at a time. Renders nothing when there is nothing for the user.
export function ForYouTicker({ session, interests }: { session: Session; interests: Interest[] }) {
  const items = getForYouFeed(session, interests, sessions, savedContentIds)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = items.length

  useEffect(() => {
    setActive(0)
  }, [count])

  useEffect(() => {
    if (count < 2 || paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => setActive((i) => (i + 1) % count), INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [count, paused])

  if (count === 0) return null

  return (
    <div className="for-you" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {items.map((item, index) => (
        <p key={item.key} className={`for-you-item ${index === active ? 'is-active' : ''}`} aria-hidden={index !== active}>
          <span className="for-you-title">{item.text}</span>
          {item.tag && <span className="for-you-tags">{item.tag}</span>}
        </p>
      ))}
    </div>
  )
}
