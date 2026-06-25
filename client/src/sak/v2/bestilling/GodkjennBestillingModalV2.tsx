import { VStack } from '@navikt/ds-react'
import { FormProvider, useForm } from 'react-hook-form'

import { Tekst } from '../../../felleskomponenter/typografi'
import { useOppgave } from '../../../oppgave/useOppgave'
import { BekreftelsesDialog } from '../../../saksbilde/komponenter/BekreftelsesDialog'
import { useBehovsmelding } from '../../../saksbilde/useBehovsmelding'
import { FritekstPanel } from '../../felles/FritekstPanel'
import { Bestillingsresultat } from '../behandling/behandlingTyper'
import { useBehandlingActions } from '../behandling/useBehandlingActions'

export interface GodkjennBestillingModalV2Props {
  open: boolean
  onClose(): void
}

export function GodkjennBestillingModalV2({ open, onClose }: GodkjennBestillingModalV2Props) {
  const { behovsmelding } = useBehovsmelding()
  const leveringsmerknad = behovsmelding?.levering.utleveringMerknad
  const { oppgave } = useOppgave()
  const { opprettOgferdigstillBestillingBehandling } = useBehandlingActions()

  const form = useForm({ defaultValues: { utleveringMerknad: leveringsmerknad ?? '' } })

  const handleBekreft = form.handleSubmit(async (data) => {
    await opprettOgferdigstillBestillingBehandling.trigger({
      oppgaveId: oppgave?.oppgaveId,
      utfall: {
        type: 'BESTILLING',
        utfall: Bestillingsresultat.GODKJENT,
        utleveringsmerknad: data.utleveringMerknad,
      },
    })
    onClose()
  })

  return (
    <FormProvider {...form}>
      <BekreftelsesDialog
        width="700px"
        open={open}
        heading="Godkjenn bestillingen"
        bekreftButtonLabel="Godkjenn bestillingen"
        onBekreft={handleBekreft}
        loading={opprettOgferdigstillBestillingBehandling.isMutating}
        onClose={onClose}
      >
        <VStack gap="space-16">
          {leveringsmerknad && <FritekstPanel />}
          <Tekst>
            Når du godkjenner bestillingen blir det automatisk opprettet og klargjort en ordre i OeBS. Du trenger ikke
            gjøre noe mer med saken.
          </Tekst>
        </VStack>
      </BekreftelsesDialog>
    </FormProvider>
  )
}
