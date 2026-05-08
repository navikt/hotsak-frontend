import { Alert, VStack } from '@navikt/ds-react'
import { forwardRef, useImperativeHandle } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useBrevMetadata } from '../../brev/useBrevMetadata'
import { usePerson } from '../../personoversikt/usePerson'
import { Brevmottaker, Sak } from '../../types/types.internal'
import { useMiljø } from '../../utils/useMiljø'
import { BrevTilBrukerEllerVerge } from '../v2/BrevTilBrukerEllerVerge'
import classes from './AvslagForm.module.css'

export interface AvslagFormValues {
  brevmottaker?: Brevmottaker
}

interface AvslagFormProps {
  sak: Sak
  onSubmit: (data: AvslagFormValues) => void
}

export interface AvslagFormHandle {
  submit: () => Promise<void>
}

export const AvslagForm = forwardRef<AvslagFormHandle, AvslagFormProps>(({ sak, onSubmit }, ref) => {
  const { erDev, erLocal } = useMiljø()
  const brevMetaData = useBrevMetadata()
  const { personInfo } = usePerson(sak.bruker.fnr)
  const harVergePåHjelpemiddelområdet = !!(
    personInfo?.vergemål?.some((vergemål) =>
      vergemål.vergeEllerFullmektig.tjenesteomraade?.some((tjeneste) => tjeneste.tjenesteoppgave === 'hjelpemidler')
    ) &&
    brevMetaData.harBrevISak &&
    (erDev || erLocal)
  )

  const form = useForm<AvslagFormValues>({
    defaultValues: {
      brevmottaker: undefined,
    },
  })

  useImperativeHandle(ref, () => ({
    submit: () => form.handleSubmit(onSubmit)(),
  }))

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <VStack gap="space-16">
        <Alert variant="info" size="small" className={classes.alertSpacing}>
          Du er i ferd med å sende ut et brev til bruker. Brevet vil bli sendt ut neste virkedag. Innbygger vil da få
          varsel om vedtaksresultatet.
        </Alert>
        {harVergePåHjelpemiddelområdet && personInfo && (
          <Controller
            name="brevmottaker"
            control={form.control}
            rules={{
              required: 'Du må velge om brevet skal sendes til bruker eller til brukers verge',
            }}
            render={({ field, fieldState }) => (
              <BrevTilBrukerEllerVerge
                person={personInfo}
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
        )}
      </VStack>
      <button type="submit" style={{ display: 'none' }} />
    </form>
  )
})
