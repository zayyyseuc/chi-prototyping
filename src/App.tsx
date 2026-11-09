import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { defaultInterests, type Interest } from './data/interests'
import { conferenceDays, getSessionById } from './data/sessions'
import { InterestSelector } from './components/InterestSelector'
import { LayoutSwitch } from './components/LayoutSwitch'
import { MapPage } from './components/MapPage'
import { MyPage } from './components/MyPage'
import { PeoplePage } from './components/PeoplePage'
import { ProgramPage } from './components/ProgramPage'
import { SessionDetail } from './components/SessionDetail'
import { StartPage } from './components/StartPage'
import { LayoutContext, loadLayout, saveLayout, type Layout } from './lib/layout'
import { parseRoute, routeToSearch, type Route } from './lib/route'

function App() {
  const [selectedDate, setSelectedDate] = useState(conferenceDays[0].id)
  const [interests, setInterests] = useState<Interest[]>(defaultInterests)
  const [topic, setTopic] = useState<string | null>(null)
  const [showInterests, setShowInterests] = useState(false)
  const [layout, setLayout] = useState<Layout>(loadLayout)
  const home: Route = layout === 'day' ? { view: 'start' } : { view: 'program' }
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.search, loadLayout() === 'day' ? { view: 'start' } : { view: 'program' }))
  // Session pages stay mounted once opened (just hidden), so coming back finds them exactly as left.
  const [visited, setVisited] = useState<string[]>(() => (route.view === 'session' ? [route.id] : []))
  const pendingScroll = useRef(0)
  const homeRef = useRef<Route>(home)
  homeRef.current = home

  useLayoutEffect(() => {
    window.scrollTo({ top: pendingScroll.current, behavior: 'instant' })
  }, [route])

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const next = parseRoute(window.location.search, homeRef.current)
      pendingScroll.current = event.state?.scroll ?? 0
      if (next.view === 'session') setVisited((list) => (list.includes(next.id) ? list : [...list, next.id]))
      setRoute(next)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Every section links to every other one through this single function.
  const go = (next: Route) => {
    const here = { nav: true, scroll: window.scrollY }
    // Picking another room/person inside Map/People replaces the entry, so Back leaves the section.
    const sameSection = next.view === route.view && (next.view === 'map' || next.view === 'people')
    pendingScroll.current = 0
    if (next.view === 'session') setVisited((list) => (list.includes(next.id) ? list : [...list, next.id]))
    if (sameSection) {
      window.history.replaceState(here, '', routeToSearch(next))
    } else {
      window.history.replaceState({ ...window.history.state, scroll: here.scroll }, '')
      window.history.pushState({ nav: true }, '', routeToSearch(next))
    }
    setRoute(next)
  }

  const back = () => {
    if (window.history.state?.nav) {
      window.history.back()
    } else {
      pendingScroll.current = 0
      setRoute(home)
      window.history.replaceState(null, '', routeToSearch(home))
    }
  }

  const toggleTopic = (keyword: string) => setTopic((current) => (current === keyword.toLowerCase() ? null : keyword.toLowerCase()))
  const changeLayout = (next: Layout) => {
    if (next === layout) return
    saveLayout(next)
    setLayout(next)
    go(next === 'day' ? { view: 'start' } : { view: 'program' })
  }
  const sessionRoute = route.view === 'session' ? route : null

  return (
    <LayoutContext.Provider value={layout}>
      <div hidden={route.view !== 'program' && !(sessionRoute && !getSessionById(sessionRoute.id) && layout === 'classic')}>
        <ProgramPage
          selectedDate={selectedDate}
          onSelectDate={(date) => { setSelectedDate(date); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          interests={interests}
          onOpenInterests={() => setShowInterests(true)}
          onGo={go}
          topic={topic}
          onTopic={toggleTopic}
        />
      </div>
      {visited.map((id) => {
        const session = getSessionById(id)
        if (!session) return null
        return (
          <div key={id} hidden={sessionRoute?.id !== id}>
            <SessionDetail session={session} onBack={back} onGo={go} topic={topic} onTopic={toggleTopic} />
          </div>
        )
      })}
      {route.view === 'map' && <MapPage room={route.room} onGo={go} />}
      {route.view === 'my' && <MyPage onGo={go} />}
      {route.view === 'people' && <PeoplePage person={route.person} onGo={go} />}
      {route.view === 'start' && (
        <StartPage
          interests={interests}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onOpenInterests={() => setShowInterests(true)}
          onGo={go}
        />
      )}
      {showInterests && (
        <InterestSelector selected={interests} onChange={setInterests} onClose={() => setShowInterests(false)} />
      )}
      <LayoutSwitch layout={layout} onChange={changeLayout} />
    </LayoutContext.Provider>
  )
}

export default App
