import { useParams } from 'react-router'
import styled from 'styled-components'

import { Alert, Detail, Heading, Panel, Skeleton, Tag } from '@navikt/ds-react'

import { formaterDato } from '../../../../utils/date'

import { useEffect } from 'react'
import { AlertContainer } from '../../../../felleskomponenter/AlertContainer'
import { Avstand } from '../../../../felleskomponenter/Avstand'
import { TreKolonner } from '../../../../felleskomponenter/Kolonner'
import { useSaksbehandlerKanRedigereBarnebrillesak } from '../../../../tilgang/useSaksbehandlerKanRedigereBarnebrillesak'
import { Brevtype, OppgaveStatusType, StegType, VilkårsResultat } from '../../../../types/types.internal'
import { useBrillesak } from '../../../sakHook'
import { useSaksdokumenter } from '../../useSaksdokumenter'
import { useSamletVurdering } from '../../useSamletVurdering'
import { alertVariant } from '../vilkårsvurdering/oppsummertStatus'
import { InnvilgetVedtakVisning } from './InnvilgetVedtakVisning'
import { Redigeringsvisning } from './Redigeringsvisning'
import { BrevPanel } from './brev/BrevPanel'

export const VENSTREKOLONNE_BREDDE = '180px'

export const Vedtak: React.FC = () => {
  const { saksnummer } = useParams<{ saksnummer: string }>()
  const { sak /*, isLoading,*/, mutate } = useBrillesak()
  const saksbehandlerKanRedigereBarnebrillesak = useSaksbehandlerKanRedigereBarnebrillesak(sak?.data)
  const samletVurdering = useSamletVurdering(sak?.data)

  useEffect(() => {
    mutate()
  }, [])

  const { isLoading: henterSaksdokumenter } = useSaksdokumenter(
    saksnummer!,
    samletVurdering === VilkårsResultat.OPPLYSNINGER_MANGLER
  )

  if (!sak) return <div>Fant ikke saken</div> // TODO: Håndere dette bedre/høyrere opp i komponent treet.

  if (sak.data.steg === StegType.INNHENTE_FAKTA) {
    return (
      <AlertContainer>
        <Alert variant="info" size="small">
          {`Denne saken har ikke fullført steget "Registrer søknad" enda. Denne siden kan ikke vises før det er fullført.`}
        </Alert>
      </AlertContainer>
    )
  }

  if (sak.data.steg === StegType.VURDERE_VILKÅR) {
    return (
      <AlertContainer>
        <Alert variant="info" size="small">
          {`Denne saken har ikke fullført steget "Vilkårsvurdering" enda. Vedtaket kan ikke fattes før vilkårsvurdering er`}
          fullført.
        </Alert>
      </AlertContainer>
    )
  }

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
        <Avstand paddingTop={6}>
          <Heading level="1" size="small" spacing>
            Forslag til vedtak
          </Heading>
          <Skeleton variant="rectangle" width="40%" height={60} />
          <Avstand paddingTop={2} />
          <Skeleton variant="rectangle" width="80%" height={20} />
          <Avstand paddingTop={2} />
          <Skeleton variant="rectangle" width="80%" height={20} />
          <Avstand paddingTop={6} />
          <Skeleton variant="rectangle" width="80%" height={90} />
        </Avstand>
      ) : (
        <Panel>
          <Heading level="1" size="small" spacing>
            {vedtakFattet ? 'Vedtak' : 'Forslag til vedtak'}
          </Heading>
          <Detail>RESULTAT</Detail>
          <Tag variant={alertType} size="small">
            {status === VilkårsResultat.JA ? 'Innvilget' : 'Avslag'}
          </Tag>
          {status === VilkårsResultat.JA && <InnvilgetVedtakVisning sak={sak.data} mutate={mutate} />}

          {saksbehandlerKanRedigereBarnebrillesak && <Redigeringsvisning sak={sak.data} mutate={mutate} />}
          {visAlertGodkjenning && (
            <Avstand paddingTop={6}>
              <Alert variant="info" size="small">
                {`Sendt til godkjenning ${formaterDato(sak.data.totrinnskontroll?.opprettet)}.`}
              </Alert>
            </Avstand>
          )}
        </Panel>
      )}
      <VenstreKolonne>
        <BrevPanel sakId={sak.data.sakId} fullSize={true} brevtype={Brevtype.BARNEBRILLER_VEDTAK} />
      </VenstreKolonne>
    </TreKolonner>
  )
}

const VenstreKolonne = styled(Panel)`
  border-left: 1px solid var(--a-border-default);
  padding: 0;
  margin: 0;
  height: 100%;
`
