import { Alert, Box, Button, HelpText, HStack, Tag, TextField } from '@navikt/ds-react'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Panel, PanelGroup } from 'react-resizable-panels'
import { mutate } from 'swr'
import { Feilmelding } from '../../../../felleskomponenter/feil/Feilmelding'
import { useToast } from '../../../../felleskomponenter/toast/ToastContext.tsx'
import { Brødtekst, Etikett, Tekst } from '../../../../felleskomponenter/typografi'
import { useOppgave } from '../../../../oppgave/useOppgave.ts'
import { usePerson } from '../../../../personoversikt/usePerson'
import { BekreftelseModal } from '../../../../saksbilde/komponenter/BekreftelseModal'
import { InfoModal } from '../../../../saksbilde/komponenter/InfoModal'
import { mutateSak } from '../../../../saksbilde/mutateSak.ts'
import { useBehovsmelding } from '../../../../saksbilde/useBehovsmelding'
import { UtfallLåst, VedtaksResultat } from '../../../../types/behandlingTyper.ts'
import { OppgaveStatusLabel, Sak } from '../../../../types/types.internal'
import { formaterTidsstempelLesevennlig } from '../../../../utils/dato.ts'
import { storForbokstavIAlleOrd, storForbokstavIOrd } from '../../../../utils/formater'
import { BrevPanelEksperiment } from '../brev/BrevPanelEksperiment'
import { PersonlinjeEksperiment } from '../felleskomponenter/personlinje/PersonlinjeEksperiment'
import { ResizeHandle } from '../felleskomponenter/ResizeHandle'
import BehandlingEksperimentPanel from './behandling/BehandlingEksperiment'
import { useBehandling } from './behandling/useBehandling.ts'
import { useBehandlingActions } from './behandling/useBehandlingActions.ts'
import { SakKontrollPanel } from './SakKontrollPanel'
import { useSaksbehandlingEksperimentContext } from './SaksbehandlingEksperimentProvider'
import { SidepanelEksperiment } from './sidepanel/SidepanelEksperiment'
import { SøknadPanelEksperiment } from './søknad/SøknadPanelEksperiment'

interface VedtakFormValues {
  problemsammendrag: string
}

export function SaksbehandlingEksperiment({ sak }: { sak: Sak }) {
  const { behovsmelding } = useBehovsmelding()
  const [visFerdigstillModal, setVisFerdigstillModal] = useState(false)
  const [vedtakLoader, setVedtakLoader] = useState(false)
  const { personInfo, isLoading: personInfoLoading } = usePerson(sak?.bruker.fnr)
  const [visResultatManglerModal, setVisResultatManglerModal] = useState(false)
  const [visBrevMangler, setVisBrevMangler] = useState(false)

  const { oppgave } = useOppgave()

  const mutateOppgave = () => mutate(`/api/oppgaver-v2/${oppgave?.oppgaveId}`)
  const mutateOppgaveOgSak = () => {
    if (sak.sakId) {
      return Promise.all([mutateOppgave(), mutateSak(sak.sakId)])
    }
    return mutateOppgave()
  }

  const {
    sidePanel,
    søknadPanel,
    brevKolonne,
    behandlingPanel,
    oppgaveFerdigstilt,
    setOppgaveFerdigstilt,
    brevEksisterer,
    brevFerdigstilt,
  } = useSaksbehandlingEksperimentContext()
  const { showSuccessToast } = useToast()

  const { gjeldendeBehandling } = useBehandling()
  const { ferdigstillBehandling } = useBehandlingActions()
  const vedtaksResultat = gjeldendeBehandling?.utfall?.utfall

  const form = useForm<VedtakFormValues>({
    defaultValues: {
      problemsammendrag: `${storForbokstavIAlleOrd(sak.søknadGjelder.replace('Søknad om:', '').trim())}; ${sak.sakId}`,
    },
  })

  const fattVedtak = async (data: VedtakFormValues) => {
    setVedtakLoader(true)
    setOppgaveFerdigstilt(true)
    setVisFerdigstillModal(false)
    await ferdigstillBehandling(data.problemsammendrag)
    await mutateOppgaveOgSak()
    setVedtakLoader(false)
    showSuccessToast('Vedtak fattet')
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
          height: '100%',
          marginTop: 'var(--ax-space-4)',
          marginInline: 'var(--ax-space-12)',
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
                  <SøknadPanelEksperiment sak={sak} behovsmelding={behovsmelding} />
                )}
              </Panel>
              {(brevKolonne || behandlingPanel || sidePanel) && <ResizeHandle />}
            </>
          )}
          {behandlingPanel && (
            <>
              <Panel defaultSize={25} minSize={10} order={3}>
                {sak && behovsmelding ? (
                  <BehandlingEksperimentPanel sak={sak} behovsmelding={behovsmelding} />
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
                <BrevPanelEksperiment />
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
                loading={vedtakLoader}
                onClick={() => {
                  if (!gjeldendeBehandling || !vedtaksResultat) {
                    setVisResultatManglerModal(true)
                  } else if (
                    (vedtaksResultat !== VedtaksResultat.INNVILGET && (!brevEksisterer || !brevFerdigstilt)) ||
                    (vedtaksResultat === VedtaksResultat.INNVILGET && brevEksisterer && !brevFerdigstilt)
                  ) {
                    setVisBrevMangler(true)
                  } else {
                    setVisFerdigstillModal(true)
                  }

                  // TODO: Hva med notatutkast? Skal vi legge inn det som en gjenstående greie også?
                  //if (harNotatUtkast) {
                  //setSubmitAttempt(true)
                  //} else {
                }}
              >
                Fatt vedtak
              </Button>
            )}
            {oppgaveFerdigstilt && gjeldendeBehandling?.utfallLåst === UtfallLåst.FERDIGSTILT && (
              <HStack gap="space-12" align="center">
                <Tag
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
                <Tekst>{`av: ${sak.saksbehandler?.navn} ${formaterTidsstempelLesevennlig(sak?.vedtak?.vedtaksdato)}`}</Tekst>
              </HStack>
            )}
            {!oppgaveFerdigstilt && (
              <Tag variant="neutral-moderate" size="small">
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
        <Brødtekst spacing>Du må velge et vedtaksresultat under "Behandle sak" før du kan fatte vedtak.</Brødtekst>
      </InfoModal>

      <InfoModal heading="Mangler brev" open={visBrevMangler} width="500px" onClose={() => setVisBrevMangler(false)}>
        {!brevEksisterer && (
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
        {brevEksisterer && (
          <>
            <Brødtekst spacing>Før du kan fatte vedtaket må du ferdigstille brevet du har påstartet.</Brødtekst>
          </>
        )}
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
