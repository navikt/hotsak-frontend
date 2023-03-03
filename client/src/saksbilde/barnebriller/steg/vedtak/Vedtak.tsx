import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { Alert, Button, Detail, Heading, Panel, Tag } from '@navikt/ds-react'

import { baseUrl, post } from '../../../../io/http'
import { formaterDato } from '../../../../utils/date'
import { capitalizeName, formaterKontonummer } from '../../../../utils/stringFormating'

import { AlertContainer } from '../../../../felleskomponenter/AlertContainer'
import { Avstand } from '../../../../felleskomponenter/Avstand'
import { Kolonne, Rad } from '../../../../felleskomponenter/Flex'
import { TreKolonner } from '../../../../felleskomponenter/Kolonner'
import { Etikett } from '../../../../felleskomponenter/typografi'
import { OppgaveStatusType, StegType, VilkårsResultat } from '../../../../types/types.internal'
import { Historikk } from '../../../høyrekolonne/historikk/Historikk'
import { useBrillesak } from '../../../sakHook'
import { VenstreMeny } from '../../../venstremeny/Venstremeny'
import { alertVariant, oppsummertStatus } from '../vilkårsvurdering/oppsummertStatus'
import { BrevPanel } from './brev/BrevPanel'

export const Vedtak: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const { sak, mutate } = useBrillesak()

  //const kontonummer = useKontonummer(sak?.sakId, sak?.innsender.fnr)
  const VENSTREKOLONNE_BREDDE = '180px'

  const status = oppsummertStatus(sak?.vilkårsvurdering!.vilkår || [])

  useEffect(() => {
    if (status === VilkårsResultat.JA && !sak?.bruker.kontonummer) {
      console.log('Mangler kontonummer for bruker, kaller endepunkt for å få hentet inn det')
      post(`${baseUrl}/api/personinfo/kontonr/`, {
        brukersFodselsnummer: sak?.innsender.fnr,
        sakId: sak?.sakId,
      }).then(() => {
        mutate()
      })
    }
  }, [sak?.innsender.fnr, sak?.bruker.kontonummer, sak?.sakId, status, mutate])

  const sendTilGodkjenning = () => {
    setLoading(true)
    post(`/api/sak/${sak!.sakId}/kontroll`, {})
      .catch(() => setLoading(false))
      .then(() => {
        setLoading(false)
        mutate()
      })
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
                <Etikett>{capitalizeName(`${sak.innsender.navn}`)}</Etikett>
              </Kolonne>
            </Rad>
            {bruker.kontonummer ? (
              <Rad>
                <Kolonne width={VENSTREKOLONNE_BREDDE}>Kontonummer:</Kolonne>
                <Kolonne>
                  <Etikett>{formaterKontonummer(bruker?.kontonummer)}</Etikett>
                </Kolonne>
              </Rad>
            ) : (
              <Avstand paddingTop={6}>
                <Alert size="small" variant="warning">
                  <Etikett>Mangler kontonummer på bruker</Etikett>
                  <Detail>Bruker må kontaktes for å legge inn kontonummer før saken kan sendes til godkjenning.</Detail>
                </Alert>
              </Avstand>
            )}
          </>
        )}
        <Avstand paddingBottom={6} />

        {sak.status === OppgaveStatusType.AVVENTER_GODKJENNER || sak.steg === StegType.GODKJENNE ? (
          <Alert variant="info" size="small">
            {`Sendt til godkjenning ${formaterDato(sak.totrinnskontroll?.opprettet)}.`}
          </Alert>
        ) : (
          bruker.kontonummer && (
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
      <Historikk />
    </TreKolonner>
  )
}

const VenstreKolonne = styled(Panel)`
  border-left: 1px solid var(--a-border-default);
`
