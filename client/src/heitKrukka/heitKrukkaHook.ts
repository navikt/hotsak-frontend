import { useState } from 'react'
import { baseUrl } from '../io/http'
import { Resultat, http } from '../io/usePost'
import { Enhet } from '../types/types.internal'
import { response } from 'msw'

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
  setSpørreskjemaOpen: (spørreskjemaOpen: boolean) => void
}

export function useHeitKrukka(): HeitKrukkaResponse {
  const [spørreskjemaOpen, setSpørreskjemaOpen] = useState(false)
  const [spørreskjema, setSpørreskjema] = useState<Resultat<HeitKrukkaSkjemaResponse> | null>(null)

  const hentSpørreskjema = async (skjema: string, enhet: Enhet) => {
    console.log(`POSTER til Krukka ${baseUrl}/heit-krukka/api/skjema/${skjema}`)

    const resultat = await http.post<HeitKrukkaSkjemaRequest, HeitKrukkaSkjemaResponse>(
      `${baseUrl}/heit-krukka/api/skjema/${skjema}`,
      { enhet: enhet.enhetsnavn }
    )

    //const responseText = await response.text()
    console.log(`Krukka Response ${resultat}`);
    

    setSpørreskjema(resultat)
  }

  return { hentSpørreskjema, spørreskjema: spørreskjema?.data?.url, spørreskjemaOpen, setSpørreskjemaOpen }
}
