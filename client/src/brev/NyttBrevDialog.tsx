import { Button, Dialog, LocalAlert, Select, VStack } from '@navikt/ds-react'
import { type FormEvent, useState } from 'react'

import { HttpError } from '../io/HttpError.ts'
import { type Saksbehandlingsoppgave } from '../oppgave/oppgaveTypes.ts'
import { type BrevmalInitialisering } from './breveditor/breveditorTyper.ts'
import { GJELDENDE_STILARK_VERSJON } from './breveditor/html/byggDokument.ts'
import {
  type Brev,
  type BreveditorbrevUtenVedtak,
  Brevmal,
  BrevmalTekst,
  isBreveditorbrevUtenVedtak,
  Målform,
} from './brevTyper.ts'
import { useBrevActions } from './useBrevActions.ts'

interface NyttBrevDialogProps {
  open: boolean
  oppgave: Saksbehandlingsoppgave
  tilgjengeligeBrevmaler: readonly BreveditorbrevUtenVedtak[]
  onClose: () => void
  onOpprettet: (brev: Brev) => void
}

export function NyttBrevDialog({ open, oppgave, tilgjengeligeBrevmaler, onClose, onOpprettet }: NyttBrevDialogProps) {
  const [valgtBrevmal, setValgtBrevmal] = useState<BreveditorbrevUtenVedtak>(
    tilgjengeligeBrevmaler[0] ?? Brevmal.BREVEDITOR_SVARTIDSBREV
  )
  const [antallUker, setAntallUker] = useState(4)
  const { opprettBrevutkast } = useBrevActions<BrevmalInitialisering>(oppgave)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const brev = await opprettBrevutkast.trigger({
        brevutkast: {
          brevmal: valgtBrevmal,
          brevmalVersjon: GJELDENDE_STILARK_VERSJON,
          målform: Målform.BOKMÅL,
          data:
            valgtBrevmal === Brevmal.BREVEDITOR_SVARTIDSBREV
              ? { templateValues: { auto_antall_uker_svartid: `${antallUker} uker` } }
              : {},
        },
      })
      onOpprettet(brev)
    } catch (error) {
      if (HttpError.isHttpError(error) && error.isConflict()) return
      throw error
    }
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
              <Select
                label="Brevtype"
                value={valgtBrevmal}
                onChange={(event) => {
                  if (isBreveditorbrevUtenVedtak(event.target.value)) setValgtBrevmal(event.target.value)
                }}
              >
                {tilgjengeligeBrevmaler.map((brevmal) => (
                  <option key={brevmal} value={brevmal}>
                    {BrevmalTekst[brevmal]}
                  </option>
                ))}
              </Select>
              {valgtBrevmal === Brevmal.BREVEDITOR_SVARTIDSBREV && (
                <Select
                  label="Forventet behandlingstid"
                  value={antallUker}
                  onChange={(event) => setAntallUker(Number(event.target.value))}
                >
                  <option value={4}>4 uker</option>
                  <option value={12}>12 uker</option>
                  <option value={18}>18 uker</option>
                </Select>
              )}
              {opprettBrevutkast.error?.isConflict() && (
                <LocalAlert status="warning">
                  <LocalAlert.Header>
                    <LocalAlert.Title>{BrevmalTekst[valgtBrevmal]} finnes allerede</LocalAlert.Title>
                  </LocalAlert.Header>
                  <LocalAlert.Content>Det kan bare opprettes ett brev av hver brevtype per sak.</LocalAlert.Content>
                </LocalAlert>
              )}
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
