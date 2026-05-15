import { Alert, Button, Textarea, VStack } from '@navikt/ds-react'

import { useForm } from 'react-hook-form'
import { useToast } from '../../felleskomponenter/toast/useToast'
import type { Oppgave } from '../oppgaveTypes'
import { useOppgaveActions } from '../useOppgaveActions'

export interface KommentarFormProps {
  oppgave: Oppgave
}

export function KommentarForm(props: KommentarFormProps) {
  const { oppgave } = props
  const { lagreKommentar } = useOppgaveActions(oppgave)
  const { showSuccessToast } = useToast()
  const form = useForm({
    defaultValues: {
      tekst: '',
    },
  })

  const {
    formState: { isSubmitting, errors },
  } = form

  const handleSubmit = form.handleSubmit(async ({ tekst }) => {
    await lagreKommentar(tekst)
    showSuccessToast('Kommentaren ble lagret')
    form.reset({ tekst: '' })
  })

  return (
    <div>
      <VStack as="form" gap="space-16" onSubmit={handleSubmit}>
        <Alert variant="info" size="small" inline>
          Kommentaren kan bli utlevert til innbygger ved forespørsel om innsyn
        </Alert>
        <Textarea
          label="Kommentar"
          size="small"
          minLength={3}
          maxLength={2000}
          error={errors.tekst?.message}
          {...form.register('tekst', {
            required: 'Du må skrive en kommentar',
            minLength: {
              value: 3,
              message: 'Kommentaren må være minst 3 tegn',
            },
            maxLength: {
              value: 2000,
              message: 'Kommentaren kan ikke være mer enn 2000 tegn',
            },
          })}
        />
        <div>
          <Button type="submit" size="small" variant="secondary" loading={isSubmitting}>
            Lagre kommentar
          </Button>
        </div>
      </VStack>
    </div>
  )
}
