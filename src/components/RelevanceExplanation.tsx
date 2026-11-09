import type { Interest } from '../data/interests'
import { getMatchingInterests, getRelevanceExplanation } from '../lib/relevance'
import type { Session } from '../types'

export function RelevanceExplanation({ session, interests }: { session: Session; interests: Interest[] }) {
  const matches = getMatchingInterests(session, interests)

  if (matches.length === 0) {
    return (
      <div className="preview-block relevance neutral">
        <p className="preview-label">Topic overview</p>
        <p>{session.description}</p>
        <p className="match-note">No selected interests clearly match this session.</p>
      </div>
    )
  }

  return (
    <div className="preview-block relevance">
      <p className="preview-label"><span aria-hidden="true">●</span> Relevant to your interests</p>
      <p>{getRelevanceExplanation(session, matches)}</p>
      <div className="keyword-list" aria-label="Matching interests">
        {matches.map((interest) => <span key={interest}>{interest}</span>)}
      </div>
    </div>
  )
}
