/**
 * Fictional room environment data. This belongs to the Map section; Program only previews it.
 * Rooms missing here are deliberately "unknown" to test how missing information is shown.
 */
export interface RoomInfo {
  crowding: 'low' | 'medium' | 'high'
  sensoryFriendly: boolean
  stepFree: boolean
  temperature: 'cool' | 'comfortable' | 'warm'
}

export const rooms: Record<string, RoomInfo> = {
  'Civic Hall': { crowding: 'high', sensoryFriendly: false, stepFree: true, temperature: 'warm' },
  'Harbor 1': { crowding: 'medium', sensoryFriendly: true, stepFree: true, temperature: 'comfortable' },
  'Harbor 2': { crowding: 'medium', sensoryFriendly: true, stepFree: true, temperature: 'comfortable' },
  'Harbor 3': { crowding: 'low', sensoryFriendly: true, stepFree: true, temperature: 'comfortable' },
  'Harbor 4': { crowding: 'low', sensoryFriendly: true, stepFree: false, temperature: 'cool' },
  'Learning Lab': { crowding: 'low', sensoryFriendly: true, stepFree: true, temperature: 'comfortable' },
  'Studio B': { crowding: 'high', sensoryFriendly: false, stepFree: true, temperature: 'comfortable' },
}

/** Floor-plan position per room (col, row, width in columns) for the Map preview. Known for every room. */
export const roomPlan: Record<string, { col: number; row: number; span: number }> = {
  'Harbor 1': { col: 0, row: 0, span: 1 },
  'Harbor 2': { col: 1, row: 0, span: 1 },
  'Harbor 3': { col: 2, row: 0, span: 1 },
  'Harbor 4': { col: 3, row: 0, span: 1 },
  'Studio A': { col: 0, row: 1, span: 1 },
  'Studio B': { col: 1, row: 1, span: 1 },
  'Learning Lab': { col: 2, row: 1, span: 1 },
  'Sound Room': { col: 3, row: 1, span: 1 },
  'Civic Hall': { col: 0, row: 2, span: 4 },
}
