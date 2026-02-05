import { Alert, Box, Button, HelpText, HStack, Tag, TextField } from '@navikt/ds-react'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Panel, PanelGroup } from 'react-resizable-panels'
import BehandlingEksperimentPanel from '../../eksperimentelt/eksperimenter/KabalInspirert/saksbehandling/behandling/BehandlingEksperiment.tsx'
import { useBehandling } from '../../eksperimentelt/eksperimenter/KabalInspirert/saksbehandling/behandling/useBehandling.ts'
import { useBehandlingActions } from '../../eksperimentelt/eksperimenter/KabalInspirert/saksbehandling/behandling/useBehandlingActions.ts'
import { SidepanelEksperiment } from '../../eksperimentelt/eksperimenter/KabalInspirert/saksbehandling/sidepanel/SidepanelEksperiment.tsx'
import { SøknadPanelEksperiment } from '../../eksperimentelt/eksperimenter/KabalInspirert/saksbehandling/søknad/SøknadPanelEksperiment.tsx'
import { Feilmelding } from '../../felleskomponenter/feil/Feilmelding.tsx'
import { ResizeHandle } from '../../felleskomponenter/resize/ResizeHandle.tsx'
import { useToast } from '../../felleskomponenter/toast/ToastContext.tsx'
import { Brødtekst, Etikett, Tekst } from '../../felleskomponenter/typografi.tsx'
import { Oppgavestatus } from '../../oppgave/oppgaveTypes.ts'
import { useOppgave } from '../../oppgave/useOppgave.ts'
import { useOppgaveregler } from '../../oppgave/useOppgaveregler.ts'
import { usePerson } from '../../personoversikt/usePerson.ts'
import { BekreftelseModal } from '../../saksbilde/komponenter/BekreftelseModal.tsx'
import { InfoModal } from '../../saksbilde/komponenter/InfoModal.tsx'
import { Personlinje } from '../../saksbilde/Personlinje.tsx'
import { useBehovsmelding } from '../../saksbilde/useBehovsmelding.ts'
import { useSak } from '../../saksbilde/useSak.ts'
import { Gjenstående, UtfallLåst, VedtaksResultat } from '../../types/behandlingTyper.ts'
import { OppgaveStatusLabel } from '../../types/types.internal.ts'
import { formaterDato } from '../../utils/dato.ts'
import { storForbokstavIAlleOrd, storForbokstavIOrd } from '../../utils/formater.ts'
import { SakKontrollPanel } from './SakKontrollPanel.tsx'
import { useSaksbehandlingEksperimentContext } from './SakProvider.tsx'
import { BrevPanel } from '../../brev/BrevPanel.tsx'

interface VedtakFormValues {
  problemsammendrag: string
}

