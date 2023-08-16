import { useState } from 'react'
import { useParams } from 'react-router'
import styled from 'styled-components'

import { Alert, BodyLong, Button, Heading, Panel, Table } from '@navikt/ds-react'

import { baseUrl, put } from '../../../../io/http'

import { AlertContainer, AlertContainerBred } from '../../../../felleskomponenter/AlertContainer'
import { Avstand } from '../../../../felleskomponenter/Avstand'
import { Knappepanel } from '../../../../felleskomponenter/Button'
import { Feilmelding } from '../../../../felleskomponenter/Feilmelding'
import { Brødtekst, Etikett } from '../../../../felleskomponenter/typografi'
import { useSaksbehandlerKanRedigereBarnebrillesak } from '../../../../tilgang/useSaksbehandlerKanRedigereBarnebrillesak'
import { StegType, Vilkår, VilkårsResultat } from '../../../../types/types.internal'
import { useBrillesak } from '../../../sakHook'
import { useManuellSaksbehandlingContext } from '../../ManuellSaksbehandlingTabContext'
import { SaksbehandlersVurdering } from './SaksbehandlersVurdering'
import { alertVariant, oppsummertStatus, vilkårStatusTekst } from './oppsummertStatus'
import { metadataFor } from './vilkårMetada'

export const VurderVilkår: React.FC = () => {
  const { saksnummer } = useParams<{ saksnummer: string }>()
  const { sak, mutate } = useBrillesak()
  const { setValgtTab } = useManuellSaksbehandlingContext()
  const [åpneRader, setÅpneRader] = useState<string[]>([])
  const [lagrer, setLagrer] = useState(false)
  const saksbehandlerKanRedigereBarnebrillesak = useSaksbehandlerKanRedigereBarnebrillesak(sak?.data)

  function gåTilNesteSteg(sakId: number | string, steg: StegType) {
    if (steg === StegType.GODKJENNE) {
      setValgtTab(StegType.FATTE_VEDTAK)
    } else {
      put(`${baseUrl}/api/sak/${sakId}/steg/fatte_vedtak`)
        .catch(() => setLagrer(false))
        .then(() => {
          setValgtTab(StegType.FATTE_VEDTAK)
          mutate()
          setLagrer(false)
        })
    }
  }

  if (!sak) {
    return <Feilmelding>{`Fant ikke sak med saksnummer ${saksnummer}`}</Feilmelding>
  } // TODO: Håndere dette bedre/høyrere opp i komponent treet.

  if (sak?.data.steg === StegType.INNHENTE_FAKTA) {
    return (
      <AlertContainer>
        <Alert variant="info" size="small">
          {`Denne saken har ikke fullført steget "Registrer søknad" enda. Resultat av vilkårsvurderingen kan ikke vises
          før det er fullført.`}
        </Alert>
      </AlertContainer>
    )
  }

  const oppsummertResultat = oppsummertStatus(sak.data.vilkårsvurdering!.vilkår)

  return (
    <>
      <Panel>
        <Heading level="1" size="small" spacing>
          Oversikt vilkår
        </Heading>
        <Oppsummering vilkår={sak.data.vilkårsvurdering?.vilkår || []} oppsummertResultat={oppsummertResultat} />
        <Table size="small">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell scope="col">Resultat</Table.HeaderCell>
              <Table.HeaderCell scope="col">Vilkår</Table.HeaderCell>
              <Table.HeaderCell scope="col">Baseres på</Table.HeaderCell>
              <Table.HeaderCell scope="col">Vurdert</Table.HeaderCell>
              <Table.HeaderCell scope="col">Detaljer</Table.HeaderCell>
              <Table.HeaderCell scope="col">§ i forskrift</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {sak.data.vilkårsvurdering?.vilkår.map((vilkår) => {
              const {
                id,
                vilkårId,
                resultatAuto,
                beskrivelse,
                resultatSaksbehandler,
                begrunnelseSaksbehandler,
                lovReferanse,
              } = vilkår
              const vilkårMetadata = metadataFor(vilkårId)
              const vilkårOppfylt = (resultatSaksbehandler ? resultatSaksbehandler : resultatAuto)!
              const vurdert = resultatSaksbehandler ? 'Saksbehandler' : 'Automatisk - basert på saksbehandlers input'
              const lesevisning = !vilkårMetadata?.overstyrbarAvSaksbehandler

              return (
                <Table.ExpandableRow
                  onClick={() => toggleExpandedRad(id)}
                  key={id}
                  colSpan={6}
                  onOpenChange={() => toggleExpandedRad(id)}
                  open={åpneRader.includes(id)}
                  togglePlacement={'right'}
                  content={
                    <SaksbehandlersVurdering
                      lesevisning={lesevisning || !saksbehandlerKanRedigereBarnebrillesak}
                      sakId={sak.data.sakId}
                      vilkår={vilkår}
                      onCanceled={() => toggleExpandedRad(id)}
                      onSaved={() => {
                        mutate()
                        toggleExpandedRad(id)
                      }}
                    />
                  }
                >
                  <Table.DataCell scope="row" style={{ width: '120px', verticalAlign: 'top' }}>
                    <Alert variant={`${alertVariant(vilkårOppfylt)}`} size="small" inline>
                      {vilkårStatusTekst(vilkårOppfylt)}
                    </Alert>
                  </Table.DataCell>
                  <Table.DataCell scope="row" style={{ width: '500px' }}>
                    {beskrivelse}
                  </Table.DataCell>
                  <Table.DataCell scope="row" style={{ width: '300px' }}>
                    {vilkårMetadata?.basertPå.map((metadata) => (
                      <Brødtekst key={`${metadata}`}>{metadata}</Brødtekst>
                    )) || '-'}
                  </Table.DataCell>
                  <Table.DataCell scope="row" style={{ width: '150px' }}>
                    {vurdert}
                  </Table.DataCell>
                  <Table.DataCell scope="row" style={{ width: '400px' }}>
                    {begrunnelseSaksbehandler || '-'}
                  </Table.DataCell>
                  <Table.DataCell scope="row" style={{ width: '150px' }}>
                    {lovReferanse}
                  </Table.DataCell>
                </Table.ExpandableRow>
              )
            })}
          </Table.Body>
        </Table>
        <Knappepanel>
          <Button variant="secondary" size="small" onClick={() => setValgtTab(StegType.INNHENTE_FAKTA)}>
            Forrige
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={() => gåTilNesteSteg(sak.data.sakId, sak.data.steg)}
            disabled={lagrer}
            loading={lagrer}
          >
            Neste
          </Button>
        </Knappepanel>
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
}

const ListeElement = styled.li`
  list-style: disc;
`

const Vilkårbeskrivelser = ({ vilkår, resultat }: { vilkår?: Vilkår[]; resultat: VilkårsResultat }) => {
  if (resultat === VilkårsResultat.JA || !vilkår) {
    return <></>
  }

  return (
    <ul>
      {vilkår
        .filter((v) => {
          const vilkårresultat = v.resultatSaksbehandler ? v.resultatSaksbehandler : v.resultatAuto
          return vilkårresultat === resultat
        })
        .map((v) => (
          <ListeElement key={v.id}>{v.beskrivelse}</ListeElement>
        ))}
    </ul>
  )
}

const Oppsummering = ({ oppsummertResultat, vilkår }: { oppsummertResultat: VilkårsResultat; vilkår: Vilkår[] }) => {
  const alertBoksType =
    oppsummertResultat === VilkårsResultat.JA
      ? 'success'
      : oppsummertResultat === VilkårsResultat.NEI
      ? 'info'
      : 'warning'

  return (
    <AlertContainerBred>
      <Alert variant={alertBoksType} size="small">
        <BodyLong>{AlertTekst(alertBoksType)}</BodyLong>
        <Avstand paddingTop={3}>
          <Vilkårbeskrivelser vilkår={vilkår} resultat={oppsummertResultat} />
        </Avstand>
      </Alert>
    </AlertContainerBred>
  )
}

function AlertTekst(alertVariant: 'success' | 'warning' | 'info') {
  switch (alertVariant) {
    case 'success':
      return <Etikett>Alle vilkårene er oppfylt</Etikett>
    case 'info':
      return <Etikett>Søknaden vil bli avslått fordi det finnes vilkår som ikke er oppfylt:</Etikett>
    case 'warning':
      return <Etikett>Noen av vilkårende må vurderes</Etikett>
  }
}
