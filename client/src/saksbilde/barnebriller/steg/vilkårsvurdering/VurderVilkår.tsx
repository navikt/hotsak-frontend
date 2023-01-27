import { Alert, Button, Heading, Table } from '@navikt/ds-react'

import { AlertContainer } from '../../../../felleskomponenter/AlterContainer'
import { StegType } from '../../../../types/types.internal'
import { useBrillesak } from '../../../sakHook'

export const VurderVilkår: React.FC = () => {
  const { sak } = useBrillesak()

  if (!sak) return <div>Fant ikke saken</div> // TODO: Håndere dette bedre/høyrere opp i komponent treet.

  if (sak?.steg === StegType.INNHENTE_FAKTA) {
    return (
      <AlertContainer>
        <Alert variant="info" size="small">
          {`Denne saken har ikke fullført steget "Registrer søknad" enda. Resultat av vilkårsvurderingen kan ikke vises
          før det er fullført.`}
        </Alert>
      </AlertContainer>
    )
  }

  return (
    <>
      <Heading level="1" size="small">
        Foreløpig resultat
      </Heading>

      <Table size="small">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col">Vilkår</Table.HeaderCell>
            <Table.HeaderCell scope="col">Vurdert</Table.HeaderCell>
            <Table.HeaderCell scope="col">Basert på</Table.HeaderCell>
            <Table.HeaderCell scope="col">Paragraf</Table.HeaderCell>
            <Table.HeaderCell scope="col">Overstyr</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sak.vilkårsvurdering?.vilkår.map(({ identifikator, vilkårOppfylt, begrunnelse }) => {
            return (
              <Table.Row key={identifikator}>
                <Table.DataCell>{vilkårOppfylt}</Table.DataCell>
                <Table.DataCell>Automatisk</Table.DataCell>
                <Table.DataCell>{begrunnelse}</Table.DataCell>
                <Table.DataCell>§2</Table.DataCell>
                <Table.DataCell>
                  <Button variant="tertiary" size="xsmall">
                    Overstyr
                  </Button>
                </Table.DataCell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    </>
  )
}
