import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'

import { Button, Detail, ErrorSummary, Heading, Panel, Table, Tag } from '@navikt/ds-react'

import { baseUrl, post } from '../../../../io/http'

import { Avstand } from '../../../../felleskomponenter/Avstand'
import { Knappepanel } from '../../../../felleskomponenter/Button'
import { Feilmelding } from '../../../../felleskomponenter/Feilmelding'
import { Brødtekst } from '../../../../felleskomponenter/typografi'
import { useSaksbehandlerKanRedigereBarnebrillesak } from '../../../../tilgang/useSaksbehandlerKanRedigereBarnebrillesak'
import { StegType, StepType, Vilkår, VilkårsResultat } from '../../../../types/types.internal'
import { useBrillesak } from '../../../sakHook'
import { useManuellSaksbehandlingContext } from '../../ManuellSaksbehandlingTabContext'
import { SaksbehandlersVurdering } from './SaksbehandlersVurdering'
import { Resultat } from './kolonner/Resultat'
import { VurdertAv } from './kolonner/VurdertAv'
import { alertVariant } from './oppsummertStatus'
import { metadataFor } from './vilkårMetada'

export const VurderVilkår: React.FC = () => {
  const { saksnummer } = useParams<{ saksnummer: string }>()
  const { sak, mutate } = useBrillesak()
  const { setStep } = useManuellSaksbehandlingContext()
  const [åpneRader, setÅpneRader] = useState<string[]>([])
  const [lagrer, setLagrer] = useState(false)
  const [submitAttempt, setSubmitAttempt] = useState<boolean>(false)
  const saksbehandlerKanRedigereBarnebrillesak = useSaksbehandlerKanRedigereBarnebrillesak(sak?.data)
  const errorRef = useRef<HTMLDivElement>(null)
  const [hasError, setHasError] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  function clearErrors() {
    setErrors([])
  }

  function valider() {
    const uavklarteVilkår: Vilkår[] =
      sak?.data.vilkårsvurdering?.vilkår.filter((vilkår) => vilkår.vilkårOppfylt === VilkårsResultat.KANSKJE) || []
    setHasError(uavklarteVilkår.length > 0)
    setErrors(uavklarteVilkår.map((vilkår) => vilkår.beskrivelse))
    return uavklarteVilkår?.length === 0
  }

  useEffect(() => {
    errorRef?.current && errorRef.current.focus()
  }, [hasError])

  useEffect(() => {
    if (submitAttempt) {
      valider()
    } else if (sak?.data.vilkårsvurdering?.resultat !== VilkårsResultat.KANSKJE) {
      clearErrors()
    }
  }, [submitAttempt, sak?.data.vilkårsvurdering?.resultat])

  function gåTilNesteSteg(sakId: number | string, steg: StegType) {
    if (steg === StegType.GODKJENNE) {
      setStep(StepType.FATTE_VEDTAK)
    } else {
      setLagrer(true)
      post(`${baseUrl}/api/sak/${sakId}/vilkarsvurdering`, {})
        .catch(() => setLagrer(false))
        .then(async () => {
          await mutate()
          setStep(StepType.FATTE_VEDTAK)
          setLagrer(false)
        })
    }
  }

  if (!sak) {
    return <Feilmelding>{`Fant ikke sak med saksnummer ${saksnummer}`}</Feilmelding>
  } // TODO: Håndere dette bedre/høyrere opp i komponent treet.

  if (!sak.data?.vilkårsvurdering) {
    return <Feilmelding>{`Vilkårsvurderingen manlgler resultat. Dette kan skyldes en teknisk feil.`}</Feilmelding>
  }
  const vilkår =
    sak.data.vilkårsvurdering?.vilkår.sort((a, b) => sorterPåLovreferanse(a.lovReferanse, b.lovReferanse)) || []

  const status = sak.data.vilkårsvurdering!.resultat
  const alertType = alertVariant(status)

  return (
    <>
      <Panel>
        <Heading level="1" size="small" spacing>
          Oversikt vilkår
        </Heading>
        <Detail>RESULTAT</Detail>
        <Tag variant={alertType} size="small">
          {status === VilkårsResultat.JA ? 'Innvilget' : status === VilkårsResultat.KANSKJE ? 'Må vurderes' : 'Avslag'}
        </Tag>

        {errors.length > 0 && (
          <Avstand paddingTop={6}>
            <ErrorSummary heading="Vilkår mangler vurdering og må vurders av saksbehandler" size="small" ref={errorRef}>
              {errors.map((error) => (
                <ErrorSummary.Item key={error}>{error}</ErrorSummary.Item>
              ))}
            </ErrorSummary>
          </Avstand>
        )}
        <Avstand paddingTop={6} />
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
            {vilkår.map((vilkår) => {
              const { id, vilkårId, beskrivelse, manuellVurdering, lovReferanse, vilkårOppfylt } = vilkår

              const vilkårMetadata = metadataFor(vilkårId)
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
                    <Brødtekst>{beskrivelse}</Brødtekst>
                  </Table.DataCell>
                  <Table.DataCell scope="row" style={{ width: '300px' }}>
                    {vilkårMetadata?.basertPå.map((metadata) => (
                      <Brødtekst key={`${metadata}`}>{metadata}</Brødtekst>
                    )) || '-'}
                  </Table.DataCell>
                  <Table.DataCell scope="row" style={{ width: '250px' }}>
                    <VurdertAv vilkårOppfylt={vilkårOppfylt} resultatSaksbehandler={manuellVurdering?.vilkårOppfylt} />
                  </Table.DataCell>
                  <Table.DataCell scope="row" style={{ width: '250px' }}>
                    <Brødtekst>{manuellVurdering?.begrunnelse || '-'}</Brødtekst>
                  </Table.DataCell>
                  <Table.DataCell scope="row" style={{ width: '150px' }}>
                    <Brødtekst>{lovReferanse}</Brødtekst>
                  </Table.DataCell>
                </Table.ExpandableRow>
              )
            })}
          </Table.Body>
        </Table>
        {
          <Knappepanel>
            <Button variant="secondary" size="small" onClick={() => setStep(StepType.REGISTRER)}>
              Forrige
            </Button>
            <Button
              variant="primary"
              size="small"
              onClick={() => {
                if (saksbehandlerKanRedigereBarnebrillesak) {
                  if (valider()) {
                    gåTilNesteSteg(sak.data.sakId, sak.data.steg)
                  }
                  setSubmitAttempt(true)
                } else {
                  setStep(StepType.FATTE_VEDTAK)
                }
              }}
              disabled={lagrer}
              loading={lagrer}
            >
              Neste
            </Button>
          </Knappepanel>
        }
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
