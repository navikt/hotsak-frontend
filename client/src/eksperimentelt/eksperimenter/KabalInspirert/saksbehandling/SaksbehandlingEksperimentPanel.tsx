import { Alert, Box, Button, HelpText, HStack, Tag, TextField } from '@navikt/ds-react'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Panel, PanelGroup } from 'react-resizable-panels'
import { Feilmelding } from '../../../../felleskomponenter/feil/Feilmelding'
import { Brødtekst, Etikett } from '../../../../felleskomponenter/typografi'
import { usePerson } from '../../../../personoversikt/usePerson'
import { BekreftelseModal } from '../../../../saksbilde/komponenter/BekreftelseModal'
import { useBehovsmelding } from '../../../../saksbilde/useBehovsmelding'
import { OppgaveStatusLabel, Sak } from '../../../../types/types.internal'
import { storForbokstavIAlleOrd, storForbokstavIOrd } from '../../../../utils/formater'
import { BrevPanelEksperiment } from '../brev/BrevPanelEksperiment'
import { PersonlinjeEksperiment } from '../felleskomponenter/personlinje/PersonlinjeEksperiment'
import { ResizeHandle } from '../felleskomponenter/ResizeHandle'
import BehandlingEksperimentPanel from './behandling/BehandlingEksperiment'
import { SakKontrollPanel } from './SakKontrollPanel'
import { useSaksbehandlingEksperimentContext } from './SaksbehandlingEksperimentProvider'
import { SidepanelEksperiment } from './sidepanel/SidepanelEksperiment'
import { SøknadPanelEksperiment } from './søknad/SøknadPanelEksperiment'
import { InfoModal } from '../../../../saksbilde/komponenter/InfoModal'

