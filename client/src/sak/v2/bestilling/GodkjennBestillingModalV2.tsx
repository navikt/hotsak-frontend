import { VStack } from '@navikt/ds-react'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { FritekstPanel } from '../../felles/FritekstPanel'
import { Tekst } from '../../../felleskomponenter/typografi'
import { BekreftelsesDialog } from '../../../saksbilde/komponenter/BekreftelsesDialog'
import { useBehovsmelding } from '../../../saksbilde/useBehovsmelding'
import { useSakActions } from '../../../saksbilde/useSakActions'
import { useBehandling } from '../behandling/useBehandling'

export interface GodkjennBestillingModalV2Props {
  open: boolean
  onClose(): void
}

export function GodkjennBestillingModalV2({ open, onClose }: GodkjennBestillingModalV2Props) {
  const { behovsmelding } = useBehovsmelding()
  const leveringsmerknad = behovsmelding?.levering.utleveringMerknad
  const { godkjennBestilling, state } = useSakActions()
  const { mutate: mutateBehandling } = useBehandling()
  const [loading, setLoading] = useState(false)

  const form = useForm({ defaultValues: { utleveringMerknad: leveringsmerknad ?? '' } })

  const handleBekreft = form.handleSubmit(async (data) => {
    setLoading(true)
    try {
      await godkjennBestilling(data.utleveringMerknad)
      await mutateBehandling()
      onClose()
    } finally {
      setLoading(false)
    }
  })

  return (
    <FormProvider {...form}>
      <BekreftelsesDialog
        width="700px"
        open={open}
        heading="Godkjenn bestillingen"
        bekreftButtonLabel="Godkjenn bestillingen"
        onBekreft={handleBekreft}
        loading={loading || state.loading}
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
