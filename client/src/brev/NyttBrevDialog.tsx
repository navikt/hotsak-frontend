import { Button, Dialog, Select, VStack } from '@navikt/ds-react'
import { type FormEvent, useState } from 'react'

import { type Saksbehandlingsoppgave } from '../oppgave/oppgaveTypes.ts'
import { GJELDENDE_STILARK_VERSJON } from './breveditor/html/byggDokument.ts'
import { type Brev, Brevmal, Målform } from './brevTyper.ts'
import { useBrevActions } from './useBrevActions.ts'

interface NyttBrevDialogProps {
  open: boolean
  oppgave: Saksbehandlingsoppgave
  onClose: () => void
  onOpprettet: (brev: Brev) => void
}

export function NyttBrevDialog({ open, oppgave, onClose, onOpprettet }: NyttBrevDialogProps) {
  const [antallUker, setAntallUker] = useState(4)
  const { opprettBrevutkast } = useBrevActions(oppgave)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const brev = await opprettBrevutkast.trigger({
      brevutkast: {
        brevmal: Brevmal.BREVEDITOR_SVARTIDSBREV,
        brevmalVersjon: GJELDENDE_STILARK_VERSJON,
        målform: Målform.BOKMÅL,
        data: { antallUkerSvartid: antallUker },
      },
    })
    onOpprettet(brev)
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()} size="small">
      <Dialog.Popup closeOnOutsideClick={false} width="500px" aria-label="Nytt brev">
        <Dialog.Header>
          <Dialog.Title>Nytt brev</Dialog.Title>
        </Dialog.Header>
        <form onSubmit={handleSubmit}>
          <Dialog.Body>
            <VStack gap="space-16">
              <Select label="Brevtype" value={Brevmal.BREVEDITOR_SVARTIDSBREV} readOnly>
                <option value={Brevmal.BREVEDITOR_SVARTIDSBREV}>Svartidsbrev</option>
              </Select>
              <Select
                label="Forventet behandlingstid"
                value={antallUker}
                onChange={(event) => setAntallUker(Number(event.target.value))}
              >
                <option value={4}>4 uker</option>
                <option value={12}>12 uker</option>
                <option value={18}>18 uker</option>
              </Select>
            </VStack>
          </Dialog.Body>
          <Dialog.Footer>
            <Button type="button" size="small" variant="secondary" onClick={onClose}>
              Avbryt
            </Button>
            <Button type="submit" size="small" loading={opprettBrevutkast.isMutating}>
              Opprett brevutkast
            </Button>
          </Dialog.Footer>
        </form>
      </Dialog.Popup>
    </Dialog>
  )
}
