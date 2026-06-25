import { Box, Button, Heading, HelpText, HStack, InfoCard, InlineMessage, Select, VStack } from '@navikt/ds-react'
import { useState } from 'react'

import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons'
import { isBrevmal } from '../../../brev/brevSelectors.ts'
import { Brevmal } from '../../../brev/brevTyper.ts'
import { SlettBrevModal } from '../../../brev/SlettBrevModal.tsx'
import { useBrevForSak } from '../../../brev/useBrev.ts'
import { useBrevActions } from '../../../brev/useBrevActions.ts'
import { useToast } from '../../../felleskomponenter/toast/useToast'
import { TextContainer } from '../../../felleskomponenter/typografi.tsx'
import { type Saksbehandlingsoppgave } from '../../../oppgave/oppgaveTypes.ts'
import { useErPilot } from '../../../tilgang/useTilgang.ts'
import { useMiljø } from '../../../utils/useMiljø.ts'
import { useClosePanel, useSetPanelVisibility } from '../paneler/usePanelHooks.ts'
import { useSakContext } from '../SakV2ContextType.ts'
import classes from './BehandlingPanel.module.css'
import {
  Gjenstående,
  Henleggelsesårsak,
  isBehandlingsutfallHenleggelse,
  isBehandlingsutfallOverføring,
  isBehandlingsutfallVedtak,
  OverførtTil,
  UtfallLåst,
  VedtaksResultat,
  type Behandling,
} from './behandlingTyper.ts'
import { HenleggForm } from './HenleggForm.tsx'
import { useBehandlingActions } from './useBehandlingActions.ts'
import { VisBrevKnapp } from './VisBrevKnapp.tsx'

export interface BehandlingRedigeringProps {
  oppgave?: Saksbehandlingsoppgave
  behandling?: Behandling
}

