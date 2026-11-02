import { useLayoutEffect } from 'react'

import { type Oppgavetype } from './oppgaveTypes.ts'

export function useSkyraOppgavetype(oppgavetype: Oppgavetype) {
  useLayoutEffect(() => {
    settOppgavetype(oppgavetype)
    return () => settOppgavetype('')
  }, [oppgavetype])
}

function settOppgavetype(oppgavetype: Oppgavetype | '') {
  const traits = { 'hotsak-oppgavetype': oppgavetype }
  if (window.SKYRA_CONFIG) {
    window.SKYRA_CONFIG.traits = { ...window.SKYRA_CONFIG.traits, ...traits }
  }
  window.skyra?.setTraits(traits)
}
