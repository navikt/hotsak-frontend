import './Brev.less'
import { ActionMenu, Alert, Button, Loader } from '@navikt/ds-react'
import useSWR from 'swr'
import Breveditor, { StateMangement } from './breveditor/Breveditor.tsx'
import { useEffect, useMemo, useState } from 'react'
import { useSak } from '../../../../saksbilde/useSak.ts'
import { formaterDatoLang } from '../../../../utils/dato.ts'
import { ChevronDownIcon } from '@navikt/aksel-icons'
import { useSaksbehandlingEksperimentContext } from '../saksbehandling/SaksbehandlingEksperimentProvider.tsx'
import { BrevmalLaster } from './brevmaler/BrevmalLaster.tsx'
import { PanelTittel } from '../saksbehandling/PanelTittel.tsx'

export const Brev = () => {
  const { sak } = useSak()
  const { vedtaksResultat, lagretResultat, setBrevKolonne, setBrevEksisterer, setBrevFerdigstilt, oppgaveFerdigstilt } =
    useSaksbehandlingEksperimentContext()
  const { USE_MSW } = window.appSettings

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

  const malKey = errorEr404
    ? lagretResultat && vedtaksResultat == 'INNVILGET'
      ? 'innvilgelse'
      : lagretResultat && vedtaksResultat == 'DELVIS_INNVILGET'
        ? 'delvis-innvilgelse-bruker-har-ikke-rett'
        : lagretResultat && vedtaksResultat == 'AVSLÅTT'
          ? 'avslag-bruker-har-ikke-rett'
          : undefined
    : undefined

  useEffect(() => {
    // Når backend er oppdatert med state fjerner vi mal-valget slik at vi ikke ender opp i en loop
    if (brevutkast.data?.data?.value) {
      velgMal(undefined)
      setBrevEksisterer(true)
    }
  }, [brevutkast.data, setBrevEksisterer])

  if (brevutkast.isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '2em' }}>
        <Loader title="Laster inn brevutkast..." />
      </div>
    )
  } else if (brevutkast.error) {
    return (
      <div style={{ textAlign: 'center', padding: '2em' }}>
        <Alert variant="warning">Får ikke kontakt med tjeneren, brev ikke tilgjengelig. Prøv igjen senere.</Alert>
      </div>
    )
  }

  const lagreBrevutkast = async (data: any) => {
    // console.log('\n' + (data as StateMangement).valueAsHtml)
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
    setBrevEksisterer(false)
    setBrevKolonne(false)
    await brevutkast.mutate()
  }

  const makerKlart = (klart: boolean) => {
    if (brevutkast.data?.data?.value) {
      lagreBrevutkast({ ...brevutkast.data.data, markertKlart: klart })
      setBrevFerdigstilt(klart)
    }
  }

  return (
    <>
      {errorEr404 && valgtMal === undefined && malKey === undefined && (
        <div style={{ padding: '1em' }}>
          <Alert variant="info" size="small">
            I fremtiden vil man kunne opprette brev underveis i saken her. For nå må du sette et vedtaksresultat i
            behandlingspanelet og velge om du vil opprette vedtaksbrev der.
          </Alert>
        </div>
      )}
      {errorEr404 && valgtMal === undefined && malKey !== undefined && (
        <BrevmalLaster malKey={malKey} velgMal={velgMal} />
      )}
      {(!errorEr404 || valgtMal !== undefined) && brevutkast.data && (
        <div className="brev">
          {!brevutkast.data?.data?.markertKlart && (
            <>
              <div className="brevtoolbar">
                <div className="left">
                  <ActionMenu>
                    <ActionMenu.Trigger>
                      <Button
                        variant="tertiary"
                        size="small"
                        icon={<ChevronDownIcon aria-hidden />}
                        iconPosition="right"
                      >
                        Flere valg
                      </Button>
                    </ActionMenu.Trigger>
                    <ActionMenu.Content>
                      <ActionMenu.Item onSelect={onSlettBrev}>Slett brevutkast</ActionMenu.Item>
                    </ActionMenu.Content>
                  </ActionMenu>
                </div>
                <div className="right">
                  <Button
                    loading={brevutkast.isLoading || brevutkast.isValidating}
                    variant="secondary"
                    size="small"
                    onClick={() => makerKlart(true)}
                  >
                    Ferdigstill utkast
                  </Button>
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
              {!oppgaveFerdigstilt && (
                <>
                  <div className="brevtoolbar">
                    <div className="left"></div>
                    <div className="right">
                      <Button variant="tertiary" size="small" onClick={() => makerKlart(false)}>
                        Rediger
                      </Button>
                    </div>
                  </div>
                </>
              )}
              {oppgaveFerdigstilt && (
                <div style={{ padding: '0.8em 1em' }}>
                  <PanelTittel tittel="Vedtaksbrev" lukkPanel={() => setBrevKolonne(false)} />
                </div>
              )}
              <iframe
                src={`/api/sak/${sak?.data.sakId}/brev/BREVEDITOR_VEDTAKSBREV${USE_MSW ? '_' + vedtaksResultat : ''}#navpanes=0&zoom=FitV`}
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
