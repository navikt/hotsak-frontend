import { useState } from 'react'
import { baseUrl } from '../io/http'
import { http, Resultat } from '../io/usePost'
import { Enhet } from '../types/types.internal'
import { logDebug } from '../utvikling/logDebug'

interface HeitKrukkaSkjemaRequest {
  enhet: string
}

interface HeitKrukkaSkjemaResponse {
  url?: string
}

interface HeitKrukkaResponse {
  hentSpørreskjema: (skjema: string, enhet: Enhet) => any
  spørreskjema?: string
  spørreskjemaOpen: boolean
  nullstillSkjema: () => void
  setSpørreskjemaOpen: (spørreskjemaOpen: boolean) => void
}

export function useHeitKrukka(): HeitKrukkaResponse {
  const [spørreskjemaOpen, setSpørreskjemaOpen] = useState(false)
  const [spørreskjema, setSpørreskjema] = useState<Resultat<HeitKrukkaSkjemaResponse> | null>(null)

  const hentSpørreskjema = async (skjema: string, enhet: Enhet) => {
    logDebug(`HTTP POST til heit-krukka, url: '${baseUrl}/heit-krukka/api/skjema/${skjema}'`)

    const resultat = await http.post<HeitKrukkaSkjemaRequest, HeitKrukkaSkjemaResponse>(
      `${baseUrl}/heit-krukka/api/skjema/${skjema}`,
      { enhet: enhet.enhetsnavn }
    )

    setSpørreskjema(resultat)
    if (resultat) {
      setSpørreskjemaOpen(true)
    }
  }

  const nullstillSkjema = () => setSpørreskjema(null)

  return {
    hentSpørreskjema,
    spørreskjema: spørreskjema?.data?.url,
    nullstillSkjema,
    spørreskjemaOpen,
    setSpørreskjemaOpen,
  }
}
