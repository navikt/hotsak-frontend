import { Alert, Button, Detail, Heading, Panel, Tag } from '@navikt/ds-react'

import { capitalizeName, formaterKontonummer } from '../../../../utils/stringFormating'

import { AlertContainer } from '../../../../felleskomponenter/AlertContainer'
import { Avstand } from '../../../../felleskomponenter/Avstand'
import { Kolonne, Rad } from '../../../../felleskomponenter/Flex'
import { TreKolonner } from '../../../../felleskomponenter/Kolonner'
import { Etikett } from '../../../../felleskomponenter/typografi'
import { StegType, VilkårsResultat } from '../../../../types/types.internal'
import { Historikk } from '../../../høyrekolonne/historikk/Historikk'
import { useBrillesak } from '../../../sakHook'
import { alertVariant, oppsummertStatus } from '../vilkårsvurdering/oppsummertStatus'
import { useKontonummer } from './useKontonummer'

export const Vedtak: React.FC = () => {
  const { sak } = useBrillesak()
  const kontonummer = useKontonummer(sak?.innsender.fnr)
  const VENSTREKOLONNE_BREDDE = '180px'

  if (!sak) return <div>Fant ikke saken</div> // TODO: Håndere dette bedre/høyrere opp i komponent treet.

  if (sak?.steg === StegType.INNHENTE_FAKTA) {
    return (
      <AlertContainer>
        <Alert variant="info" size="small">
          {`Denne saken har ikke fullført steget "Registrer søknad" enda. Denne siden kan ikke vises før det er fullført.`}
        </Alert>
      </AlertContainer>
    )
  }

  if (sak?.steg === StegType.VURDERE_VILKÅR) {
    return (
      <AlertContainer>
        <Alert variant="info" size="small">
          {`Denne saken har ikke fullført steget "Vilkårsvurdering" enda. Vedtaket kan ikke fattes før vilkårsvurdering er`}
          fullført.
        </Alert>
      </AlertContainer>
    )
  }

  const { vilkårsvurdering } = sak
  const status = oppsummertStatus(vilkårsvurdering!.vilkår)
  const alertType = alertVariant(status)

  return (
    <TreKolonner>
      <Panel>
        <Heading level="1" size="small" spacing>
          Forslag til vedtak
        </Heading>
        <Detail>RESULTAT</Detail>
        <Tag variant={alertType} size="small">
          {status === VilkårsResultat.JA ? 'Innvilget' : 'Avslag'}
        </Tag>
        <Avstand paddingBottom={6} />
        <Rad>
          <Kolonne width={VENSTREKOLONNE_BREDDE}>{`${vilkårsvurdering?.sats.replace('SATS_', 'Sats ')}:`}</Kolonne>
          <Kolonne>
            <Etikett>{`${vilkårsvurdering?.satsBeløp} kr`}</Etikett>
          </Kolonne>
        </Rad>
        <Rad>
          <Kolonne width={VENSTREKOLONNE_BREDDE}>Beløp som utbetales:</Kolonne>
          <Kolonne>
            <Etikett>{vilkårsvurdering?.beløp} kr</Etikett>
          </Kolonne>
        </Rad>
        <Rad>
          <Kolonne width={VENSTREKOLONNE_BREDDE}>Utbetales til:</Kolonne>
          <Kolonne>
            <Etikett>{capitalizeName(`${sak.innsender.navn.fornavn} ${sak.innsender.navn.etternavn}`)}</Etikett>
          </Kolonne>
        </Rad>
        <Rad>
          <Kolonne width={VENSTREKOLONNE_BREDDE}>Kontonummer:</Kolonne>
          <Kolonne>
            <Etikett>{formaterKontonummer(kontonummer?.kontonummer)}</Etikett>
          </Kolonne>
        </Rad>
        <Avstand paddingBottom={6} />
        <Button size="small" variant="primary">
          Send til godkjenning
        </Button>
      </Panel>
      <Panel border style={{ height: '100%' }}>
        Her kommer det snart forhåndsvisning av brev
      </Panel>
      <Historikk />
    </TreKolonner>
  )
}
