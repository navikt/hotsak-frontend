import { Alert, Box, Loader } from '@navikt/ds-react'
import useSWR from 'swr'
import Breveditor, { StateMangement } from './breveditor/Breveditor.tsx'
import { useMemo, useState } from 'react'
import { useSak } from '../../../../saksbilde/useSak.ts'
import { BrevmalVelger } from './brevmaler/Brevmaler.tsx'
import { formaterDatoLang } from '../../../../utils/dato.ts'

export function BrevPanelEksperiment() {
  const { sak } = useSak()

  const brevutkast = useSWR<
    {
      error?: string
      data?: StateMangement
      opprettet: string
    },
    Error
  >(`/api/sak/${sak!.data.sakId}/brevutkast/BREVEDITOR_VEDTAKSBREV`, async (key: string) =>
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
    <Box.New
      style={{ height: '100%', padding: 'var(--ax-radius-8) 0 0 0' }}
      padding={'space-16'}
      background="default"
      borderRadius="large large 0 0"
    >
      {errorEr404 && valgtMal === undefined && <BrevmalVelger velgMal={velgMal} />}
      {(!errorEr404 || valgtMal !== undefined) && brevutkast.data && (
        <div style={{ height: '100%' }}>
          <Breveditor
            metadata={{
              brukersNavn: sak?.data.bruker.fulltNavn || '',
              brukersFødselsnummer: sak?.data.bruker.fnr || '',
              saksnummer: Number(sak!.data.sakId),
              brevOpprettet: formaterDatoLang(brevutkast.data?.opprettet),
              saksbehandlerNavn: sak?.data.saksbehandler?.navn || '',
              attestantsNavn: undefined,
              hjelpemiddelsentral: sak?.data.enhet.enhetsnavn || 'Nav hjelpemiddelsentral',
            }}
            brevId={sak!.data.sakId.toString()}
            templateMarkdown={valgtMal}
            initialState={brevutkast.data?.data}
            onLagreBrev={async (state) => {
              await fetch(`/api/sak/${sak!.data.sakId}/brevutkast`, {
                method: 'post',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Requested-With': 'XMLHttpRequest',
                },
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
              await fetch(`/api/sak/${sak!.data.sakId}/brevutkast/BREVEDITOR_VEDTAKSBREV`, {
                method: 'delete',
              }).then((res) => {
                if (!res.ok) throw new Error(`Brev ikke slettet, statuskode ${res.status}`)
              })
              await brevutkast.mutate()
            }}
          />
        </div>
      )}
    </Box.New>
  )
}
