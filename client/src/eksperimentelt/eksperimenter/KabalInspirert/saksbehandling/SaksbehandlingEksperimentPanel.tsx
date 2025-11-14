import { Alert, Box, Button, HelpText, HStack, TextField } from '@navikt/ds-react'
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

  const {
    sidePanel,
    søknadPanel,
    brevKolonne,
    behandlingPanel,
    oppgaveFerdigstilt,
    setOppgaveFerdigstilt,
    vedtaksResultat,
    lagretResultat,
  } = useSaksbehandlingEksperimentContext()

  interface VedtakFormValues {
    problemsammendrag: string
  }

  const form = useForm<VedtakFormValues>({
    defaultValues: {
      problemsammendrag: `${storForbokstavIAlleOrd(sak.søknadGjelder.replace('Søknad om:', '').trim())}; ${sak.sakId}`,
    },
  })

  const fattVedtak = async (data: VedtakFormValues) => {
    data
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
              {(brevKolonne || behandlingPanel) && <ResizeHandle />}
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
              {sidePanel && <ResizeHandle />}
            </>
          )}
          {brevKolonne && (
            <>
              <Panel defaultSize={40} minSize={10} order={3}>
                <BrevPanelEksperiment />
              </Panel>
              <ResizeHandle />
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
                  } else {
                    setVisFerdigstillModal(true)
                  }
                  //if (harNotatUtkast) {
                  //setSubmitAttempt(true)
                  //} else {
                }}
              >
                Ferdigstill oppgave
              </Button>
            )}
            <Alert variant="info" size="small" inline>
              {oppgaveFerdigstilt
                ? `Ferdigstilt - ${storForbokstavIOrd(vedtaksResultat)}`
                : OppgaveStatusLabel.get(sak.saksstatus)}
            </Alert>
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

      <BekreftelseModal
        heading="Vil du innvilge søknaden?"
        //loading={sakActions.state.loading}
        open={visFerdigstillModal}
        width="700px"
        bekreftButtonLabel="Innvilg søknaden"
        onBekreft={form.handleSubmit(fattVedtak)}
        onClose={() => setVisFerdigstillModal(false)}
      >
        <Brødtekst spacing>
          Når du innvilger søknaden vil det opprettes en serviceforespørsel (SF) i OeBS. Innbygger kan se vedtaket på
          innlogget side på nav.no
        </Brødtekst>
        <FormProvider {...form}>
          <TextField
            label={
              <HStack wrap={false} gap="2" align="center">
                <Etikett>Tekst til problemsammendrag i SF i OeBS</Etikett>
                <HelpText strategy="fixed">
                  <Brødtekst>
                    Foreslått tekst oppfyller registreringsinstruksen. Du kan redigere teksten i problemsammendraget
                    dersom det er nødvendig. Det kan du gjøre i feltet nedenfor før saken innvilges eller inne på SF i
                    OeBS som tidligere.
                  </Brødtekst>
                </HelpText>
              </HStack>
            }
            size="small"
            {...form.register('problemsammendrag', { required: 'Feltet er påkrevd' })}
          />
        </FormProvider>
      </BekreftelseModal>
    </>
  )
}
