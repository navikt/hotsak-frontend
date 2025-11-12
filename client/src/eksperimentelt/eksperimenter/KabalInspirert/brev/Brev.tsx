import './Brev.less'
import { ActionMenu, Alert, Button, Loader, Tag } from '@navikt/ds-react'
import useSWR from 'swr'
import Breveditor, { StateMangement } from './breveditor/Breveditor.tsx'
import { useEffect, useMemo, useState } from 'react'
import { useSak } from '../../../../saksbilde/useSak.ts'
import { BrevmalVelger } from './brevmaler/Brevmaler.tsx'
import { formaterDatoLang } from '../../../../utils/dato.ts'
import { CheckmarkIcon, MenuElipsisVerticalCircleIcon, PadlockUnlockedIcon, TrashIcon } from '@navikt/aksel-icons'

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

  useEffect(() => {
    // Når backend er oppdatert med state fjerner vi mal-valget slik at vi ikke ender opp i en loop
    if (brevutkast.data?.data?.value) velgMal(undefined)
  }, [brevutkast.data])

  if (brevutkast.isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '2em' }}>
        <Loader title="Laster inn brevutkast..." />
      </div>
    )
  } else if (brevutkast.error) {
    return (
      <div style={{ textAlign: 'center', padding: '2em' }}>
        <Alert variant="warning">Brev ikke tilgjengelig.</Alert>
      </div>
    )
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
    }).then((res) => {
      if (brevutkast.data) {
        // Ingen lokal mutate her siden et av de mulige resultatene her er at brevet merkes som ferdig og endrer viewet
        // til en forhåndsvisning av de lagrede dataene som PDF
        brevutkast.mutate()
      }
      return res
    })
  }

  const onSlettBrev = async () => {
    velgMal(undefined) // Unngå at forrige valgte mal trigger at breveditoren laster den på nytt
    await fetch(`/api/sak/${sak!.data.sakId}/brevutkast/BREVEDITOR_VEDTAKSBREV`, {
      method: 'delete',
    }).then((res) => {
      if (!res.ok) throw new Error(`Brev ikke slettet, statuskode ${res.status}`)
    })
    await brevutkast.mutate()
  }

  const makerKlart = (klart: boolean) => {
    if (brevutkast.data?.data?.value) {
      lagreBrevutkast({ ...brevutkast.data.data, markertKlart: klart })
    }
  }

  return (
    <>
      {errorEr404 && valgtMal === undefined && <BrevmalVelger velgMal={velgMal} />}
      {(!errorEr404 || valgtMal !== undefined) && brevutkast.data && (
        <div className="brev">
          {!brevutkast.data?.data?.markertKlart && (
            <>
              <div className="brevtoolbar">
                <div className="left">
                  <Tag variant="warning-moderate" size="small">
                    Delvis innvilget
                  </Tag>
                </div>
                <div className="right">
                  <Button
                    loading={brevutkast.isLoading || brevutkast.isValidating}
                    variant="primary"
                    size="small"
                    icon={<CheckmarkIcon aria-hidden />}
                    onClick={() => makerKlart(true)}
                  >
                    Marker som ferdig
                  </Button>
                  <ActionMenu>
                    <ActionMenu.Trigger>
                      <Button
                        variant="tertiary-neutral"
                        size="small"
                        icon={<MenuElipsisVerticalCircleIcon aria-hidden />}
                      />
                    </ActionMenu.Trigger>
                    <ActionMenu.Content>
                      <ActionMenu.Item icon={<TrashIcon fontSize="1rem" />} onSelect={onSlettBrev}>
                        Slett brevutkastet
                      </ActionMenu.Item>
                    </ActionMenu.Content>
                  </ActionMenu>
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
                onSlettBrev={onSlettBrev}
              />
            </>
          )}
          {brevutkast.data?.data?.markertKlart && (
            <>
              <div className="brevtoolbar">
                <div className="left">
                  <Tag variant="warning-moderate" size="small">
                    Delvis innvilget
                  </Tag>
                  <Tag variant="success-moderate" size="small">
                    Brev klart
                  </Tag>
                </div>
                <div className="right">
                  <Button
                    variant="tertiary"
                    size="small"
                    icon={<PadlockUnlockedIcon aria-hidden />}
                    onClick={() => makerKlart(false)}
                  >
                    Åpne for redigering
                  </Button>
                </div>
              </div>
              <iframe
                src={`/api/sak/${sak?.data.sakId}/brev/BREVEDITOR_VEDTAKSBREV#navpanes=0&zoom=FitV`}
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
