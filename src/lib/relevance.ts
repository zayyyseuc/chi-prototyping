import type { Interest } from '../data/interests'
import type { Session } from '../types'

const interestSignals: Record<Interest, string[]> = {
  'Human-AI Interaction': ['human-ai interaction', 'artificial intelligence', 'ai', 'trust', 'agency', 'explainability'],
  Accessibility: ['accessibility', 'inclusive design', 'blind', 'deaf', 'low vision', 'assistive'],
  'Tangible Interaction': ['tangible interaction', 'tangible', 'fabrication', 'physical computing', 'haptics'],
  'Design Tools': ['design tools', 'prototyping', 'creativity', 'co-design', 'design practice'],
  'Social Computing': ['social computing', 'online communities', 'social media', 'moderation', 'collaboration'],
  'Health & Wellbeing': ['health', 'wellbeing', 'mental health', 'care', 'clinical'],
  'Human-Robot Interaction': ['human-robot interaction', 'robot', 'robotics', 'embodied agent'],
  'Learning Technologies': ['learning', 'education', 'classroom', 'literacy', 'teaching'],
}

export function getMatchingInterests(session: Session, selected: Interest[]): Interest[] {
  const searchable = [
    session.title,
    session.description,
    ...session.keywords,
    ...session.contents.flatMap((item) => [item.title, ...item.keywords]),
  ].join(' ').toLowerCase()

  return selected.filter((interest) =>
    interestSignals[interest].some((signal) => searchable.includes(signal.toLowerCase())),
  )
}

export interface ForYouItem {
  contentId: string
  title: string
  interests: Interest[]
}

// Contents inside a session that match at least one selected interest (same keyword rule as sessions).
export function getForYouItems(session: Session, selected: Interest[]): ForYouItem[] {
  return session.contents.flatMap((content) => {
    const searchable = [content.title, ...content.keywords].join(' ').toLowerCase()
    const interests = selected.filter((interest) =>
      interestSignals[interest].some((signal) => searchable.includes(signal.toLowerCase())),
    )
    return interests.length > 0 ? [{ contentId: content.id, title: content.title, interests }] : []
  })
}

const norm = (value: string) => value.toLowerCase()

export interface ContentLink {
  contentId: string
  title: string
  shared: string[]
  sessionId?: string
}

// Same-session papers that share keywords with the given paper.
export function getRelatedContents(session: Session, contentId: string): ContentLink[] {
  const current = session.contents.find((item) => item.id === contentId)
  if (!current) return []
  const own = new Set(current.keywords.map(norm))
  return session.contents.flatMap((item) => {
    if (item.id === contentId) return []
    const shared = item.keywords.filter((keyword) => own.has(norm(keyword)))
    return shared.length > 0 ? [{ contentId: item.id, title: item.title, shared }] : []
  })
}

// Sessions (across all days, in original order) that touch a topic via keywords or content keywords.
export function getSessionsByTopic(sessions: Session[], topic: string): Session[] {
  const target = norm(topic)
  return sessions.filter((session) =>
    [...session.keywords, ...session.contents.flatMap((item) => item.keywords)].some((keyword) => norm(keyword) === target),
  )
}

// Saved papers (preset) that share keywords with the given paper.
export function getSavedLinks(sessions: Session[], contentId: string, savedIds: string[]): ContentLink[] {
  const all = sessions.flatMap((session) => session.contents.map((content) => ({ content, sessionId: session.id })))
  const current = all.find((item) => item.content.id === contentId)?.content
  if (!current) return []
  const own = new Set(current.keywords.map(norm))
  return all.flatMap(({ content, sessionId }) => {
    if (content.id === contentId || !savedIds.includes(content.id)) return []
    const shared = content.keywords.filter((keyword) => own.has(norm(keyword)))
    return shared.length > 0 ? [{ contentId: content.id, title: content.title, shared, sessionId }] : []
  })
}

export interface ForYouEntry {
  key: string
  text: string
  tag?: string
}

// Everything rotating under a session's topics: hand-written notes, saved-paper links, interest matches.
export function getForYouFeed(session: Session, interests: Interest[], all: Session[], savedIds: string[]): ForYouEntry[] {
  const notes = (session.forYouNotes ?? []).map((text, i) => ({ key: `note-${i}`, text }))
  const saved = session.contents.flatMap((content) =>
    getSavedLinks(all, content.id, savedIds).slice(0, 1).map((link) => ({
      key: `saved-${content.id}`,
      text: content.title,
      tag: `Close to your saved paper · ${link.shared.join(', ')}`,
    })),
  )
  const matches = getForYouItems(session, interests).map((item) => ({
    key: `match-${item.contentId}`,
    text: item.title,
    tag: item.interests.join(' · '),
  }))
  // Priority: link to something you saved, then your interests, then fit/difficulty notes.
  return [...saved.slice(0, 1), ...matches, ...notes]
}

export function getRelevanceExplanation(session: Session, matches: Interest[]): string {
  if (matches.length === 0) return session.description

  const interests = matches.length === 1
    ? matches[0]
    : `${matches.slice(0, -1).join(', ')} and ${matches.at(-1)}`

  const focus = session.keywords.slice(0, 3).join(', ').toLowerCase()
  return `You’re interested in ${interests}. This session connects those interests through work on ${focus}.`
}
