import { replacer } from './serde.ts'

export const storageKeys = new Set([
  'darkmode',
  'dataGridFilterEnhetens',
  'dataGridFilterMedarbeiders',
  'dataGridFilterMine',
  'debug',
  'filterState',
  'innloggetSaksbehandlerId',
  'nyttSaksbilde',
  'oppgaveColumnsEnhetens',
  'oppgaveColumnsMedarbeiders',
  'oppgaveColumnsMine',
  'oppgavePaginationEnhetens',
  'oppgavePaginationMedarbeiders',
  'oppgavePaginationMine',
  'sortState',
  'userTrackingId',
])

/**
 * Fjern alle nøkler fra {@link storage} som ikke ligger i {@link storageKeys}.
 */
export function cleanupStorage(storage: Storage = window.localStorage) {
  for (let index = storage.length - 1; index >= 0; index--) {
    const key = storage.key(index)
    if (key != null && !storageKeys.has(key)) {
      storage.removeItem(key)
    }
  }
}

export interface JSONStorage {
  get<T>(key: string): T | undefined
  set<T>(key: string, value: T): void
}

export function jsonStorage(
  storage: Storage,
  serialize: JSON['stringify'] = JSON.stringify,
  deserialize: JSON['parse'] = JSON.parse
): JSONStorage {
  return {
    get<T>(key: string): T | undefined {
      try {
        const storedValue = storage.getItem(key)
        if (storedValue == null) {
          return
        }
        return deserialize(storedValue)
      } catch (err: unknown) {
        console.warn(`Error getting value for key "${key}":`, err)
        storage.removeItem(key)
      }
    },
    set<T>(key: string, value: T): void {
      if (value == null) {
        storage.removeItem(key)
        return
      }
      try {
        storage.setItem(key, serialize(value, replacer))
      } catch (err: unknown) {
        console.warn(`Error setting value for key "${key}":`, err)
      }
    },
  }
}

export const jsonLocalStorage: JSONStorage = jsonStorage(window.localStorage)
export const jsonSessionStorage: JSONStorage = jsonStorage(window.sessionStorage)
