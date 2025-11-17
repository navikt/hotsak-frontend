import { Alert, Box, Button, Heading, HStack, Modal, ReadMore, Select, VStack } from '@navikt/ds-react'
import { memo, useState } from 'react'
import { Brødtekst, TextContainer } from '../../../../../felleskomponenter/typografi'
import { useOppgave } from '../../../../../oppgave/useOppgave'
import { Innsenderbehovsmelding } from '../../../../../types/BehovsmeldingTypes'
import { Sak } from '../../../../../types/types.internal'
import { formaterDato } from '../../../../../utils/dato'
import { useSaksbehandlingEksperimentContext, VedtaksResultat } from '../SaksbehandlingEksperimentProvider'

interface BehandlingEksperimentPanelProps {
  sak: Sak
  behovsmelding: Innsenderbehovsmelding
}

function BehandlingEksperimentPanel({ sak, behovsmelding }: BehandlingEksperimentPanelProps) {
  const hjelpemidler = behovsmelding.hjelpemidler.hjelpemidler
  const {
    brevKolonne,
    setBrevKolonne,
    vedtaksResultat,
    setVedtaksResultat,
    lagretResultat,
    setLagretResultat,
    brevEksisterer,
    brevFerdigstilt,
  } = useSaksbehandlingEksperimentContext()
  const [visFeilmelding, setVisFeilmelding] = useState(false)
  const { oppgave } = useOppgave()
  const [visModalKanIkkeEndre, setVisModalKanIkkeEndre] = useState(false)
  // Husk å se på plassering av OeBS varsler.  Skal det vises hele tiden eller kun etter at vedtak er fattet?
  return (
    <Box.New
      background="default"
      borderRadius="large"
      padding={'space-16'}
      style={{ height: '100%', overflowY: 'auto' }}
    >
      <VStack gap="space-16">
        {hjelpemidler.length > 0 && (
          <Heading level="2" size="small">
            Behandling
          </Heading>
        )}

        <HStack gap="space-20">
          <Brødtekst data-tip="Saksnummer" data-for="sak" textColor="subtle">{`Sak: ${sak.sakId}`}</Brødtekst>
          {oppgave?.fristFerdigstillelse && (
            <Brødtekst textColor="subtle">Frist: {formaterDato(oppgave.fristFerdigstillelse)}</Brødtekst>
          )}
        </HStack>

        <ReadMore size="small" header="Hva skal du vurdere etter fltr. §10-6?">
          Her skal det stå nye nyttig og informativt
        </ReadMore>

        <Heading size="small" level="2">
          Vedtak
        </Heading>
        <TextContainer>
          <Brødtekst>Vedtaket blir ikke synlig for innbygger før du ferdigstiller oppgaven Behandle sak.</Brødtekst>
        </TextContainer>

        <Select
          size="small"
          label="Resultat"
          error={visFeilmelding ? 'Du må velge et vedtaksresultat' : undefined}
          readOnly={lagretResultat}
          style={{ width: 'auto' }}
          value={vedtaksResultat ? vedtaksResultat : ''}
          onChange={(e) => {
            if (e.target.value !== undefined) {
              setVisFeilmelding(false)
            }
            setVedtaksResultat(e.target.value as any)
          }}
        >
          {/*<option value={undefined}>-- Velg resultat --</option>*/}
          <option value={VedtaksResultat.INNVILGET}>Innvilget</option>
          <option value={VedtaksResultat.AVSLÅTT}>Avslått</option>
          <option value={VedtaksResultat.DELVIS_INNVILGET}>Delvis innvilget</option>
        </Select>
        <div>
          {lagretResultat ? (
            <Button
              variant="secondary"
              size="small"
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
          ) : (
            <Button
              variant="secondary"
              size="small"
              onClick={() => {
                if (!vedtaksResultat) {
                  setVisFeilmelding(true)
                } else {
                  setLagretResultat(true)
                }
              }}
            >
              Lagre resultat
            </Button>
          )}
        </div>

        {lagretResultat && (
          <Box.New>
            <Heading level="2" size="small">
              Underrette bruker
            </Heading>
            <TextContainer>
              <Brødtekst textColor="subtle">{underRetteBrukerTest(vedtaksResultat)}</Brødtekst>
            </TextContainer>
            <div>
              {!brevKolonne && (
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => {
                    // setBehandlingPanel(false)
                    setBrevKolonne(true)
                  }}
                  style={{ margin: '1em 0' }}
                >
                  {brevEksisterer ? 'Vis vedtaksbrev' : 'Opprett vedtaksbrev'}
                </Button>
              )}
              {(brevKolonne || brevFerdigstilt) && (
                <Alert
                  variant={brevFerdigstilt ? 'success' : 'info'}
                  size="small"
                  style={{ margin: brevKolonne ? '1em 0' : undefined }}
                >
                  {brevFerdigstilt
                    ? 'Du kan nå fatte vedtak hvis du er fornøyd!'
                    : 'Ferdigstill utkastet i brevpanelet'}
                </Alert>
              )}
            </div>
          </Box.New>
        )}
      </VStack>
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
      return 'Du må selv vurdere om du bør underette bruker om vedtaket med brev.'
    case VedtaksResultat.DELVIS_INNVILGET:
      return 'Du må sende vedtaksbrev ved delvis innvilgelse. Brevet blir sendt når du fatter vedtak.'
    case VedtaksResultat.AVSLÅTT:
      return 'Du må sende vedtaksbrev ved avslag. Brevet blir sendt når du fatter vedtak.'
  }
}

export default memo(BehandlingEksperimentPanel)
