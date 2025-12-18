export const storageKeys = new Set([
  'darkmode',
  'debug',
  'eksperimentell',
  'filterState',
  'innloggetSaksbehandlerId',
  'nyOppgaveliste',
  'oppgaveColumnsEnhetens',
  'oppgaveColumnsMedarbeiders',
  'oppgaveColumnsMine',
  'sortState',
])

/**
 * Fjern alle nøkler fra {@link storage} som ikke ligger i {@link storageKeys}.
 */
export function cleanupStorage(storage: Storage = window.localStorage) {
  for (let index = 0, length = storage.length; index < length; index++) {
    const key = storage.key(index)
    if (key != null && !storageKeys.has(key)) {
      storage.removeItem(key)
    }
  }
}
