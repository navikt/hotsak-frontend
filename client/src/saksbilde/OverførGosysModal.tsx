import { Heading } from '@navikt/ds-react'
import { Button, Loader } from '@navikt/ds-react'

import { DialogBoks, ButtonContainer } from '../felleskomponenter/Dialogboks'
import { Tekst } from '../felleskomponenter/typografi'

interface OverførGosysModalProps {
  open: boolean
  onBekreft: () => void
  loading: boolean
  onClose: () => void
}

export const OverførGosysModal = ({ open, onBekreft, loading, onClose }: OverførGosysModalProps) => {
  // Modal && Modal.setAppElement("#root")

  return (
    <DialogBoks
      shouldCloseOnOverlayClick={false}
      open={open}
      onClose={() => {
        onClose()
      }}
    >
        <DialogBoks.Content>
      <Heading level="1" size="medium" spacing>
        Vil du overføre saken til Gosys?
      </Heading>
      <Tekst>
      Hvis saken overføres til Gosys, vil den dukke opp som en vanlig journalføringsoppgave. Journalføring og videre saksbehandling må gjøres manuelt i Gosys og Infotrygd. 
      Merk at det kan ta noen minutter før saken dukker opp i Gosys
      </Tekst>
      <ButtonContainer>
        <Button variant="primary" size="small" onClick={() => onBekreft()} data-cy="btn-overfor-soknad">
          Overfør saken
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
