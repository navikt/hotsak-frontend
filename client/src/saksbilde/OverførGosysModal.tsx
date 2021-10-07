import { Title } from '@navikt/ds-react'
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
      <Title level="1" size="m" spacing>
        Vil du overføre saken til Gosys?
      </Title>
      <Tekst>
        Hvis saken overføres til Gosys, vil den dukke opp som en vanlig journalføringsoppgave. Journalføring og videre
        saksbehandling må gjøres manuelt i Gosys og Infotrygd.
      </Tekst>
      <ButtonContainer>
        <Button variant="action" size="s" onClick={() => onBekreft()} data-cy="btn-overfor-soknad">
          <span>Overfør saken</span>
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
