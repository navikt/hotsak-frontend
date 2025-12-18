import { ExternalLinkIcon } from '@navikt/aksel-icons'
import { Alert, Box, Button, Heading, HStack, Link, Modal, Select, Tag, VStack } from '@navikt/ds-react'
import { memo, useState } from 'react'
import { Brødtekst, Tekst, TextContainer } from '../../../../../felleskomponenter/typografi'
import { useOppgave } from '../../../../../oppgave/useOppgave'
import { UtfallLåst, VedtaksResultat } from '../../../../../types/behandlingTyper.ts'
import { Innsenderbehovsmelding } from '../../../../../types/BehovsmeldingTypes'
import { Sak } from '../../../../../types/types.internal'
import { formaterDato } from '../../../../../utils/dato'
import { storForbokstavIOrd } from '../../../../../utils/formater.ts'
import { PanelTittel } from '../PanelTittel.tsx'
import { useSaksbehandlingEksperimentContext } from '../SaksbehandlingEksperimentProvider'
import { useBehandling } from './useBehandling.ts'
import { useBehandlingActions } from './useBehandlingActions.ts'
import { useSøknadsVarsler } from '../../../../../saksbilde/varsler/useVarsler.tsx'
import { textcontainerBredde } from '../../../../../GlobalStyles.tsx'
import { Saksvarsler } from '../../../../../saksbilde/bestillingsordning/Saksvarsler.tsx'
import { Oppgavestatus } from '../../../../../oppgave/oppgaveTypes.ts'

interface BehandlingEksperimentPanelProps {
  sak: Sak
  behovsmelding: Innsenderbehovsmelding
}

function BehandlingEksperimentPanel({ sak }: BehandlingEksperimentPanelProps) {
  const { brevKolonne, setBrevKolonne, setBehandlingPanel, setOpprettBrevKlikket, brevEksisterer, brevFerdigstilt } =
    useSaksbehandlingEksperimentContext()

  const { oppgave } = useOppgave()
  const oppgaveFerdigstilt = oppgave?.oppgavestatus === Oppgavestatus.FERDIGSTILT
  const { gjeldendeBehandling } = useBehandling()
  const [visModalKanIkkeEndre, setVisModalKanIkkeEndre] = useState(false)
  const { varsler, harVarsler } = useSøknadsVarsler()

  const vedtaksResultat = (gjeldendeBehandling?.utfall?.utfall as VedtaksResultat) || null
  //const gjenstående = gjeldendeBehandling?.gjenstående || []

  //const brevIkkeFerdigstilt = gjenstående.includes(Gjenstående.BREV_IKKE_FERDIGSTILT)

  return (
    <Box.New background="default" borderRadius="large" paddingBlock="0 space-48" style={{ height: '100%' }}>
      <PanelTittel
        tittel="Behandle sak"
        lukkPanel={() => {
          setBehandlingPanel(false)
        }}
      />
      <div style={{ height: '100%', overflowY: 'auto' }}>
        <VStack gap="space-16" paddingInline="space-16">
          <HStack gap="space-20">
            <Brødtekst data-tip="Saksnummer" data-for="sak" textColor="subtle">{`Sak: ${sak.sakId}`}</Brødtekst>
            {oppgave?.fristFerdigstillelse && (
              <Brødtekst textColor="subtle">Frist: {formaterDato(oppgave.fristFerdigstillelse)}</Brødtekst>
            )}
          </HStack>

          <Tekst>
            <Link href="https://lovdata.no/lov/1997-02-28-19/§10-6" target="_blank">
              Slå opp folketrygdlovens § 10-6 i Lovdata <ExternalLinkIcon />
            </Link>
          </Tekst>

          {!oppgaveFerdigstilt && (
            <VedtaksResultatVelger utfall={vedtaksResultat} setVisModalKanIkkeEndre={setVisModalKanIkkeEndre} />
          )}

          {oppgaveFerdigstilt && vedtaksResultat && gjeldendeBehandling?.utfallLåst === UtfallLåst.FERDIGSTILT && (
            <VedtaksResultatVisning vedtaksResultat={vedtaksResultat} />
          )}

          {vedtaksResultat && (
            <TextContainer>
              <Box.New>
                <Heading level="2" size="small" spacing>
                  Vedtaksbrev
                </Heading>
                <VStack gap="space-12">
                  {brevFerdigstilt && oppgaveFerdigstilt && (
                    <Alert size="small" variant="info">
                      Brev lagt til utsending - sendes neste virkedag
                    </Alert>
                  )}
                  {!brevEksisterer && oppgaveFerdigstilt && vedtaksResultat === VedtaksResultat.INNVILGET && (
                    <Alert size="small" variant="info">
                      Saken er innvilget uten å sende brev
                    </Alert>
                  )}
                  {!oppgaveFerdigstilt && (
                    <TextContainer>
                      <Brødtekst textColor="subtle">{underRetteBrukerTest(vedtaksResultat)}</Brødtekst>
                    </TextContainer>
                  )}
                  {((!oppgaveFerdigstilt && !brevEksisterer) ||
                    (!brevKolonne && (!oppgaveFerdigstilt || brevEksisterer))) && (
                    <div>
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => {
                          setBrevKolonne(true)
                          if (!brevEksisterer) setOpprettBrevKlikket(true)
                        }}
                      >
                        {brevEksisterer ? 'Vis vedtaksbrev' : 'Opprett vedtaksbrev'}
                      </Button>
                    </div>
                  )}
                  {(brevKolonne || brevFerdigstilt) && brevEksisterer && !oppgaveFerdigstilt && (
                    <TextContainer>
                      <Alert variant="info" size="small" style={{ margin: brevKolonne ? '1em 0' : undefined }}>
                        {brevFerdigstilt
                          ? 'Du har markert brevet som ferdigstilt, og kan gå videre til å fatte vedtaket.'
                          : 'Ferdigstill utkastet i brevpanelet'}
                      </Alert>
                    </TextContainer>
                  )}
                </VStack>
              </Box.New>
            </TextContainer>
          )}
          {oppgaveFerdigstilt &&
            (vedtaksResultat === VedtaksResultat.INNVILGET || vedtaksResultat === VedtaksResultat.DELVIS_INNVILGET) &&
            harVarsler && (
              <>
                <Heading level="2" size="small">
                  Videre behandling i OeBS
                </Heading>
                <Tekst>Saken kan nå tas videre i OeBS</Tekst>
                <div style={{ maxWidth: `${textcontainerBredde}` }}>
                  <Saksvarsler varsler={varsler} />
                </div>
              </>
            )}
        </VStack>
      </div>
      <Modal
        open={visModalKanIkkeEndre}
        onClose={() => setVisModalKanIkkeEndre(false)}
        aria-label="Du må slette brevutkastet før du kan endre resultatet"
      >
        <Modal.Header closeButton>
          <Heading level="1" size="small">
            Du må slette brevutkastet før du kan endre resultatet
          </Heading>
        </Modal.Header>
        <Modal.Body>
          Hvis du vil endre vedtaksresultatet må du først slette brevutkastet. Valget for å slette utkastet finner du
          under menyen "Flere valg" i brevpanelet.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" size="small" onClick={() => setVisModalKanIkkeEndre(false)}>
            Lukk
          </Button>
        </Modal.Footer>
      </Modal>
    </Box.New>
  )
}

