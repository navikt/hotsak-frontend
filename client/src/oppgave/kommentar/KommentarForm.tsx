import { Alert, Button, Textarea, VStack } from '@navikt/ds-react'

import { useForm } from 'react-hook-form'
import type { Oppgave } from '../oppgaveTypes'
import { useOppgaveActions } from '../useOppgaveActions'

export interface KommentarFormProps {
  oppgave: Oppgave
}

export function KommentarForm(props: KommentarFormProps) {
  const { oppgave } = props
  const { lagreKommentar } = useOppgaveActions(oppgave)
  const form = useForm({
    defaultValues: {
      tekst: '',
    },
  })
  const handleSubmit = form.handleSubmit(async ({ tekst }) => {
    await lagreKommentar(tekst)
    form.reset({ tekst: '' })
  })
  return (
    <div>
      <VStack as="form" gap="space-16" marginBlock="space-20 space-0" onSubmit={handleSubmit}>
        <Alert variant="info" size="small" inline>
          Kommentaren kan bli utlevert til innbygger ved forespørsel om innsyn
        </Alert>
        <Textarea label="Kommentar" size="small" minLength={3} maxLength={2000} {...form.register('tekst')} />
        <div>
          <Button type="submit" size="small" variant="secondary">
            Lagre kommentar
          </Button>
        </div>
      </VStack>
    </div>
  )
}
