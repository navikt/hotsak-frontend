import { useCallback } from 'react'

import { usePersonContext } from '../personoversikt/PersonContext'
import { useUmami } from '../sporing/useUmami.ts'
import { useModiaActions } from './useModiaActions.ts'

export function useApneModia() {
  const { fodselsnummer } = usePersonContext()
  const { settAktivBruker } = useModiaActions()
  const { logPersonoversiktÅpnetIModia, logLandingpageIModia } = useUmami()
  const modiaUrl = window.appSettings.MODIA_URL

  const åpneModia = useCallback(async () => {
    if (fodselsnummer) {
      logPersonoversiktÅpnetIModia()
      await settAktivBruker(fodselsnummer)
      window.open(`${modiaUrl}/person/oversikt`, 'modia')
    } else {
      logLandingpageIModia()
      window.open(`${modiaUrl}/landingpage`, 'modia')
    }
  }, [fodselsnummer, logPersonoversiktÅpnetIModia, logLandingpageIModia, settAktivBruker, modiaUrl])

  return { åpneModia }
}
