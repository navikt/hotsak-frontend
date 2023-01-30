import { useState } from 'react'

import { Edit } from '@navikt/ds-icons'
import { Alert, Button, Heading, Link, Panel, Radio, RadioGroup, Table } from '@navikt/ds-react'

import { AlertContainer } from '../../../../felleskomponenter/AlterContainer'
import { ButtonContainer } from '../../../../felleskomponenter/Dialogboks'
import { StegType, VilkårsResultat, VilkårSvar } from '../../../../types/types.internal'
import { useBrillesak } from '../../../sakHook'

export const VurderVilkår: React.FC = () => {
  const { sak } = useBrillesak()
  const [overstyrRad, setOverstyrRad] = useState()

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
      <Panel>
        <Heading level="1" size="small" spacing>
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
            {sak.vilkårsvurdering?.vilkår.map(
              ({
                identifikator,
                resultatAuto,
                begrunnelseAuto,
                beskrivelse,
                resultatSaksbehandler,
                begrunnelseSaksbehandler,
                lovReferanse,
                lovdataLenke,
              }) => {
                const vilkårOppfylt = (resultatSaksbehandler ? resultatSaksbehandler : resultatAuto)!
                const begrunnelse = (begrunnelseSaksbehandler ? begrunnelseSaksbehandler : begrunnelseAuto) ?? ''
                const vurdert = resultatSaksbehandler ? 'Saksbehandler' : 'Automatisk'
                // TODO koble fakta felter med vilkår
                return (
                  <Table.Row key={identifikator}>
                    <Table.DataCell>
                      <Alert variant={`${alertVariant(vilkårOppfylt)}`} size="small" inline>
                        {beskrivelse}
                      </Alert>
                    </Table.DataCell>
                    <Table.DataCell>{begrunnelse}</Table.DataCell>
                    <Table.DataCell>{vurdert}</Table.DataCell>

                    <Table.DataCell>
                      <Link href={lovdataLenke} target="_blank">
                        {lovReferanse}
                      </Link>
                    </Table.DataCell>
                    <Table.DataCell>
                      <Button variant="tertiary" size="xsmall" icon={<Edit />}>
                        Vurder
                      </Button>
                    </Table.DataCell>
                  </Table.Row>
                )
              }
            )}
          </Table.Body>
        </Table>
        <ButtonContainer>
          <Button variant="primary" size="small">
            Til vedtak
          </Button>
        </ButtonContainer>
      </Panel>
    </>
  )

  /*function SaksbehandlersVurdering() {
    return (
      <form>
        <Heading level='2' size='xsmall'>Din vurdering</Heading>
        <RadioGroup
          legend="Er vilkåret oppfylt"
          size="small"
        >
          <Radio value={VilkårSvar.JA}>Ja</Radio>
          <Radio value={VilkårSvar.NEI}>Nei</Radio>
        </RadioGroup>
      </form>
    )
  }*/

  function alertVariant(vilkårOppfylt: VilkårsResultat) {
    switch (vilkårOppfylt) {
      case VilkårsResultat.JA:
        return 'success'
      case VilkårsResultat.NEI:
      case VilkårsResultat.DOKUMENTASJON_MANGLER:
        return 'error'
      case VilkårsResultat.KANSKJE:
        return 'warning'
    }
  }
}
