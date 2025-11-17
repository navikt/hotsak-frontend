import { Alert, Box, Button, Heading, HStack, ReadMore, Select, VStack } from '@navikt/ds-react'
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
  } = useSaksbehandlingEksperimentContext()
  const [visFeilmelding, setVisFeilmelding] = useState(false)
  const { oppgave } = useOppgave()
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
            <Button variant="secondary" size="small" onClick={() => setLagretResultat(false)}>
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
              {brevKolonne && (
                <Alert variant="info" size="small" style={{ margin: '1em 0' }}>
                  Fullfør brevutkastet i brevpanelet
                </Alert>
              )}
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
            </div>
          </Box.New>
        )}
      </VStack>
    </Box.New>
  )
}

function underRetteBrukerTest(vedtaksResultat?: VedtaksResultat) {
  if (!vedtaksResultat) {
    return null
  }
  switch (vedtaksResultat) {
    case VedtaksResultat.INNVILGET:
      return 'En tekst om at man må ikke sendes brev ved innvilgelse, men man kan velge å gjøre det.'
    case VedtaksResultat.DELVIS_INNVILGET:
      return 'Du må sende vedtaksbrev ved delvis innvilgelse. Brevet blir sendt når du ferdigstiller oppgaven.'
    case VedtaksResultat.AVSLÅTT:
      return 'Du må sende vedtaksbrev ved avslag. Brevet blir sendt når du ferdigstiller oppgaven.'
  }
}

export default memo(BehandlingEksperimentPanel)
