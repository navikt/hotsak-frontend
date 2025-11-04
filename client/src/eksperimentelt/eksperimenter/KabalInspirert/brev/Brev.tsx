import useSWR from 'swr'
import { Alert, Loader } from '@navikt/ds-react'
import Breveditor, { type StateMangement } from './breveditor/Breveditor.tsx'
import { BrevmalVelger } from './brevmaler/Brevmaler.tsx'
import { useMemo, useState } from 'react'

export const Brev = ({ sakId }: { sakId: number }) => {
  const brevutkast = useSWR<
    {
      error?: string
      data?: StateMangement
    },
    Error
  >(`/api/sak/${sakId}/brevutkast/BREVEDITOR_VEDTAKSBREV`, async (key: string) =>
    fetch(key, { method: 'get' }).then((res) => res.json())
  )

  const [valgtMal, velgMal] = useState<string>()
  const errorEr404 = useMemo(() => brevutkast.data?.data?.value == undefined, [brevutkast.data])

  if (brevutkast.isLoading) {
    return <Loader title="Laster inn brevutkast..." />
  } else if (brevutkast.error) {
    return <Alert variant="warning">Brev ikke tilgjengelig.</Alert>
  }

  return (
    <>
      {errorEr404 && valgtMal === undefined && <BrevmalVelger velgMal={velgMal} />}
      {(!errorEr404 || valgtMal !== undefined) && brevutkast.data && (
        <div
          style={{
            background: '#242424',
            height: '100%',
          }}
        >
          <Breveditor
            metadata={{
              brukersNavn: 'Ola Nordmann',
              brukersFødselsnummer: '26848497710',
              saksnummer: sakId,
              brevOpprettet: '1. Januar 2025',
              saksbehandlerNavn: 'Jon Åsen',
              attestantsNavn: 'Kari Hansen',
              hjelpemiddelsentral: 'Nav hjelpemiddelsentral Agder',
            }}
            brevId={sakId.toString()}
            templateMarkdown={valgtMal}
            initialState={brevutkast.data?.data}
            onLagreBrev={async (state) => {
              await fetch(`/api/sak/${sakId}/brevutkast`, {
                method: 'post',
                body: JSON.stringify({
                  brevtype: 'BREVEDITOR_VEDTAKSBREV',
                  målform: 'BOKMÅL',
                  data: state,
                }),
              }).then((res) => {
                if (!res.ok) throw new Error(`Brev ikke lagret, statuskode ${res.status}`)
              })
            }}
            onSlettBrev={async () => {
              velgMal(undefined) // Unngå at forrige valgte mal trigger at breveditoren laster den på nytt
              await fetch(`/api/sak/${sakId}/brevutkast/BREVEDITOR_VEDTAKSBREV`, {
                method: 'delete',
              }).then((res) => {
                if (!res.ok) throw new Error(`Brev ikke slettet, statuskode ${res.status}`)
              })
              await brevutkast.mutate()
            }}
          />
        </div>
      )}
    </>
  )
}