function underRetteBrukerTest(vedtaksResultat?: VedtaksResultat) {
  if (!vedtaksResultat) {
    return null
  }
  switch (vedtaksResultat) {
    case VedtaksResultat.INNVILGET:
      return 'Du må selv vurdere om det er behov for å sende vedtaksbrev.'
    case VedtaksResultat.DELVIS_INNVILGET:
      return 'Du må sende vedtaksbrev ved delvis innvilgelse. Brevet blir sendt når du fatter vedtak.'
    case VedtaksResultat.AVSLÅTT:
      return 'Du må sende vedtaksbrev ved avslag. Brevet blir sendt når du fatter vedtak.'
  }
}

export default memo(BehandlingEksperimentPanel)

function VedtaksResultatVisning({ vedtaksResultat }: { vedtaksResultat: VedtaksResultat }) {
  return (
    <VStack gap="space-8">
      <Heading size="small" level="2" spacing={false}>
        Vedtaksresultat
      </Heading>
      <TextContainer>
        <Tag
          variant={
            vedtaksResultat == VedtaksResultat.INNVILGET
              ? 'success-moderate'
              : vedtaksResultat == VedtaksResultat.DELVIS_INNVILGET
                ? 'warning-moderate'
                : vedtaksResultat == VedtaksResultat.AVSLÅTT
                  ? 'error-moderate'
                  : 'neutral-moderate'
          }
        >
          {storForbokstavIOrd(vedtaksResultat).replace(/_/g, ' ')}
        </Tag>
      </TextContainer>
    </VStack>
  )
}

function VedtaksResultatVelger({
  utfall,
}: {
  setVisModalKanIkkeEndre: (åpen: boolean) => void
  utfall: VedtaksResultat | null
}) {
  const { brevEksisterer } = useSaksbehandlingEksperimentContext()
  const { oppgave } = useOppgave()
  const oppgaveFerdigstilt = oppgave?.oppgavestatus === Oppgavestatus.FERDIGSTILT

  const { lagreBehandling } = useBehandlingActions()

  return (
    <>
      <VStack>
        <Heading size="small" level="2" spacing={false}>
          Vurderingen din
        </Heading>
        <TextContainer>
          <Brødtekst>Vurderingen din blir ikke synlig for bruker før du har fattet vedtak i saken.</Brødtekst>
        </TextContainer>
      </VStack>

      <Select
        size="small"
        label="Resultat"
        readOnly={brevEksisterer || oppgaveFerdigstilt}
        style={{ width: 'auto' }}
        value={utfall ? utfall : ''}
        onChange={async (e) => {
          if (utfall === (e.target.value as VedtaksResultat)) {
            console.log('Samme utfall valgt, ingen endring')
            return
          }
          if (e.target.value !== '') {
            await lagreBehandling({ utfall: e.target.value as VedtaksResultat, type: 'VEDTAK' })
          } else {
            await lagreBehandling(undefined)
          }
        }}
      >
        <option value="">-- Velg resultat --</option>
        <option value={VedtaksResultat.INNVILGET}>Innvilget</option>
        <option value={VedtaksResultat.DELVIS_INNVILGET}>Delvis innvilget</option>
        <option value={VedtaksResultat.AVSLÅTT}>Avslått</option>
      </Select>
    </>
  )
}
