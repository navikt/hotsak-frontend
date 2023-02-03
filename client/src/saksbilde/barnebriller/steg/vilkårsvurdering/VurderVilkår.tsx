import { useState } from 'react'

import { Edit } from '@navikt/ds-icons'
import { Alert, BodyLong, Button, Heading, Link, Panel, Table } from '@navikt/ds-react'

import { AlertContainer, AlertContainerBred } from '../../../../felleskomponenter/AlertContainer'
import { ButtonContainer } from '../../../../felleskomponenter/Dialogboks'
import { StegType, Vilkår, VilkårsResultat, Vilkårsvurdering } from '../../../../types/types.internal'
import { useBrillesak } from '../../../sakHook'
import { SaksbehandlersVurdering } from './SaksbehandlersVurdering'

export const VurderVilkår: React.FC = () => {
  const { sak, mutate } = useBrillesak()
  const [åpneRader, setÅpneRader] = useState<string[]>([])

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

  const oppsummertResultat = oppsummertStatus(sak.vilkårsvurdering!.vilkår)
  const alertType = alertVariant(oppsummertResultat)

  return (
    <>
      <Panel>
        <Heading level="1" size="small" spacing>
          Foreløpig resultat
        </Heading>
        <AlertContainerBred>
          <Alert variant={alertType} size="small">
            <BodyLong>{alertTekst(alertType)}</BodyLong>
          </Alert>
        </AlertContainerBred>
        <Table size="small">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell scope="col">Vilkår</Table.HeaderCell>
              <Table.HeaderCell scope="col">Begrunnelse</Table.HeaderCell>
              <Table.HeaderCell scope="col">Begrunnelse saksbehandler</Table.HeaderCell>
              <Table.HeaderCell scope="col">Vurdert</Table.HeaderCell>
              <Table.HeaderCell scope="col">Paragraf</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {sak.vilkårsvurdering?.vilkår.map((vilkår) => {
              const {
                id,
                identifikator,
                resultatAuto,
                begrunnelseAuto,
                beskrivelse,
                resultatSaksbehandler,
                begrunnelseSaksbehandler,
                lovReferanse,
              } = vilkår
              const vilkårOppfylt = (resultatSaksbehandler ? resultatSaksbehandler : resultatAuto)!
              //const saksbehandlersBegrunnelse = (begrunnelseSaksbehandler ? begrunnelseSaksbehandler : begrunnelseAuto) ?? ''
              const vurdert = resultatSaksbehandler ? 'Saksbehandler' : 'Automatisk'
              // TODO koble fakta felter med vilkår
              return (
                <Table.ExpandableRow
                  onClick={() => toggleExpandedRad(id)}
                  key={identifikator}
                  colSpan={6}
                  onOpenChange={() => toggleExpandedRad(id)}
                  open={åpneRader.includes(id)}
                  togglePlacement={'right'}
                  content={
                    <SaksbehandlersVurdering
                      sakID={sak.sakId}
                      vilkår={vilkår}
                      onSaved={() => {
                        mutate()
                        toggleExpandedRad(id)
                      }}
                    />
                  }
                >
                  <Table.DataCell scope="row">
                    <Alert variant={`${alertVariant(vilkårOppfylt)}`} size="small" inline>
                      {beskrivelse}
                    </Alert>
                  </Table.DataCell>
                  <Table.DataCell>{begrunnelseAuto || '-'}</Table.DataCell>
                  <Table.DataCell>{begrunnelseSaksbehandler || '-'}</Table.DataCell>
                  <Table.DataCell>{vurdert}</Table.DataCell>
                  <Table.DataCell>{lovReferanse}</Table.DataCell>
                </Table.ExpandableRow>
              )
            })}
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

  function toggleExpandedRad(id: string) {
    if (åpneRader.includes(id)) {
      setÅpneRader(åpneRader.filter((i) => i !== id))
    } else {
      setÅpneRader([...åpneRader, id])
    }
  }

  function oppsummertStatus(vilkår: Vilkår[]): VilkårsResultat {
    const vilkårsResultat = vilkår
      .map((v) => (v.resultatSaksbehandler ? v.resultatSaksbehandler : v.resultatAuto))
      .reduce((samletStatus, vilkårStatus) => {
        if (
          vilkårStatus === VilkårsResultat.NEI ||
          vilkårStatus === VilkårsResultat.KANSKJE ||
          vilkårStatus === VilkårsResultat.DOKUMENTASJON_MANGLER
        ) {
          return vilkårStatus
        } else {
          return samletStatus
        }
      }, VilkårsResultat.JA)

    console.log('Oppsummering', vilkårsResultat)

    return vilkårsResultat!
  }

  function alertTekst(alertVariant: 'success' | 'error' | 'warning') {
    switch (alertVariant) {
      case 'success':
        return 'Alle vilkårene er oppfylt'
      case 'error':
        return 'Ett eller flere vilkår er ikke oppfylt'
      case 'warning':
        return 'Ett eller flere vilkår må vurderes'
    }
  }

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
