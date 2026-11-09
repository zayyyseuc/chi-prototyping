export const availableInterests = [
  'Human-AI Interaction',
  'Accessibility',
  'Tangible Interaction',
  'Design Tools',
  'Social Computing',
  'Health & Wellbeing',
  'Human-Robot Interaction',
  'Learning Technologies',
] as const

export type Interest = (typeof availableInterests)[number]

export const defaultInterests: Interest[] = [
  'Human-AI Interaction',
  'Design Tools',
  'Accessibility',
]
