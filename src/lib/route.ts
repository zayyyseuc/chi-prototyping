export type Route =
  | { view: 'start' }
  | { view: 'program' }
  | { view: 'session'; id: string }
  | { view: 'map'; room?: string }
  | { view: 'people'; person?: string }
  | { view: 'my' }

export function parseRoute(search: string, fallback: Route = { view: 'program' }): Route {
  const params = new URLSearchParams(search)
  const session = params.get('session')
  if (session) return { view: 'session', id: session }
  const view = params.get('view')
  if (view === 'map') return { view: 'map', room: params.get('room') ?? undefined }
  if (view === 'people') return { view: 'people', person: params.get('person') ?? undefined }
  if (view === 'my') return { view: 'my' }
  if (view === 'start') return { view: 'start' }
  if (view === 'program') return { view: 'program' }
  return fallback
}

export function routeToSearch(route: Route): string {
  const params = new URLSearchParams()
  if (route.view === 'session') params.set('session', route.id)
  if (route.view === 'map') {
    params.set('view', 'map')
    if (route.room) params.set('room', route.room)
  }
  if (route.view === 'people') {
    params.set('view', 'people')
    if (route.person) params.set('person', route.person)
  }
  if (route.view === 'my') params.set('view', 'my')
  if (route.view === 'start') params.set('view', 'start')
  if (route.view === 'program') params.set('view', 'program')
  const text = params.toString()
  return text ? `?${text}` : window.location.pathname
}
