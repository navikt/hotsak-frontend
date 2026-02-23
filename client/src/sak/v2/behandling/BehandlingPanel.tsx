import { Box, Button, Heading, HelpText, HStack, InlineMessage, Link, Select, Tag, VStack } from '@navikt/ds-react'
import { memo, useState } from 'react'
import { Brevstatus } from '../../../brev/brevTyper.ts'
import { useBrevMetadata } from '../../../brev/useBrevMetadata.ts'
import { PanelTittel } from '../../../felleskomponenter/panel/PanelTittel.tsx'
import { ScrollablePanel } from '../../../felleskomponenter/ScrollablePanel.tsx'
import { Tekst, TextContainer } from '../../../felleskomponenter/typografi.tsx'
import { textcontainerBredde } from '../../../GlobalStyles.tsx'
import { Oppgavestatus } from '../../../oppgave/oppgaveTypes.ts'
import { useOppgave } from '../../../oppgave/useOppgave.ts'
import { Saksvarsler } from '../../../saksbilde/bestillingsordning/Saksvarsler.tsx'
import { useSøknadsVarsler } from '../../../saksbilde/varsler/useVarsler.tsx'
import { Innsenderbehovsmelding } from '../../../types/BehovsmeldingTypes.ts'
import { Sak } from '../../../types/types.internal.ts'
import { formaterDatoKort, formaterTidsstempelLang } from '../../../utils/dato.ts'
import { storForbokstavIOrd } from '../../../utils/formater.ts'
import { SlettBrevutkastModal } from '../modaler/SlettBrevutkastModal.tsx'
import { useClosePanel, usePanel, useSetPanelVisibility } from '../paneler/usePanelHooks.ts'
import { useSakContext } from '../SakProvider.tsx'
import { Gjenstående, UtfallLåst, VedtaksResultat } from './behandlingTyper.ts'
import { useBehandling } from './useBehandling.ts'
import { useBehandlingActions } from './useBehandlingActions.ts'

interface BehandlingProps {
  sak: Sak
  behovsmelding: Innsenderbehovsmelding
}