export function BehandlingRedigering({ oppgave, behandling }: BehandlingRedigeringProps) {
  const { henleggFormRef } = useSakContext()
  const closePanel = useClosePanel('brevpanel')
  const setBrevpanelVisibility = useSetPanelVisibility('brevpanel')
  const { harBrev, finnBrev } = useBrevForSak(behandling?.sakId)
  const { ferdigstillBehandling, lagreBehandling } = useBehandlingActions()
  const vedtaksbrevId = finnBrev(isBrevmal(Brevmal.BREVEDITOR_VEDTAKSBREV))?.brevId
  const { opprettBrevutkast, slettBrevutkast } = useBrevActions(oppgave, vedtaksbrevId)
  const { showSuccessToast } = useToast()

  const vedtaksresultat = isBehandlingsutfallVedtak(behandling?.utfall) ? behandling.utfall.utfall : undefined
  const henleggelseUtfall = isBehandlingsutfallHenleggelse(behandling?.utfall) ? behandling.utfall : undefined
  const erBehandlingsutfallOverføring = behandling?.utfall && isBehandlingsutfallOverføring(behandling.utfall)
  const erHenleggelse = henleggelseUtfall != null
  const gjenstående = behandling?.gjenstående || []

  // todo -> sjekk brevene på saken direkte?
  const harBrevutkast = !!behandling?.utfallLåst?.includes(UtfallLåst.HAR_VEDTAKSBREV)
  const kanOppretteBrev = !harBrevutkast
  const brevutkastFerdigstilt = harBrevutkast && !gjenstående.includes(Gjenstående.BREV_IKKE_FERDIGSTILT)

  const handleSlettBrevutkast = async () => {
    if (!harBrev) return
    await slettBrevutkast.trigger()
    closePanel()
  }

  const handleOpprettBrevutkast = async () => {
    if (behandling) {
      await opprettBrevutkast.trigger({
        brevutkast: {
          brevmal: 'BREVEDITOR_VEDTAKSBREV',
          brevmalVersjon: '0',
          målform: 'BOKMÅL',
          data: {},
        },
        behandlingId: behandling.behandlingId.toString(),
      })
      setBrevpanelVisibility(true)
    }
  }

  const henlegg = async () => {
    await ferdigstillBehandling({})
    if (!harBrev) closePanel()
    showSuccessToast('Saken er henlagt')
  }

  const lagreHenleggelse = (utfall: Henleggelsesårsak | undefined, begrunnelse?: string) =>
    lagreBehandling({ type: 'HENLEGGELSE', utfall, begrunnelse })

  const lagreOverføring = () => lagreBehandling({ type: 'OVERFØRING', utfall: OverførtTil.GOSYS })

  return (
    <VStack gap="space-16" paddingInline="space-0 space-8">
      <VedtaksResultatVelger
        behandling={behandling}
        utfall={vedtaksresultat}
        erHenleggelse={erHenleggelse}
        harBrevutkast={harBrevutkast}
        onSlettBrevutkast={handleSlettBrevutkast}
      />
      {(vedtaksresultat || erHenleggelse || erBehandlingsutfallOverføring) && (
        <TextContainer>
          <Box paddingInline="space-8 space-0">
            <VStack gap="space-12">
              {(erHenleggelse || erBehandlingsutfallOverføring) && (
                <HenleggForm
                  ref={henleggFormRef}
                  onHenleggelse={henlegg}
                  onSave={lagreHenleggelse}
                  onOverføringValgt={lagreOverføring}
                  defaultÅrsak={erBehandlingsutfallOverføring ? undefined : henleggelseUtfall?.utfall}
                  defaultBegrunnelse={erBehandlingsutfallOverføring ? undefined : henleggelseUtfall?.begrunnelse}
                  overføringTilGosys={erBehandlingsutfallOverføring === true}
                />
              )}

              {!isBehandlingsutfallOverføring(behandling?.utfall) && (
                <Heading level="2" size="xsmall">
                  {erHenleggelse ? 'Brev' : 'Vedtaksbrev'}
                </Heading>
              )}

              {!harBrevutkast && !erHenleggelse && <UnderrettBruker vedtaksresultat={vedtaksresultat} />}

              {!harBrevutkast && erHenleggelse && (
                <TextContainer>
                  <InlineMessage status="info" size="small">
                    {gjenstående.includes(Gjenstående.BREV_MANGLER)
                      ? 'Du må sende brev om henleggelsen når søknaden er trukket av brukeren.'
                      : 'Du må selv vurdere om det er behov for å sende brev om henleggelsen.'}
                  </InlineMessage>
                </TextContainer>
              )}

              {kanOppretteBrev && !isBehandlingsutfallOverføring(behandling?.utfall) && (
                <div>
                  <Button
                    variant={
                      vedtaksresultat === VedtaksResultat.INNVILGET ||
                      henleggelseUtfall?.utfall !== Henleggelsesårsak.SØKNAD_TRUKKET
                        ? 'secondary'
                        : 'primary'
                    }
                    size="small"
                    loading={opprettBrevutkast.isMutating}
                    onClick={handleOpprettBrevutkast}
                  >
                    {erHenleggelse ? 'Opprett brev' : 'Opprett vedtaksbrev'}
                  </Button>
                </div>
              )}

              {harBrev && <VisBrevKnapp erHenleggelse={erHenleggelse} />}

              {brevutkastFerdigstilt && (
                <InlineMessage status="info" size="small">
                  Du har markert brevet som ferdigstilt, og kan gå videre til å fatte vedtaket. Brevet blir lagt til
                  utsending etter at vedtaket er fattet.
                </InlineMessage>
              )}

              {harBrevutkast && !brevutkastFerdigstilt && (
                <InlineMessage status="info" size="small">
                  Ferdigstill utkastet i brevpanelet. Brevet blir lagt til utsending etter at vedtaket er fattet.
                </InlineMessage>
              )}
            </VStack>
          </Box>
        </TextContainer>
      )}
      {isBehandlingsutfallOverføring(behandling?.utfall) && (
        <InfoCard data-color="warning">
          <InfoCard.Header icon={<ExclamationmarkTriangleIcon aria-hidden />}>
            <InfoCard.Title>Du må overføre saken til Gosys og rydde opp i dokumentene</InfoCard.Title>
          </InfoCard.Header>
          <InfoCard.Content>
            Hotsak mangler funksjonalitet for å håndtere avvik. Du må overføre saken til Gosys og følge rutinen som
            gjelder for håndtering av denne typen avvik.
          </InfoCard.Content>
        </InfoCard>
      )}
    </VStack>
  )
}

