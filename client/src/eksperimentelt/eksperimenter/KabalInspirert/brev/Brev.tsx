import { Alert, Button, Loader, Tag } from '@navikt/ds-react'
import useSWR from 'swr'
import Breveditor, { StateMangement } from './breveditor/Breveditor.tsx'
import { useMemo, useState } from 'react'
import { useSak } from '../../../../saksbilde/useSak.ts'
import { BrevmalVelger } from './brevmaler/Brevmaler.tsx'
import { formaterDatoLang } from '../../../../utils/dato.ts'
import { CheckmarkIcon, MenuElipsisVerticalCircleIcon, PadlockUnlockedIcon } from '@navikt/aksel-icons'

export const Brev = () => {
  const { sak } = useSak()

  const brevutkast = useSWR<
    {
      error?: string
      data?: StateMangement & {
        markertKlart: boolean
      }
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

  const lagreBrevutkast = async (data: any) => {
    return fetch(`/api/sak/${sak!.data.sakId}/brevutkast`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({
        brevtype: 'BREVEDITOR_VEDTAKSBREV',
        målform: 'BOKMÅL',
        data: data,
      }),
    })
  }

  const makerKlart = async (klart: boolean) => {
    if (brevutkast.data?.data?.value) {
      await lagreBrevutkast({ ...brevutkast.data.data, markertKlart: klart })
      await brevutkast.mutate()
    }
  }

  return (
    <>
      {errorEr404 && valgtMal === undefined && <BrevmalVelger velgMal={velgMal} />}
      {(!errorEr404 || valgtMal !== undefined) && brevutkast.data && (
        <div style={{ height: '100%' }}>
          {!brevutkast.data?.data?.markertKlart && (
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0em 1em',
                  alignContent: 'center',
                  height: '3.5em',
                }}
              >
                <Tag variant="warning-moderate" style={{ margin: '1em 0' }}>
                  Delvis innvilget
                </Tag>
                <div
                  style={{
                    alignContent: 'center',
                    justifyContent: 'space-between',
                    gap: '1em',
                    display: 'flex',
                    margin: '1em 0',
                  }}
                >
                  <Button
                    variant="primary"
                    size="small"
                    icon={<CheckmarkIcon aria-hidden />}
                    onClick={() => makerKlart(true)}
                  >
                    Marker som klart
                  </Button>
                  <Button variant="tertiary-neutral" icon={<MenuElipsisVerticalCircleIcon aria-hidden />} />
                </div>
              </div>
              <Breveditor
                placeholder="Skriv et fantastisk brev her..."
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
                  await lagreBrevutkast(state).then((res) => {
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
            </>
          )}
          {brevutkast.data?.data?.markertKlart && (
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0em 1em',
                  alignContent: 'center',
                  height: '3.5em',
                }}
              >
                <Tag variant="warning-moderate" style={{ margin: '1em 0' }}>
                  Delvis innvilget
                </Tag>
                <Tag variant="success-moderate" style={{ margin: '1em 0' }}>
                  Brev klart
                </Tag>
                <div
                  style={{
                    alignContent: 'center',
                    justifyContent: 'space-between',
                    gap: '1em',
                    display: 'flex',
                    margin: '1em 0',
                  }}
                >
                  <Button
                    variant="tertiary-neutral"
                    size="small"
                    icon={<PadlockUnlockedIcon aria-hidden />}
                    onClick={() => makerKlart(false)}
                  >
                    Gjenåpne brevutkast
                  </Button>
                </div>
              </div>
              <iframe
                src={`/api/sak/${sak?.data.sakId}/brev/BREVEDITOR_VEDTAKSBREV#toolbar=0&navpanes=0&zoom=FitV`}
                width="100%"
                height="100%"
                allow="fullscreen"
                style={{ border: 'none' }}
              />
            </>
          )}
        </div>
      )}
    </>
  )
}
