import { Title } from '@navikt/ds-react'
import { Button, Loader } from '@navikt/ds-react'

import { DialogBoks, ButtonContainer } from '../felleskomponenter/Dialogboks'
import { Tekst } from '../felleskomponenter/typografi'

interface BekreftVedtakModalProps {
  open: boolean
  onBekreft: Function
  loading: boolean
  onClose: Function
}

export const BekreftVedtakModal = ({ open, onBekreft, loading, onClose }: BekreftVedtakModalProps) => {
  // Modal && Modal.setAppElement("#root")

  return (
    <DialogBoks
      shouldCloseOnOverlayClick={false}
      open={open}
      onClose={() => {
        onClose()
      }}
    >
      <Title level="1" size="m" spacing={true}>
        Vil du innvilge søknaden?
      </Title>
      <Tekst>
        Ved å innvilge søknaden blir det fattet et vedtak i saken og opprettet en serviceforespørsel i OEBS. Innbygger
        vil få beskjed om vedtaket på Ditt NAV.
      </Tekst>
      <ButtonContainer>
        <Button variant={'action'} size={'s'} onClick={() => onBekreft()} data-cy="btn-innvilg-soknad">
          <span>Innvilg søknaden</span>
          {loading && <Loader />}
        </Button>
        <Button
          variant={'primary'}
          size={'s'}
          onClick={() => {
            onClose()
          }}
        >
          Avbryt
        </Button>
      </ButtonContainer>
    </DialogBoks>
  )
}
