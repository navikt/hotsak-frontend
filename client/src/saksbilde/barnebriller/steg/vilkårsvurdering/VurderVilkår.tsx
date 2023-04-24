import { useState } from 'react'
import { useParams } from 'react-router'

import { Alert, BodyLong, Button, Heading, Panel, Table } from '@navikt/ds-react'

import { baseUrl, put } from '../../../../io/http'

import { AlertContainer, AlertContainerBred } from '../../../../felleskomponenter/AlertContainer'
import { Knappepanel } from '../../../../felleskomponenter/Button'
import { Feilmelding } from '../../../../felleskomponenter/Feilmelding'
import { useSaksbehandlerKanRedigereBarnebrillesak } from '../../../../tilgang/useSaksbehandlerKanRedigereBarnebrillesak'
import { StegType, VilkårsResultat } from '../../../../types/types.internal'
import { useBrillesak } from '../../../sakHook'
import { useManuellSaksbehandlingContext } from '../../ManuellSaksbehandlingTabContext'
import { SaksbehandlersVurdering } from './SaksbehandlersVurdering'
import { alertVariant, oppsummertStatus } from './oppsummertStatus'
import { metadataFor } from './vilkårMetada'

export const VurderVilkår: React.FC = () => {
  const { saksnummer } = useParams<{ saksnummer: string }>()
  const { sak, mutate } = useBrillesak()
  const { setValgtTab } = useManuellSaksbehandlingContext()
  const [åpneRader, setÅpneRader] = useState<string[]>([])
  const [lagrer, setLagrer] = useState(false)
  const saksbehandlerKanRedigereBarnebrillesak = useSaksbehandlerKanRedigereBarnebrillesak(sak)

  function gåTilNesteSteg(sakID: string, steg: StegType) {
    if (steg === StegType.GODKJENNE) {
      setValgtTab(StegType.FATTE_VEDTAK)
    } else {
      put(`${baseUrl}/api/sak/${sakID}/steg/fatte_vedtak`)
        .catch(() => setLagrer(false))
        .then(() => {
          setValgtTab(StegType.FATTE_VEDTAK)
          mutate()
          setLagrer(false)
        })
    }
  }

  if (!sak) {
    return <Feilmelding>{`Fant ikke sak med saknummer ${saksnummer}`}</Feilmelding>
  } // TODO: Håndere dette bedre/høyrere opp i komponent treet.

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
  const alertBoksType =
    oppsummertResultat === VilkårsResultat.JA
      ? 'success'
      : oppsummertResultat === VilkårsResultat.NEI
      ? 'info'
      : 'warning'

  return (
    <>
      <Panel>
        <Heading level="1" size="small" spacing>
          Foreløpig resultat
        </Heading>
        <AlertContainerBred>
          <Alert variant={alertBoksType} size="small">
            <BodyLong>{alertTekst(alertBoksType)}</BodyLong>
          </Alert>
        </AlertContainerBred>
        <Table size="small">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell scope="col">Vilkår</Table.HeaderCell>
              <Table.HeaderCell scope="col">Baseres på</Table.HeaderCell>
              <Table.HeaderCell scope="col">Vurdert</Table.HeaderCell>
              <Table.HeaderCell scope="col">Begrunnelse saksbehandler</Table.HeaderCell>
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
                beskrivelse,
                resultatSaksbehandler,
                begrunnelseSaksbehandler,
                lovReferanse,
              } = vilkår
              const vilkårOppfylt = (resultatSaksbehandler ? resultatSaksbehandler : resultatAuto)!
              const vurdert = resultatSaksbehandler ? 'Saksbehandler' : 'Automatisk'
              // TODO koble fakta felter med vilkår
              const lesevisning = identifikator === 'bestiltHosOptiker' || identifikator === 'komplettBrille'
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
                  <Table.DataCell>{metadataFor(identifikator)?.basertPå.join(', ') || '-'}</Table.DataCell>
                  <Table.DataCell>{vurdert}</Table.DataCell>
                  <Table.DataCell>{begrunnelseSaksbehandler || '-'}</Table.DataCell>
                  <Table.DataCell>{lovReferanse}</Table.DataCell>
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
            onClick={() => gåTilNesteSteg(sak.sakId, sak.steg)}
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

  function alertTekst(alertVariant: 'success' | 'warning' | 'info') {
    switch (alertVariant) {
      case 'success':
        return 'Alle vilkårene er oppfylt'
      case 'info':
        return 'Ett eller flere vilkår er ikke oppfylt'
      case 'warning':
        return 'Ett eller flere vilkår må vurderes'
    }
  }
}
