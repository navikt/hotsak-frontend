import { Heading } from '@navikt/ds-react'
import { Button, Loader } from '@navikt/ds-react'

import { DialogBoks, ButtonContainer } from '../felleskomponenter/Dialogboks'
import { Tekst } from '../felleskomponenter/typografi'

interface BekreftVedtakModalProps {
  open: boolean
  onBekreft: () => void
  loading: boolean
  onClose: () => void
}

export const BekreftVedtakModal = ({ open, onBekreft, loading, onClose }: BekreftVedtakModalProps) => {
  return (
    <DialogBoks
      shouldCloseOnOverlayClick={false}
      open={open}
      onClose={() => {
        onClose()
      }}
    >
        <DialogBoks.Content>
      <Heading level="1" size="medium" spacing={true}>
        Vil du innvilge søknaden?
      </Heading>
      <Tekst>
        Ved å innvilge søknaden blir det fattet et vedtak i saken og opprettet en serviceforespørsel i OEBS. Innbygger
        vil få beskjed om vedtaket på Ditt NAV.
      </Tekst>
      <ButtonContainer>
        <Button variant='primary' size='small' onClick={() => onBekreft()} data-cy="btn-innvilg-soknad">
         Innvilg søknaden
          {loading && <Loader size="small" />}
        </Button>
        <Button
          variant='secondary'
          size='small'
          onClick={() => {
            onClose()
          }}
        >
          Avbryt
        </Button>
      </ButtonContainer>
      </DialogBoks.Content>
    </DialogBoks>
  )
}
