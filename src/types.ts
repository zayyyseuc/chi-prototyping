export type DisplayMode = 'contents' | 'topics' | 'for-you'

export interface ConferenceContent {
  id: string
  title: string
  authors: string[]
  abstract: string
  keywords: string[]
}

export interface Session {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  room: string
  category: string
  description: string
  keywords: string[]
  contents: ConferenceContent[]
  /** Hand-written For you phrases (prototype stand-in for inferred recommendations). */
  forYouNotes?: string[]
}

export interface ConferenceDay {
  id: string
  dayName: string
  shortDate: string
  longDate: string
}
