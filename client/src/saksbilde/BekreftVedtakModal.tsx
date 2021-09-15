import { Modal } from '@navikt/ds-react'
import { Title } from '@navikt/ds-react'
import styled from 'styled-components/macro'
import { Tekst } from '../felleskomponenter/typografi'
import { Button, Loader } from '@navikt/ds-react'

const BekreftModal = styled(Modal)`
  width: 600px;
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

interface BekreftVedtakModalProps {
  open: boolean
  onBekreft: Function
  loading: boolean
  onClose: Function
}

export const BekreftVedtakModal = ({ open, onBekreft, loading, onClose }: BekreftVedtakModalProps) => {
  // Modal && Modal.setAppElement("#root")

  return (
    <BekreftModal shouldCloseOnOverlayClick={false} open={open} onClose={() => {onClose()}}>
      <Title level="1" size="m" spacing={true}>
        Bekreft vedtak
      </Title>
      <Tekst>
        Ved å innvilge denne saken blir det fattet vedtak, opprettet Serviceforespørsel i OEBS og noe i
        dokumentoversikten i Gosys.
      </Tekst>
      <Tekst>Er du sikker på du vil fortsette?</Tekst>
      <ButtonContainer>
        <Knapp variant={'action'} size={'s'} onClick={() => onBekreft()}>
          <span>Bekreft</span>
          {loading && <Loader />}
        </Knapp>
        <Knapp
          variant={'primary'}
          size={'s'}
          onClick={() => {
           onClose()
          }}
        >
         Avbryt
        </Knapp>
      </ButtonContainer>
    </BekreftModal>
  )
}
