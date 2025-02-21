import { Alert, Box, Button, Detail, Heading, Skeleton, Tag, VStack } from '@navikt/ds-react'
import { useParams } from 'react-router'
import styled from 'styled-components'

import { TreKolonner } from '../../../../felleskomponenter/Kolonner'
import { useSaksbehandlerKanRedigereBarnebrillesak } from '../../../../tilgang/useSaksbehandlerKanRedigereBarnebrillesak'
import { Brevtype, OppgaveStatusType, StegType, StepType, VilkårsResultat } from '../../../../types/types.internal'
import { formaterDato } from '../../../../utils/dato'
import { useBarnebrillesak } from '../../../useBarnebrillesak'
import { useManuellSaksbehandlingContext } from '../../ManuellSaksbehandlingTabContext'
import { useSaksdokumenter } from '../../useSaksdokumenter'
import { useSamletVurdering } from '../../useSamletVurdering'
import { alertVariant } from '../vilkårsvurdering/oppsummertStatus'
import { BrevPanel } from './brev/BrevPanel'
import { InnvilgetVedtakVisning } from './InnvilgetVedtakVisning'
import { Redigeringsvisning } from './Redigeringsvisning'

export function Vedtak() {
  const { saksnummer } = useParams<{ saksnummer: string }>()
  const { sak /*, isLoading,*/, mutate } = useBarnebrillesak()
  const saksbehandlerKanRedigereBarnebrillesak = useSaksbehandlerKanRedigereBarnebrillesak(sak)
  const samletVurdering = useSamletVurdering(sak?.data)
  const { setStep } = useManuellSaksbehandlingContext()
  const { isLoading: henterSaksdokumenter } = useSaksdokumenter(
    saksnummer!,
    samletVurdering === VilkårsResultat.OPPLYSNINGER_MANGLER
  )

  if (!sak) return <div>Fant ikke saken</div> // TODO: Håndere dette bedre/høyrere opp i komponent treet.

  const status = sak.data.vilkårsvurdering!.resultat
  const alertType = alertVariant(status)
  const vedtakFattet = sak.data.status === OppgaveStatusType.VEDTAK_FATTET

  const visAlertGodkjenning =
    sak.data.status === OppgaveStatusType.AVVENTER_GODKJENNER || sak.data.steg === StegType.GODKJENNE

  const visSkeleton =
    sak.data.status === OppgaveStatusType.TILDELT_SAKSBEHANDLER &&
    samletVurdering === VilkårsResultat.OPPLYSNINGER_MANGLER &&
    henterSaksdokumenter

  return (
    <TreKolonner>
      {visSkeleton ? (
        <Box padding="4">
          <Heading level="1" size="small" spacing>
            Forslag til vedtak
          </Heading>
          <VStack gap="2">
            <Skeleton variant="rectangle" width="40%" height={60} />
            <Skeleton variant="rectangle" width="80%" height={20} />
            <Skeleton variant="rectangle" width="80%" height={20} />
            <Skeleton variant="rectangle" width="80%" height={90} />
          </VStack>
        </Box>
      ) : (
        <Box padding="4">
          <Heading level="1" size="small" spacing>
            {vedtakFattet ? 'Vedtak' : 'Forslag til vedtak'}
          </Heading>
          <VStack gap="5">
            <div>
              <Detail uppercase>Resultat</Detail>
              <Tag variant={alertType} size="small">
                {status === VilkårsResultat.JA ? 'Innvilget' : 'Avslag'}
              </Tag>
            </div>
            {status === VilkårsResultat.JA && <InnvilgetVedtakVisning sak={sak.data} mutate={mutate} />}
            {saksbehandlerKanRedigereBarnebrillesak && <Redigeringsvisning sak={sak.data} mutate={mutate} />}
            {visAlertGodkjenning && (
              <Alert variant="info" size="small">
                {`Sendt til godkjenning ${formaterDato(sak.data.totrinnskontroll?.opprettet)}.`}
              </Alert>
            )}
            {!saksbehandlerKanRedigereBarnebrillesak && (
              <div>
                <Button variant="secondary" size="small" onClick={() => setStep(StepType.VILKÅR)}>
                  Forrige
                </Button>
              </div>
            )}
          </VStack>
        </Box>
      )}
      <VenstreKolonne>
        <BrevPanel sakId={sak.data.sakId} fullSize={true} brevtype={Brevtype.BARNEBRILLER_VEDTAK} />
      </VenstreKolonne>
    </TreKolonner>
  )
}

const VenstreKolonne = styled('div')`
  border-left: 1px solid var(--a-border-default);
  padding: 0;
  margin: 0;
  height: 100%;
`
