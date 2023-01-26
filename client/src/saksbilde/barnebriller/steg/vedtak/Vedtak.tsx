import { Alert, Heading } from '@navikt/ds-react'

import { AlertContainer } from '../../../../felleskomponenter/AlterContainer'
import { StegType } from '../../../../types/types.internal'
import { useBrillesak } from '../../../sakHook'

export const Vedtak: React.FC = () => {
  const { sak } = useBrillesak()

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

  return (
    <>
      <Heading level="1" size="small">
        Vedtak
      </Heading>
      <div>Da har vi kommet til {`${sak?.steg}`}</div>
      <pre>{JSON.stringify(sak)}</pre>
    </>
  )
}
