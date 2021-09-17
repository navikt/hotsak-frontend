import styled from 'styled-components/macro'

import { Button, Tag } from '@navikt/ds-react'
import { Card } from './Card'
import { CardTitle } from './CardTitle'
import { Input } from 'nav-frontend-skjema'
import React from 'react'
import { putVedtak } from '../../io/http'
import { OppgaveStatusType, Sak, VedtakStatusType } from '../../types/types.internal'
import { Tekst } from '../../felleskomponenter/typografi'
import { capitalizeName } from '../../utils/stringFormating'
import { useInnloggetSaksbehandler } from '../../state/authentication'
import { BekreftVedtakModal } from '../BekreftVedtakModal'
import { IkkeTildelt } from '../../oppgaveliste/kolonner/IkkeTildelt'
// @ts-ignore
import { useSWRConfig } from 'swr'
interface VedtakCardProps {
  sak: Sak
}

export const TagGrid = styled.div`
  display: grid;
  grid-template-columns: 4.3rem auto;
  grid-column-gap: 0.75rem;
  grid-row-gap: 0.125rem;
`

const ButtonContainer = styled.div`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding-top: 1rem;
  align-self: flex-end;
`

const Knapp = styled(Button)`
  min-height: 0;
  margin: 2px;
  height: 1.8rem;
  padding: 0 0.75rem;
  box-sizing: border-box;
  font-size: var(--navds-font-size-m);
`

export const VedtakCard = ({ sak }: VedtakCardProps) => {
  const { saksid } = sak
  const [dokumentbeskrivelse, setDokumentbeskrivelse] = React.useState(sak.søknadGjelder)
  const saksbehandler = useInnloggetSaksbehandler()
  const [loading, setLoading] = React.useState(false)
  const [visBekreftelsesModal, setVisBekreftelsesModal] = React.useState(false)
  const { mutate } = useSWRConfig()

  const opprettVedtak = () => {
    setLoading(true)
    putVedtak(saksid, dokumentbeskrivelse, VedtakStatusType.INNVILGET)
      .catch(() => setLoading(false))
      .then(() => {
        setLoading(false)
        setVisBekreftelsesModal(false)
        mutate(`api/sak/${saksid}`)
      })
  }

  if (sak.vedtak && sak.vedtak.status === VedtakStatusType.INNVILGET) {
    return (
      <Card>
          
        <CardTitle>VEDTAK</CardTitle>
        <TagGrid>
        <Tag variant="success">Innvilget</Tag>
        <Tekst>06.09 2021</Tekst>
        </TagGrid>
      </Card>
    )
  }

  if (sak.status === OppgaveStatusType.SENDT_GOSYS) {
    return (
      <Card>
        <CardTitle>OVERFØRT</CardTitle>
        <Tekst>Saken er overført Gosys og behandles videre der. </Tekst>
      </Card>
    )
  }

  if (!sak.saksbehandler) {
    return (
      <Card>
        <CardTitle>SAK IKKE STARTET</CardTitle>
        <Tekst>Saken er ikke tildelt en saksbehandler enda</Tekst>
        <ButtonContainer>
          <IkkeTildelt oppgavereferanse={saksid} gåTilSak={false}></IkkeTildelt>
        </ButtonContainer>
      </Card>
    )
  }

  if (sak.saksbehandler && sak.saksbehandler.objectId !== saksbehandler.objectId) {
    return (
      <Card>
        <CardTitle>SAKSBEHANDLER</CardTitle>
        <Tekst>Saken er tildelt saksbehandler {capitalizeName(sak.saksbehandler.navn)}</Tekst>
        <ButtonContainer>
          <Knapp variant={'action'} size={'s'} onClick={() => alert('Tildeler sak til innlogget saksbehandler')}>
            Ta saken
          </Knapp>
        </ButtonContainer>
      </Card>
    )
  } else {
    return (
      <Card>
        <CardTitle>DOKUMENTBESKRIVELSE</CardTitle>
        <Input
          mini
          label="Søknad om:"
          description="Skriv inn hjelpemidler feks. rullator, seng."
          value={dokumentbeskrivelse}
          onChange={(event) => setDokumentbeskrivelse(event.target.value)}
        />
        <ButtonContainer>
          <Knapp variant={'action'} size={'s'} onClick={() => setVisBekreftelsesModal(true)}>
            <span>Innvilg søknaden</span>
          </Knapp>
          <Knapp
            variant={'primary'}
            size={'s'}
            onClick={() => {
              alert(`Sender søknad med saksnummer ${saksid} til gode gamle Gosys`)
            }}
          >
            Overfør til Gosys
          </Knapp>
        </ButtonContainer>
        <BekreftVedtakModal
          open={visBekreftelsesModal}
          onBekreft={() => opprettVedtak()}
          loading={loading}
          onClose={() => setVisBekreftelsesModal(false)}
        />
      </Card>
    )
  }
}