function UnderrettBruker({ vedtaksresultat }: { vedtaksresultat?: VedtaksResultat }) {
  if (!vedtaksresultat) {
    return null
  }

  let tekst: string
  switch (vedtaksresultat) {
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

function VedtaksResultatVelger({
  behandling,
  utfall,
  erHenleggelse,
  harBrevutkast,
  onSlettBrevutkast,
}: {
  behandling?: Behandling
  utfall?: VedtaksResultat
  erHenleggelse: boolean
  harBrevutkast: boolean
  onSlettBrevutkast(): Promise<void>
}) {
  const { lagreBehandling } = useBehandlingActions()
  const [visSlettBrevutkastModal, setVisSlettBrevutkastModal] = useState(false)
  const { erIkkeProd } = useMiljø()
  const erPilot = useErPilot('hotsakEksperimenter') || erIkkeProd

  const HENLEGGELSE_VALUE = 'HENLEGGELSE'
  const erBehandlingsutfallOverføring = behandling?.utfall && isBehandlingsutfallOverføring(behandling.utfall)
  const currentValue = erBehandlingsutfallOverføring
    ? OverførtTil.GOSYS
    : erHenleggelse
      ? HENLEGGELSE_VALUE
      : (utfall ?? '')

  return (
    <>
      <HStack gap="space-2" paddingInline="space-8 space-0">
        <Heading size="xsmall" level="2" spacing={false}>
          Vurderingen din
        </Heading>
        <HelpText title="Vurderingsinformasjon">
          Vurder om søknaden skal innvilges, delvis innvilges, avslås eller henlegges. Resultatet du setter blir først
          synlig for brukeren dagen etter at du har ferdigstilt saken i Hotsak.
        </HelpText>
      </HStack>
      <VStack paddingInline="space-8 space-0" gap="space-12">
        <Select
          size="small"
          label="Resultat"
          readOnly={harBrevutkast || erBehandlingsutfallOverføring}
          className={classes.selectAuto}
          value={currentValue}
          onChange={async (e) => {
            const value = e.target.value
            if (value === currentValue) {
              return
            }
            if (value === HENLEGGELSE_VALUE) {
              await lagreBehandling({ type: HENLEGGELSE_VALUE, utfall: undefined })
            } else if (value !== '') {
              await lagreBehandling({ utfall: value as VedtaksResultat, type: 'VEDTAK' })
            } else {
              await lagreBehandling(undefined)
            }
          }}
        >
          <option value="">-- Velg resultat --</option>
          <option value={VedtaksResultat.INNVILGET}>Innvilget</option>
          <option value={VedtaksResultat.DELVIS_INNVILGET}>Delvis innvilget</option>
          <option value={VedtaksResultat.AVSLÅTT}>Avslått</option>
          {erPilot && <option value={HENLEGGELSE_VALUE}>Henlagt</option>}
          {erBehandlingsutfallOverføring && <option value={OverførtTil.GOSYS}>Overført til Gosys</option>}
        </Select>
        {harBrevutkast && (
          <div>
            <Button variant="tertiary" size="small" onClick={() => setVisSlettBrevutkastModal(true)}>
              Endre vurdering
            </Button>
          </div>
        )}
      </VStack>
      <SlettBrevModal
        heading="Du må slette brevutkastet ditt før du kan endre resultatet"
        tekst="Du har begynt på et utkast til vedtaksbrev. Dette må slettes før du kan endre resultatet. Hvis du sletter brevet, kan det ikke gjenopprettes."
        width="700px"
        loading={false} // fixme
        open={visSlettBrevutkastModal}
        onClose={() => setVisSlettBrevutkastModal(false)}
        onBekreft={async () => {
          await onSlettBrevutkast()
          setVisSlettBrevutkastModal(false)
        }}
      />
    </>
  )
}
