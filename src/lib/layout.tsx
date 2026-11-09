import { createContext, useContext } from 'react'

export type Layout = 'classic' | 'day'

export const LayoutContext = createContext<Layout>('classic')
export const useLayout = () => useContext(LayoutContext)

const KEY = 'chi-layout'

export function loadLayout(): Layout {
  try {
    return window.localStorage.getItem(KEY) === 'day' ? 'day' : 'classic'
  } catch {
    return 'classic'
  }
}

export function saveLayout(layout: Layout) {
  try {
    window.localStorage.setItem(KEY, layout)
  } catch {
    /* storage may be unavailable; the layout just won't persist */
  }
}