export function SakV2() {
  const { sak } = useSak()
  const { behovsmelding } = useBehovsmelding()
  const [visFerdigstillModal, setVisFerdigstillModal] = useState(false)
  const [vedtakLoader, setVedtakLoader] = useState(false)
  const { personInfo, isLoading: personInfoLoading } = usePerson(sak?.data.bruker.fnr)
  const [visResultatManglerModal, setVisResultatManglerModal] = useState(false)

  const [visBrevMangler, setVisBrevMangler] = useState(false)
  const [visNotatIkkeFerdigstilt, setVisNotatIkkeFerdigstilt] = useState(false)
  const { oppgave } = useOppgave()
  const { oppgaveErUnderBehandlingAvInnloggetAnsatt } = useOppgaveregler(oppgave)
  const oppgaveFerdigstilt = oppgave?.oppgavestatus === Oppgavestatus.FERDIGSTILT

  const { sidePanel, søknadPanel, brevKolonne, behandlingPanel } = useSaksbehandlingEksperimentContext()
  const { showSuccessToast } = useToast()

  const { gjeldendeBehandling } = useBehandling()
  const { ferdigstillBehandling } = useBehandlingActions()
  const vedtaksResultat = gjeldendeBehandling?.utfall?.utfall

  const gjenstående = gjeldendeBehandling?.gjenstående || []
  const brevutkastIkkeFerdigstilt =
    gjenstående.includes(Gjenstående.BREV_IKKE_FERDIGSTILT) || gjenstående.includes(Gjenstående.BREV_MANGLER)

  const notaterIkkeFerdigstilt = gjenstående.includes(Gjenstående.NOTAT_IKKE_FERDIGSTILT)

  const form = useForm<VedtakFormValues>({
    defaultValues: {
      problemsammendrag: `${storForbokstavIAlleOrd(sak?.data.søknadGjelder.replace('Søknad om:', '').trim())}; ${sak?.data.sakId}`,
    },
  })

  const fattVedtak = async (data: VedtakFormValues) => {
    setVedtakLoader(true)
    setVisFerdigstillModal(false)
    await ferdigstillBehandling(data.problemsammendrag)
    setVedtakLoader(false)
    showSuccessToast('Vedtak fattet')
  }

  if (!behovsmelding) {
    // TODO skeleton eller loader her?
    return <div>Fant ikke behovsmelding</div>
  }

  if (!sak) {
    // TODO skeleton eller loader her?
    return <div>Fant ikke sak</div>
  }

  return (
    <>
      <HStack width="100%" wrap={false}>
        <Personlinje loading={personInfoLoading} person={personInfo} skjulTelefonnummer />
        <SakKontrollPanel />
      </HStack>
      <Box.New
        style={{
          minHeight: 0,
          height: '100%',
          marginTop: 'var(--ax-space-4)',
          marginInline: '0 var(--ax-space-12)',
        }}
      >
        <PanelGroup direction="horizontal" autoSaveId="eksperimentellSaksbehandling">
          {sidePanel && (
            <>
              <Panel defaultSize={20} minSize={11} order={1}>
                <SidepanelEksperiment />
              </Panel>
              {(brevKolonne || søknadPanel || behandlingPanel) && <ResizeHandle />}
            </>
          )}
          {søknadPanel && (
            <>
              <Panel defaultSize={35} minSize={20} order={2}>
                {!sak || !behovsmelding ? (
                  'Fant ikke sak'
                ) : (
                  <SøknadPanelEksperiment sak={sak.data} behovsmelding={behovsmelding} />
                )}
              </Panel>
              {(brevKolonne || behandlingPanel || sidePanel) && <ResizeHandle />}
            </>
          )}
          {behandlingPanel && (
            <>
              <Panel defaultSize={25} minSize={10} order={3}>
                {sak && behovsmelding ? (
                  <BehandlingEksperimentPanel sak={sak.data} behovsmelding={behovsmelding} />
                ) : (
                  <Feilmelding>Fant ikke sak eller behovsmelding</Feilmelding>
                )}
              </Panel>
              {brevKolonne && <ResizeHandle />}
            </>
          )}
          {brevKolonne && (
            <>
              <Panel defaultSize={40} minSize={10} order={4}>
                <BrevPanel />
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
            {oppgaveErUnderBehandlingAvInnloggetAnsatt && (
              <Button
                type="button"
                variant="primary"
                size="small"
                loading={vedtakLoader}
                onClick={() => {
                  /* TODO Lage en mer generell validering. Skal vi vise alle valideringsfeil samlet? Lage mock funksjonalitet for notat ikke ferdigstilt i gjenstående */
                  if (!gjeldendeBehandling || !vedtaksResultat) {
                    setVisResultatManglerModal(true)
                  } else if (brevutkastIkkeFerdigstilt) {
                    setVisBrevMangler(true)
                  } else if (notaterIkkeFerdigstilt) {
                    setVisNotatIkkeFerdigstilt(true)
                  } else {
                    setVisFerdigstillModal(true)
                  }
                }}
              >
                Fatt vedtak
              </Button>
            )}
            {oppgaveFerdigstilt && gjeldendeBehandling?.utfallLåst?.includes(UtfallLåst.FERDIGSTILT) && (
              <HStack gap="space-12" align="center">
                <Tag
                  size="small"
                  variant={
                    oppgaveFerdigstilt && gjeldendeBehandling.utfall?.utfall == VedtaksResultat.INNVILGET
                      ? 'success-moderate'
                      : oppgaveFerdigstilt && gjeldendeBehandling.utfall?.utfall == VedtaksResultat.DELVIS_INNVILGET
                        ? 'warning-moderate'
                        : oppgaveFerdigstilt && gjeldendeBehandling.utfall?.utfall == VedtaksResultat.AVSLÅTT
                          ? 'error-moderate'
                          : 'neutral-moderate'
                  }
                >
                  {storForbokstavIOrd(gjeldendeBehandling.utfall?.utfall).replace(/_/g, ' ')}
                </Tag>
                <Tekst>{`av: ${sak.data.saksbehandler?.navn} ${formaterDato(sak.data.vedtak?.vedtaksdato)}`}</Tekst>
              </HStack>
            )}
            {!oppgaveFerdigstilt && (
              <Tag variant="neutral-moderate" size="small">
                {OppgaveStatusLabel.get(sak.data.saksstatus)}
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
        <Brødtekst spacing>Du må velge et vedtaksresultat under "Behandle sak" før du kan fatte vedtak.</Brødtekst>
      </InfoModal>
      <InfoModal heading="Mangler brev" open={visBrevMangler} width="500px" onClose={() => setVisBrevMangler(false)}>
        {gjenstående.includes(Gjenstående.BREV_MANGLER) && (
          <>
            <Brødtekst spacing>
              Når du fatter et vedtak med resultat "{storForbokstavIOrd(vedtaksResultat).replace(/_/g, ' ')}" er det
              krav om at man underetter brukeren med brev.
            </Brødtekst>
            <Brødtekst spacing>
              Velg "Opprett vedtaksbrev", rediger brevet, og merk så brevet som klart ved å klikke "Ferdigstill utkast".
              Deretter kan du prøve å fatte vedtaket på nytt.
            </Brødtekst>
          </>
        )}
        {gjenstående.includes(Gjenstående.BREV_IKKE_FERDIGSTILT) && (
          <Brødtekst spacing>Før du kan fatte vedtaket må du ferdigstille brevet du har påstartet.</Brødtekst>
        )}
      </InfoModal>

      <InfoModal
        heading="Notat ikke ferdigstilt"
        open={visNotatIkkeFerdigstilt}
        width="500px"
        onClose={() => setVisNotatIkkeFerdigstilt(false)}
      >
        <Brødtekst spacing>Du har et utkast til notat som må ferdigstilles eller slettes.</Brødtekst>
      </InfoModal>

      <BekreftelseModal
        heading={
          'Vil du ' +
          (vedtaksResultat == VedtaksResultat.DELVIS_INNVILGET
            ? 'delvis innvilge'
            : vedtaksResultat == VedtaksResultat.AVSLÅTT
              ? 'avslå'
              : 'innvilge') +
          ' søknaden?'
        }
        //loading={sakActions.state.loading}
        open={visFerdigstillModal}
        width="700px"
        bekreftButtonLabel={
          (vedtaksResultat === VedtaksResultat.DELVIS_INNVILGET
            ? 'Delvis innvilg'
            : vedtaksResultat === VedtaksResultat.AVSLÅTT
              ? 'Avslå'
              : 'Innvilg') + ' søknaden'
        }
        onBekreft={form.handleSubmit(fattVedtak)}
        onClose={() => setVisFerdigstillModal(false)}
      >
        {vedtaksResultat !== VedtaksResultat.AVSLÅTT && (
          <>
            <Brødtekst spacing>
              Når du {vedtaksResultat === VedtaksResultat.DELVIS_INNVILGET ? 'delvis innvilger' : 'innvilger'} søknaden
              vil det opprettes en serviceforespørsel (SF) i OeBS. Innbygger kan se vedtaket på innlogget side på nav.no
            </Brødtekst>
            {vedtaksResultat == VedtaksResultat.DELVIS_INNVILGET && (
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
        {vedtaksResultat == VedtaksResultat.AVSLÅTT && (
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