function BehandlingPanel({ sak }: BehandlingProps) {
  const { setOpprettBrevKlikket } = useSakContext()

  const brevPanel = usePanel('brevpanel')
  const lukkBehandlingsPanel = useClosePanel('behandlingspanel')
  const setBrevpanelVisibility = useSetPanelVisibility('brevpanel')

  const { oppgave } = useOppgave()
  const lesevisning = oppgave?.oppgavestatus !== Oppgavestatus.UNDER_BEHANDLING
  const { gjeldendeBehandling } = useBehandling()
  const { gjeldendeBrev: brevMetadata, harBrevISak } = useBrevMetadata()
  const { varsler, harVarsler } = useSøknadsVarsler()

  const vedtaksResultat = (gjeldendeBehandling?.utfall?.utfall as VedtaksResultat) || null
  const gjenstående = gjeldendeBehandling?.gjenstående || []

  const harBrevutkast = !!gjeldendeBehandling?.utfallLåst?.includes(UtfallLåst.HAR_VEDTAKSBREV)
  const kanOppretteBrev = !lesevisning && !harBrevutkast
  const brevutkastFerdigstilt = harBrevutkast && !gjenstående.includes(Gjenstående.BREV_IKKE_FERDIGSTILT)

  return (
    <Box background="default" paddingInline="space-16" paddingBlock="space-0 space-48" style={{ height: '100%' }}>
      <PanelTittel
        tittel="Behandle sak"
        lukkPanel={() => {
          lukkBehandlingsPanel()
        }}
      />
      <ScrollablePanel paddingInline="space-16 space-0">
        <VStack gap="space-16" paddingInline="space-0 space-8">
          <HStack gap="space-20">
            <Tekst data-tip="Saksnummer" data-for="sak" textColor="subtle">{`Sak: ${sak.sakId}`}</Tekst>
            {oppgave?.fristFerdigstillelse && (
              <Tekst textColor="subtle">Frist: {formaterDatoKort(oppgave.fristFerdigstillelse)}</Tekst>
            )}
          </HStack>

          <Tekst>
            <Link href="https://lovdata.no/lov/1997-02-28-19/§10-6" target="_blank">
              Slå opp folketrygdlovens § 10-6 i Lovdata
            </Link>
          </Tekst>

          {lesevisning ? (
            <VedtaksResultatVisning vedtaksResultat={vedtaksResultat} />
          ) : (
            <VedtaksResultatVelger utfall={vedtaksResultat} harBrevutkast={harBrevutkast} />
          )}

          {vedtaksResultat && (
            <TextContainer>
              <Box>
                <Heading level="2" size="xsmall" spacing>
                  Vedtaksbrev
                </Heading>
                <VStack gap="space-12">
                  {lesevisning && brevMetadata?.status === Brevstatus.UTBOKS && (
                    <InlineMessage status="info" size="small">
                      Brev lagt til utsending - sendes neste virkedag
                    </InlineMessage>
                  )}

                  {lesevisning && brevMetadata?.status === Brevstatus.SENDT && (
                    <InlineMessage status="info" size="small">
                      Vedtaksbrevet ble sendt til bruker den {formaterTidsstempelLang(brevMetadata?.sendt!)}
                    </InlineMessage>
                  )}

                  {lesevisning && !harBrevISak && (
                    <InlineMessage status="info" size="small">
                      Saken er innvilget uten å sende brev
                    </InlineMessage>
                  )}
                  {!lesevisning && !harBrevutkast && <UnderrettBruker vedtaksResultat={vedtaksResultat} />}

                  {kanOppretteBrev && (
                    <div>
                      <Button
                        variant={vedtaksResultat === VedtaksResultat.INNVILGET ? 'secondary' : 'primary'}
                        size="small"
                        onClick={() => {
                          setBrevpanelVisibility(true)
                          setOpprettBrevKlikket(true)
                        }}
                      >
                        Opprett vedtaksbrev
                      </Button>
                    </div>
                  )}

                  {!brevPanel.visible && harBrevISak && (
                    <div>
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => {
                          setBrevpanelVisibility(true)
                        }}
                      >
                        Vis vedtaksbrev
                      </Button>
                    </div>
                  )}

                  {!lesevisning && brevutkastFerdigstilt && (
                    <InlineMessage status="info" size="small">
                      Du har markert brevet som ferdigstilt, og kan gå videre til å fatte vedtaket. Brevet blir lagt til
                      utsending etter at vedtaket er fattet.
                    </InlineMessage>
                  )}

                  {!lesevisning && harBrevutkast && !brevutkastFerdigstilt && (
                    <InlineMessage status="info" size="small">
                      Ferdigstill utkastet i brevpanelet. Brevet blir lagt til utsending etter at vedtaket er fattet.
                    </InlineMessage>
                  )}
                </VStack>
              </Box>
            </TextContainer>
          )}
          {lesevisning &&
            (vedtaksResultat === VedtaksResultat.INNVILGET || vedtaksResultat === VedtaksResultat.DELVIS_INNVILGET) &&
            harVarsler && (
              <>
                <Heading level="2" size="xsmall">
                  Videre behandling i OeBS
                </Heading>
                <Tekst>Saken kan nå tas videre i OeBS</Tekst>
                <div style={{ maxWidth: `${textcontainerBredde}` }}>
                  <Saksvarsler varsler={varsler} />
                </div>
              </>
            )}
        </VStack>
      </ScrollablePanel>
    </Box>
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
      tekst = 'Du må sende vedtaksbrev ved delvis innvilgelse.'
      break
    case VedtaksResultat.AVSLÅTT:
      tekst = 'Du må sende vedtaksbrev ved avslag.'
      break
    default:
      return null
  }

  return (
    <TextContainer>
      <InlineMessage status="info" size="small">
        {tekst}
      </InlineMessage>
    </TextContainer>
  )
}

export default memo(BehandlingPanel)

function VedtaksResultatVisning({ vedtaksResultat }: { vedtaksResultat?: VedtaksResultat }) {
  if (!vedtaksResultat) {
    return null
  }
  return (
    <VStack gap="space-8">
      <Heading size="xsmall" level="2" spacing={false}>
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
  const [visSlettBrevutkastModal, setVisSlettBrevutkastModal] = useState(false)

  return (
    <>
      <HStack gap="space-2">
        <Heading size="xsmall" level="2" spacing={false}>
          Vurderingen din
        </Heading>
        <HelpText title="Vurderingsinformasjon">
          Vurder om søknaden skal innvilges, delvis innvilges eller avslås. Vurderingen blir ikke synlig for bruker før
          etter at vedtaket er fattet.
        </HelpText>
      </HStack>
      <VStack paddingInline="space-0" gap="space-12">
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
          <div>
            <Button variant="tertiary" size="small" onClick={() => setVisSlettBrevutkastModal(true)}>
              Endre vurdering
            </Button>
          </div>
        )}
      </VStack>
      {harBrevutkast && (
        <TextContainer>
          <Tekst>
            Hvis du vil endre vedtaksresultatet må du først slette brevutkastet. Valget for å slette utkastet finner du
            i toppmenyen over brevet.
          </Tekst>
        </TextContainer>
      )}
      <SlettBrevutkastModal onClose={() => setVisSlettBrevutkastModal(false)} open={visSlettBrevutkastModal} />
    </>
  )
}
