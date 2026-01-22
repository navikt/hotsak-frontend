import { ExternalLinkIcon } from '@navikt/aksel-icons'
import { Box, Button, Heading, HStack, InlineMessage, Link, Select, Tag, VStack } from '@navikt/ds-react'
import { memo } from 'react'
import { Brødtekst, Tekst, TextContainer } from '../../../../../felleskomponenter/typografi'
import { textcontainerBredde } from '../../../../../GlobalStyles.tsx'
import { Oppgavestatus } from '../../../../../oppgave/oppgaveTypes.ts'
import { useOppgave } from '../../../../../oppgave/useOppgave'
import { Saksvarsler } from '../../../../../saksbilde/bestillingsordning/Saksvarsler.tsx'
import { useSøknadsVarsler } from '../../../../../saksbilde/varsler/useVarsler.tsx'
import { Gjenstående, UtfallLåst, VedtaksResultat } from '../../../../../types/behandlingTyper.ts'
import { Innsenderbehovsmelding } from '../../../../../types/BehovsmeldingTypes'
import { Sak } from '../../../../../types/types.internal'
import { formaterDato } from '../../../../../utils/dato'
import { storForbokstavIOrd } from '../../../../../utils/formater.ts'
import { PanelTittel } from '../PanelTittel.tsx'
import { useSaksbehandlingEksperimentContext } from '../SaksbehandlingEksperimentProvider'
import { useBehandling } from './useBehandling.ts'
import { useBehandlingActions } from './useBehandlingActions.ts'

interface BehandlingEksperimentPanelProps {
  sak: Sak
  behovsmelding: Innsenderbehovsmelding
}

function BehandlingEksperimentPanel({ sak }: BehandlingEksperimentPanelProps) {
  const { brevKolonne, setBrevKolonne, setBehandlingPanel, setOpprettBrevKlikket } =
    useSaksbehandlingEksperimentContext()

  const { oppgave } = useOppgave()
  const lesevisning = oppgave?.oppgavestatus !== Oppgavestatus.UNDER_BEHANDLING
  const { gjeldendeBehandling } = useBehandling()
  const { varsler, harVarsler } = useSøknadsVarsler()

  const vedtaksResultat = (gjeldendeBehandling?.utfall?.utfall as VedtaksResultat) || null
  const gjenstående = gjeldendeBehandling?.gjenstående || []

  const harBrevutkast = !!gjeldendeBehandling?.utfallLåst?.includes(UtfallLåst.HAR_VEDTAKSBREV)
  const kanOppretteBrev = !lesevisning && !harBrevutkast
  const brevutkastFerdigstilt = harBrevutkast && !gjenstående.includes(Gjenstående.BREV_IKKE_FERDIGSTILT)

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

          {lesevisning ? (
            <VedtaksResultatVisning vedtaksResultat={vedtaksResultat} />
          ) : (
            <VedtaksResultatVelger utfall={vedtaksResultat} harBrevutkast={harBrevutkast} />
          )}

          {vedtaksResultat && (
            <TextContainer>
              <Box.New>
                <Heading level="2" size="small">
                  Vedtaksbrev
                </Heading>
                <VStack gap="space-12">
                  {/*TODO: Dette klarer vi ikke å finne ut av med APIene vi har nå? */
                  /* brevFerdigstilt && lesevisning && (
                    <Alert size="small" variant="info">
                      Brev lagt til utsending - sendes neste virkedag
                    </Alert>
                  )*/}

                  {/*TODO: Dette klarer vi ikke å finne ut av med APIene vi har nå? */
                  /*!brevEksisterer && lesevisning && vedtaksResultat === VedtaksResultat.INNVILGET && (
                    <Alert size="small" variant="info">
                      Saken er innvilget uten å sende brev
                    </Alert>
                  )*/}
                  {!lesevisning && <UnderrettBruker vedtaksResultat={vedtaksResultat} />}

                  {kanOppretteBrev && (
                    <div>
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => {
                          setBrevKolonne(true)
                          setOpprettBrevKlikket(true)
                        }}
                      >
                        Opprett vedtaksbrev
                      </Button>
                    </div>
                  )}

                  {!kanOppretteBrev && !brevKolonne && (
                    <div>
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => {
                          setBrevKolonne(true)
                        }}
                      >
                        Vis vedtaksbrev
                      </Button>
                    </div>
                  )}

                  {!lesevisning && brevutkastFerdigstilt && (
                    <InlineMessage status="info">
                      Du har markert brevet som ferdigstilt, og kan gå videre til å fatte vedtaket.
                    </InlineMessage>
                  )}

                  {!lesevisning && harBrevutkast && !brevutkastFerdigstilt && (
                    <InlineMessage status="info">Ferdigstill utkastet i brevpanelet.</InlineMessage>
                  )}
                </VStack>
              </Box.New>
            </TextContainer>
          )}
          {lesevisning &&
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
    </Box.New>
  )
}

function UnderrettBruker({ vedtaksResultat }: { vedtaksResultat?: VedtaksResultat }) {
  if (!vedtaksResultat) {
    return null
  }

  let tekst: string
  switch (vedtaksResultat) {
    case VedtaksResultat.INNVILGET:
      tekst = 'Du må selv vurdere om det er behov for å sende vedtaksbrev.'
      break
    case VedtaksResultat.DELVIS_INNVILGET:
      tekst = 'Du må sende vedtaksbrev ved delvis innvilgelse. Brevet blir sendt når du fatter vedtak.'
      break
    case VedtaksResultat.AVSLÅTT:
      tekst = 'Du må sende vedtaksbrev ved avslag. Brevet blir sendt når du fatter vedtak.'
      break
    default:
      return null
  }

  return (
    <TextContainer>
      <Brødtekst textColor="subtle">{tekst}</Brødtekst>
    </TextContainer>
  )
}

export default memo(BehandlingEksperimentPanel)

function VedtaksResultatVisning({ vedtaksResultat }: { vedtaksResultat?: VedtaksResultat }) {
  if (!vedtaksResultat) {
    return null
  }
  return (
    <VStack gap="space-8">
      <Heading size="small" level="2" spacing={false}>
        Vedtaksresultat
      </Heading>
      <TextContainer>
        <Tag
          size="small"
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

function VedtaksResultatVelger({ utfall, harBrevutkast }: { utfall: VedtaksResultat | null; harBrevutkast: boolean }) {
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
        readOnly={harBrevutkast}
        style={{ width: 'auto' }}
        value={utfall ? utfall : ''}
        onChange={async (e) => {
          if (utfall === (e.target.value as VedtaksResultat)) {
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
      {harBrevutkast && (
        <TextContainer>
          <Brødtekst>
            Hvis du vil endre vedtaksresultatet må du først slette brevutkastet. Valget for å slette utkastet finner du
            under menyen "Flere valg" i brevpanelet.
          </Brødtekst>
        </TextContainer>
      )}
    </>
  )
}
