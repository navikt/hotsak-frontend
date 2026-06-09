import { VStack } from '@navikt/ds-react'
import { FormProvider, useForm } from 'react-hook-form'
import { FritekstPanel } from '../../sak/felles/FritekstPanel'
import { Tekst } from '../../felleskomponenter/typografi'
import { BekreftelsesDialog } from '../komponenter/BekreftelsesDialog'

export interface OrdreModalProps {
  loading?: boolean
  open?: boolean
  onBekreft(): void | Promise<void>
  onClose(): void | Promise<void>
}

export interface FormModalProps extends Omit<OrdreModalProps, 'onBekreft'> {
  leveringsmerknad?: string
  onBekreft(merknad?: string): void | Promise<void>
}

export function BekreftAutomatiskOrdre({ open, onBekreft, loading, onClose, leveringsmerknad }: FormModalProps) {
  const form = useForm({ defaultValues: { utleveringMerknad: leveringsmerknad ?? '' } })

  const handleBekreft = form.handleSubmit((data) => onBekreft(data.utleveringMerknad))

  return (
    <FormProvider {...form}>
      <BekreftelsesDialog
        width="700px"
        open={open}
        heading="Godkjenn bestillingen"
        bekreftButtonLabel="Godkjenn bestillingen"
        onBekreft={handleBekreft}
        loading={loading}
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

export function BekreftManuellOrdre({ open, onBekreft, loading, onClose }: OrdreModalProps) {
  return (
    <BekreftelsesDialog
      width="600px"
      open={open}
      heading="Opprett ordre i OeBS"
      bekreftButtonLabel="Opprett ordre i OeBS"
      onBekreft={onBekreft}
      loading={loading}
      onClose={onClose}
    >
      <Tekst spacing>
        Når du oppretter ordre i OeBS må du etterpå gå til OeBS for å fullføre den. Husk å utføre de nødvendige
        oppgavene i OeBS før du klargjør ordren. Ordrenummeret vil vises under Historikk i løpet av kort tid.
      </Tekst>
    </BekreftelsesDialog>
  )
}
