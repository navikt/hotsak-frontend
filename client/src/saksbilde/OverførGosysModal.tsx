import { Title } from '@navikt/ds-react'
import { Tekst } from '../felleskomponenter/typografi'
import { Button, Loader } from '@navikt/ds-react'
import { DialogBoks, ButtonContainer } from '../felleskomponenter/Dialogboks'

interface OverførGosysModalProps {
  open: boolean
  onBekreft: Function
  loading: boolean
  onClose: Function
}


export const OverførGosysModal = ({ open, onBekreft, loading, onClose }: OverførGosysModalProps) => {
  // Modal && Modal.setAppElement("#root")

  return (
    <DialogBoks shouldCloseOnOverlayClick={false} open={open} onClose={() => {onClose()}}>
      <Title level="1" size="m" spacing={true}>
        Vil du overføre saken til Gosys
      </Title>
      <Tekst>
        Hvis saken overføres til Gosys, vil den dukke opp som en vanlig journalføringsoppgave. Journalføring og videre saksbehandling må gjøres manuelt i Gosys og Infotrygd.
      </Tekst>
      <ButtonContainer>
        <Button variant={'action'} size={'s'} onClick={() => onBekreft()}>
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
