import { useState } from 'react'
import { useParams } from 'react-router'

import { Alert, Button, Heading, Panel, Table } from '@navikt/ds-react'

import { baseUrl, post } from '../../../../io/http'

import { AlertContainer } from '../../../../felleskomponenter/AlertContainer'
import { Knappepanel } from '../../../../felleskomponenter/Button'
import { Feilmelding } from '../../../../felleskomponenter/Feilmelding'
import { Brødtekst } from '../../../../felleskomponenter/typografi'
import { useSaksbehandlerKanRedigereBarnebrillesak } from '../../../../tilgang/useSaksbehandlerKanRedigereBarnebrillesak'
import { StegType } from '../../../../types/types.internal'
import { useBrillesak } from '../../../sakHook'
import { useManuellSaksbehandlingContext } from '../../ManuellSaksbehandlingTabContext'
import { SaksbehandlersVurdering } from './SaksbehandlersVurdering'
import { Resultat } from './kolonner/Resultat'
import { VurdertAv } from './kolonner/VurdertAv'
import { Oppsummering } from './oppsummering/Oppsummering'
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
      post(`${baseUrl}/api/sak/${sakId}/vilkarsvurdering`, {})
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

  if (!sak.data?.vilkårsvurdering) {
    return <Feilmelding>{`Vilkårsvurderingen manlgler resultat. Dette kan skyldes en teknisk feil.`}</Feilmelding>
  }
  const oppsummertResultat = sak.data.vilkårsvurdering.resultat

  return (
    <>
      <Panel>
        <Heading level="1" size="small" spacing>
          Oversikt vilkår
        </Heading>
        <Oppsummering
          vilkår={
            sak.data.vilkårsvurdering?.vilkår.sort((a, b) => sorterPåLovreferanse(a.lovReferanse, b.lovReferanse)) || []
          }
          oppsummertResultat={oppsummertResultat}
        />
        <Table size="small">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell scope="col">Resultat</Table.HeaderCell>
              <Table.HeaderCell scope="col">Vilkår</Table.HeaderCell>
              <Table.HeaderCell scope="col">Baseres på</Table.HeaderCell>
              <Table.HeaderCell scope="col">Vurdert</Table.HeaderCell>
              <Table.HeaderCell scope="col">Detaljer</Table.HeaderCell>
              <Table.HeaderCell scope="col">Hjemmel</Table.HeaderCell>
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
              const vilkårOppfylt = resultatSaksbehandler ? resultatSaksbehandler : resultatAuto
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
                  <Table.DataCell scope="row" style={{ width: '180px', verticalAlign: 'top' }}>
                    <Resultat vilkårOppfylt={vilkårOppfylt} />
                  </Table.DataCell>
                  <Table.DataCell scope="row" style={{ width: '500px' }}>
                    {beskrivelse}
                  </Table.DataCell>
                  <Table.DataCell scope="row" style={{ width: '300px' }}>
                    {vilkårMetadata?.basertPå.map((metadata) => (
                      <Brødtekst key={`${metadata}`}>{metadata}</Brødtekst>
                    )) || '-'}
                  </Table.DataCell>
                  <Table.DataCell scope="row" style={{ width: '250px' }}>
                    <VurdertAv vilkårOppfylt={vilkårOppfylt} resultatSaksbehandler={resultatSaksbehandler} />
                  </Table.DataCell>
                  <Table.DataCell scope="row" style={{ width: '250px' }}>
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

  function sorterPåLovreferanse(a?: string, b?: string): number {
    if (!a) return 1
    if (!b) return -1

    if (a.startsWith('§') && !b.startsWith('§')) return 1
    if (!a.startsWith('§') && b.startsWith('§')) return -1

    return a.localeCompare(b)
  }

  function toggleExpandedRad(id: string) {
    if (åpneRader.includes(id)) {
      setÅpneRader(åpneRader.filter((i) => i !== id))
    } else {
      setÅpneRader([...åpneRader, id])
    }
  }
}
