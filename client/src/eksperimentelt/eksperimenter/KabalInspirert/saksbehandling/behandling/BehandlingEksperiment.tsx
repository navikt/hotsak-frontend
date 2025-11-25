import { Alert, Box, Button, Heading, HStack, Link, Modal, Select, Tag, VStack } from '@navikt/ds-react'
import { memo, useState } from 'react'
import { Brødtekst, Tekst, TextContainer } from '../../../../../felleskomponenter/typografi'
import { useOppgave } from '../../../../../oppgave/useOppgave'
import { Innsenderbehovsmelding } from '../../../../../types/BehovsmeldingTypes'
import { Sak } from '../../../../../types/types.internal'
import { formaterDato } from '../../../../../utils/dato'
import { useSaksbehandlingEksperimentContext, VedtaksResultat } from '../SaksbehandlingEksperimentProvider'
import { PanelTittel } from '../PanelTittel.tsx'
import { ExternalLinkIcon, PencilIcon } from '@navikt/aksel-icons'
import { useSøknadsVarsler } from '../../../../../saksbilde/varsler/useVarsler.tsx'
import { Saksvarsler } from '../../../../../saksbilde/bestillingsordning/Saksvarsler.tsx'
import { textcontainerBredde } from '../../../../../GlobalStyles.tsx'
import { storForbokstavIOrd } from '../../../../../utils/formater.ts'

interface BehandlingEksperimentPanelProps {
  sak: Sak
  behovsmelding: Innsenderbehovsmelding
}

function BehandlingEksperimentPanel({ sak }: BehandlingEksperimentPanelProps) {
  const {
    brevKolonne,
    setBrevKolonne,
    setBehandlingPanel,
    vedtaksResultat,
    lagretResultat,
    setOpprettBrevKlikket,
    brevEksisterer,
    brevFerdigstilt,
    oppgaveFerdigstilt,
  } = useSaksbehandlingEksperimentContext()

  const { oppgave } = useOppgave()
  const [visModalKanIkkeEndre, setVisModalKanIkkeEndre] = useState(false)
  const { varsler, harVarsler } = useSøknadsVarsler()
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

          {!oppgaveFerdigstilt ? (
            <VedtaksResultatVelger setVisModalKanIkkeEndre={setVisModalKanIkkeEndre} />
          ) : (
            <VedtaksResultatVisning oppgaveFerdigstilt={oppgaveFerdigstilt} vedtaksResultat={vedtaksResultat!} />
          )}

          {lagretResultat && (
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

function VedtaksResultatVisning({
  oppgaveFerdigstilt,
  vedtaksResultat,
}: {
  oppgaveFerdigstilt: boolean
  vedtaksResultat: VedtaksResultat
}) {
  return (
    <VStack gap="space-8">
      <Heading size="small" level="2" spacing={false}>
        Vedtaksresultat
      </Heading>
      <TextContainer>
        <Tag
          variant={
            oppgaveFerdigstilt && vedtaksResultat == 'INNVILGET'
              ? 'success-moderate'
              : oppgaveFerdigstilt && vedtaksResultat == 'DELVIS_INNVILGET'
                ? 'warning-moderate'
                : oppgaveFerdigstilt && vedtaksResultat == 'AVSLÅTT'
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

function VedtaksResultatVelger({ setVisModalKanIkkeEndre }: { setVisModalKanIkkeEndre: (åpen: boolean) => void }) {
  const {
    vedtaksResultat,
    setVedtaksResultat,
    setLagretResultat,
    brevEksisterer,
    brevFerdigstilt,
    oppgaveFerdigstilt,
  } = useSaksbehandlingEksperimentContext()

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
        value={vedtaksResultat ? vedtaksResultat : ''}
        onChange={(e) => {
          if (e.target.value !== VedtaksResultat.IKKE_VALGT) {
            setLagretResultat(true)
          } else {
            setLagretResultat(false)
          }
          setVedtaksResultat(e.target.value as any)
        }}
      >
        <option value={VedtaksResultat.IKKE_VALGT}>-- Velg resultat --</option>
        <option value={VedtaksResultat.INNVILGET}>Innvilget</option>
        <option value={VedtaksResultat.DELVIS_INNVILGET}>Delvis innvilget</option>
        <option value={VedtaksResultat.AVSLÅTT}>Avslått</option>
      </Select>
      <div>
        {!oppgaveFerdigstilt && (
          <>
            {brevEksisterer && !brevFerdigstilt && (
              <Button
                variant="tertiary"
                size="small"
                icon={<PencilIcon />}
                onClick={() => {
                  if (brevEksisterer) {
                    setVisModalKanIkkeEndre(true)
                    return
                  }
                  setLagretResultat(false)
                }}
              >
                Endre resultat
              </Button>
            )}
          </>
        )}
      </div>
    </>
  )
}
