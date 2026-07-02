import { BodyShort, Button, Dialog, HStack } from '@navikt/ds-react'
import { useNavigate } from 'react-router'

import { type JournalføringV2Response } from './journalføringTypes.ts'

interface JournalføringFerdigModalProps {
  open: boolean
  resultat: JournalføringV2Response | null
  onClose(): void
}

export function JournalføringFerdigModal({ open, resultat, onClose }: JournalføringFerdigModalProps) {
  const navigate = useNavigate()

  function navigerOgLukkModal(sti: string) {
    onClose()
    navigate(sti)
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()} size="medium">
      <Dialog.Popup>
        <Dialog.Header>
          <Dialog.Title>Journalpost ferdig journalført</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <BodyShort>Sak med {resultat?.sakId ?? '–'} ble opprettet.</BodyShort>
        </Dialog.Body>
        <Dialog.Footer>
          <HStack gap="space-16" align="center" justify="center">
            <Button
              variant="tertiary"
              size="small"
              onClick={() => resultat && navigerOgLukkModal(`/oppgave/${resultat.oppgaveId}`)}
            >
              Til saken
            </Button>
            <Button variant="tertiary" size="small" onClick={() => navigerOgLukkModal('/oppgaver/mine')}>
              Til mine oppgaver
            </Button>
            <Button variant="tertiary" size="small" onClick={() => navigerOgLukkModal('/oppgaver/enhetens')}>
              Til enhetens oppgaver
            </Button>
          </HStack>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  )
}