export function SaksbehandlingEksperiment({ sak }: { sak: Sak }) {
  const { behovsmelding } = useBehovsmelding()
  const [visFerdigstillModal, setVisFerdigstillModal] = useState(false)
  const { personInfo, isLoading: personInfoLoading } = usePerson(sak?.bruker.fnr)
  const [visResultatManglerModal, setVisResultatManglerModal] = useState(false)
  const [visBrevMangler, setVisBrevMangler] = useState(false)

  const {
    sidePanel,
    søknadPanel,
    brevKolonne,
    behandlingPanel,
    oppgaveFerdigstilt,
    setOppgaveFerdigstilt,
    vedtaksResultat,
    lagretResultat,
    brevEksisterer,
    brevFerdigstilt,
  } = useSaksbehandlingEksperimentContext()

  interface VedtakFormValues {
    problemsammendrag: string
  }

  const form = useForm<VedtakFormValues>({
    defaultValues: {
      problemsammendrag: `${storForbokstavIAlleOrd(sak.søknadGjelder.replace('Søknad om:', '').trim())}; ${sak.sakId}`,
    },
  })

  const fattVedtak = async (/*data: VedtakFormValues*/) => {
    setOppgaveFerdigstilt(true)
    setVisFerdigstillModal(false)
  }

  if (!behovsmelding) {
    // TODO skeleton eller loader her?
    return <div>Fant ikke behovsmelding</div>
  }

  return (
    <>
      <HStack width="100%" wrap={false}>
        <PersonlinjeEksperiment loading={personInfoLoading} person={personInfo} skjulTelefonnummer />
        <SakKontrollPanel />
      </HStack>
      <Box.New
        style={{
          minHeight: 0,
          marginTop: 'var(--ax-space-4)',
          marginInline: 'var(--ax-space-12)',
        }}
      >
        <PanelGroup direction="horizontal" autoSaveId="eksperimentellSaksbehandling">
          {søknadPanel && (
            <>
              <Panel defaultSize={35} minSize={20} order={1}>
                {!sak || !behovsmelding ? (
                  'Fant ikke sak'
                ) : (
                  <SøknadPanelEksperiment sak={sak} behovsmelding={behovsmelding} />
                )}
              </Panel>
              {(brevKolonne || behandlingPanel || sidePanel) && <ResizeHandle />}
            </>
          )}
          {behandlingPanel && (
            <>
              <Panel defaultSize={25} minSize={10} order={2}>
                {sak && behovsmelding ? (
                  <BehandlingEksperimentPanel sak={sak} behovsmelding={behovsmelding} />
                ) : (
                  <Feilmelding>Fant ikke sak eller behovsmelding</Feilmelding>
                )}
              </Panel>
              {(sidePanel || brevKolonne) && <ResizeHandle />}
            </>
          )}
          {brevKolonne && (
            <>
              <Panel defaultSize={40} minSize={10} order={3}>
                <BrevPanelEksperiment />
              </Panel>
              {sidePanel && <ResizeHandle />}
            </>
          )}
          {sidePanel && (
            <>
              <Panel defaultSize={20} minSize={11} order={4}>
                <SidepanelEksperiment />
              </Panel>
            </>
          )}
        </PanelGroup>
      </Box.New>

      <HStack
        asChild
        position="sticky"
        left="0"
        bottom="0"
        align="center"
        justify="space-between"
        gap="4"
        paddingInline="4"
        paddingBlock="2"
        width="100%"
        className="z-23"
      >
        <Box.New background="default" borderWidth="1 0 0 0" borderColor="neutral-subtle">
          <HStack align="center" justify="space-between" gap="space-24">
            {!oppgaveFerdigstilt && (
              <Button
                type="button"
                variant="primary"
                size="small"
                onClick={() => {
                  if (!lagretResultat) {
                    setVisResultatManglerModal(true)
                  } else if (
                    lagretResultat &&
                    ((vedtaksResultat != 'INNVILGET' && (!brevEksisterer || !brevFerdigstilt)) ||
                      (vedtaksResultat == 'INNVILGET' && brevEksisterer && !brevFerdigstilt))
                  ) {
                    setVisBrevMangler(true)
                  } else {
                    setVisFerdigstillModal(true)
                  }
                  //if (harNotatUtkast) {
                  //setSubmitAttempt(true)
                  //} else {
                }}
              >
                Fatt vedtak
              </Button>
            )}
            {oppgaveFerdigstilt && vedtaksResultat && (
              <Tag
                variant={
                  oppgaveFerdigstilt && vedtaksResultat == 'INNVILGET'
                    ? 'success'
                    : oppgaveFerdigstilt && vedtaksResultat == 'DELVIS_INNVILGET'
                      ? 'warning'
                      : oppgaveFerdigstilt && vedtaksResultat == 'AVSLÅTT'
                        ? 'error'
                        : 'neutral'
                }
              >
                {storForbokstavIOrd(vedtaksResultat).replace(/_/g, ' ')}
              </Tag>
            )}
            {!oppgaveFerdigstilt && (
              <Tag variant="neutral-moderate" size="xsmall">
                {OppgaveStatusLabel.get(sak.saksstatus)}
              </Tag>
            )}
          </HStack>
        </Box.New>
      </HStack>

      <InfoModal
        heading="Mangler resultat"
        open={visResultatManglerModal}
        width="500px"
        onClose={() => setVisResultatManglerModal(false)}
      >
        <Brødtekst spacing>
          Du må velge et vedtaksresultat under "Behandling" før du kan ferdigstille oppgaven.
        </Brødtekst>
      </InfoModal>

      <InfoModal heading="Mangler brev" open={visBrevMangler} width="500px" onClose={() => setVisBrevMangler(false)}>
        {!brevEksisterer && (
          <>
            <Brødtekst spacing>
              Når du fatter et vedtak med resultat "{storForbokstavIOrd(vedtaksResultat).replace(/_/g, ' ')}" er det
              krav om at manunderetter brukeren med brev.
            </Brødtekst>
            <Brødtekst spacing>
              Velg "Opprett vedtaksbrev", rediger brevet, og merk så brevet som klart ved å klikke "Ferdigstill utkast".
              Deretter kan du prøve å fatte vedtaket på nytt.
            </Brødtekst>
          </>
        )}
        {brevEksisterer && (
          <>
            <Brødtekst spacing>Før du kan fatte vedtaket må du ferdigstille brevet du har påstartet.</Brødtekst>
          </>
        )}
      </InfoModal>

      <BekreftelseModal
        heading={
          'Vil du ' +
          (vedtaksResultat == 'DELVIS_INNVILGET'
            ? 'delvis innvilge'
            : vedtaksResultat == 'AVSLÅTT'
              ? 'avslå'
              : 'innvilge') +
          ' søknaden?'
        }
        //loading={sakActions.state.loading}
        open={visFerdigstillModal}
        width="700px"
        bekreftButtonLabel={
          (vedtaksResultat == 'DELVIS_INNVILGET'
            ? 'Delvis innvilg'
            : vedtaksResultat == 'AVSLÅTT'
              ? 'Avslå'
              : 'Innvilg') + ' søknaden'
        }
        onBekreft={form.handleSubmit(fattVedtak)}
        onClose={() => setVisFerdigstillModal(false)}
      >
        {vedtaksResultat != 'AVSLÅTT' && (
          <>
            <Brødtekst spacing>
              Når du {vedtaksResultat == 'DELVIS_INNVILGET' ? 'delvis innvilger' : 'innvilger'} søknaden vil det
              opprettes en serviceforespørsel (SF) i OeBS. Innbygger kan se vedtaket på innlogget side på nav.no
            </Brødtekst>
            {vedtaksResultat == 'DELVIS_INNVILGET' && (
              <Alert variant="info" size="small" style={{ margin: '1em 0' }}>
                Når du delvis innvilger må du huske å redigere hjepemidlene i serviceforespøreselen i OeBS før du
                oppretter ordre.
              </Alert>
            )}
            <FormProvider {...form}>
              <TextField
                label={
                  <HStack wrap={false} gap="2" align="center">
                    <Etikett>Tekst til problemsammendrag i SF i OeBS</Etikett>
                    <HelpText strategy="fixed">
                      <Brødtekst>
                        Foreslått tekst oppfyller registreringsinstruksen. Du kan redigere teksten i problemsammendraget
                        dersom det er nødvendig. Det kan du gjøre i feltet nedenfor før saken innvilges eller inne på SF
                        i OeBS som tidligere.
                      </Brødtekst>
                    </HelpText>
                  </HStack>
                }
                size="small"
                {...form.register('problemsammendrag', { required: 'Feltet er påkrevd' })}
              />
            </FormProvider>
          </>
        )}
        {vedtaksResultat == 'AVSLÅTT' && (
          <>
            <Brødtekst spacing>
              Når du avslår søknaden vil det naturligvis ikke opprettes en serviceforespørsel (SF) i OeBS. Bruker
              underrettes med brevet du har forfattet. Innbygger kan også se vedtaket på innlogget side på nav.no
            </Brødtekst>
          </>
        )}
      </BekreftelseModal>
    </>
  )
}
