import { useState } from 'react'
import { useParams } from 'react-router'
import styled from 'styled-components'

import { Alert, Button, Detail, Heading, Panel, Tag } from '@navikt/ds-react'

import { post } from '../../../../io/http'
import { formaterDato } from '../../../../utils/date'
import { capitalizeName, formaterKontonummer } from '../../../../utils/stringFormating'

import { AlertContainer } from '../../../../felleskomponenter/AlertContainer'
import { Avstand } from '../../../../felleskomponenter/Avstand'
import { Kolonne, Rad } from '../../../../felleskomponenter/Flex'
import { TreKolonner } from '../../../../felleskomponenter/Kolonner'
import { SkjemaAlert } from '../../../../felleskomponenter/SkjemaAlert'
import { Etikett } from '../../../../felleskomponenter/typografi'
import { OppgaveStatusType, StegType, VilkårsResultat } from '../../../../types/types.internal'
import { useBrillesak } from '../../../sakHook'
import { alertVariant, oppsummertStatus } from '../vilkårsvurdering/oppsummertStatus'
import { BrevPanel } from './brev/BrevPanel'

export const Vedtak: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const { saksnummer } = useParams<{ saksnummer: string }>()
  const { sak, mutate } = useBrillesak()

  const VENSTREKOLONNE_BREDDE = '180px'
  const status = oppsummertStatus(sak?.vilkårsvurdering!.vilkår || [])

  const sendTilGodkjenning = () => {
    setLoading(true)
    post(`/api/sak/${sak!.sakId}/kontroll`, {})
      .catch((e) => {
        setLoading(false)

        // TODO Håndtere feil her
      })
      .then(() => {
        setLoading(false)
        mutate()
      })
  }

  function kanGåVidereTilTotrinnskontroll(): boolean {
    return status === VilkårsResultat.NEI || sak?.utbetalingsmottaker?.kontonummer !== undefined
  }

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

  const { bruker, vilkårsvurdering } = sak

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
        {status === VilkårsResultat.JA && (
          <>
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
                <Etikett>{capitalizeName(`${sak.utbetalingsmottaker?.navn}`)}</Etikett>
              </Kolonne>
            </Rad>
            {sak.utbetalingsmottaker?.kontonummer ? (
              <Rad>
                <Kolonne width={VENSTREKOLONNE_BREDDE}>Kontonummer:</Kolonne>
                <Kolonne>
                  <Etikett>{formaterKontonummer(sak.utbetalingsmottaker?.kontonummer)}</Etikett>
                </Kolonne>
              </Rad>
            ) : (
              <>
                <SkjemaAlert variant="warning">
                  <Etikett>Mangler kontonummer på bruker</Etikett>
                  <Detail>
                    Personen som har søkt om tilskudd har ikke registrert et kontonummer i NAV sine systemer. Kontakt
                    vedkommende for å be dem registrere et kontonummer.
                  </Detail>
                </SkjemaAlert>
                <Avstand paddingTop={4} />
                <Button
                  variant="secondary"
                  size="small"
                  loading={loading}
                  disabled={loading}
                  onClick={(e) => {
                    e.preventDefault()
                    post('/api/utbetalingsmottaker', {
                      fnr: sak.utbetalingsmottaker?.fnr,
                      sakId: Number(saksnummer),
                    }).then(() => {
                      mutate()
                    })
                  }}
                >
                  Hent kontonummer på nytt
                </Button>
              </>
            )}
          </>
        )}
        <Avstand paddingBottom={6} />

        {sak.status === OppgaveStatusType.AVVENTER_GODKJENNER || sak.steg === StegType.GODKJENNE ? (
          <Alert variant="info" size="small">
            {`Sendt til godkjenning ${formaterDato(sak.totrinnskontroll?.opprettet)}.`}
          </Alert>
        ) : (
          kanGåVidereTilTotrinnskontroll() && (
            <Button
              loading={loading}
              disabled={loading}
              size="small"
              variant="primary"
              onClick={() => sendTilGodkjenning()}
            >
              Send til godkjenning
            </Button>
          )
        )}
      </Panel>
      <VenstreKolonne>
        <BrevPanel sakID={sak.sakId} />
      </VenstreKolonne>
    </TreKolonner>
  )
}

const VenstreKolonne = styled(Panel)`
  border-left: 1px solid var(--a-border-default);
`
