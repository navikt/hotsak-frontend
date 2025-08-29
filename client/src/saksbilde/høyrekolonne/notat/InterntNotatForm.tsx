import '@mdxeditor/editor/style.css'
import { Alert, Button, HStack, VStack } from '@navikt/ds-react'
import { FormProvider, useForm } from 'react-hook-form'

import { InfoToast } from '../../../felleskomponenter/Toast.tsx'
import { FerdigstillNotatRequest, MålformType, Notat, NotatType } from '../../../types/types.internal.ts'
import type { NotatFormValues } from './Notater.tsx'
import { NotatForm } from './NotatForm.tsx'
import { SlettUtkast } from './SlettUtkast.tsx'
import { useFerdigstillNotat } from './useFerdigstillNotat.tsx'
import { useNotater } from './useNotater.tsx'
import { useUtkastEndret } from './useUtkastEndret.ts'

export interface InterntNotatFormProps {
  sakId: string
  lesevisning: boolean
  aktivtUtkast?: Notat
}

export function InterntNotatForm({ sakId, lesevisning, aktivtUtkast }: InterntNotatFormProps) {
  const { mutate: mutateNotater, isLoading: notaterLaster } = useNotater(sakId)

  const form = useForm<NotatFormValues>({
    defaultValues: {
      tittel: aktivtUtkast?.tittel ?? '',
      tekst: aktivtUtkast?.tekst ?? '',
    },
  })

  const { handleSubmit, reset, watch } = form

  const tittel = watch('tittel')
  const tekst = watch('tekst')

  const { lagrerUtkast } = useUtkastEndret(NotatType.INTERNT, sakId, tittel, tekst, mutateNotater, aktivtUtkast)
  const { ferdigstill, ferdigstiller, visFerdigstiltToast } = useFerdigstillNotat()

  const lagPayload = (data: NotatFormValues): FerdigstillNotatRequest => {
    return {
      id: aktivtUtkast!.id,
      sakId,
      målform: MålformType.BOKMÅL,
      type: NotatType.INTERNT,
      tittel: data.tittel,
      tekst: data.tekst,
    }
  }

  const resetForm = () => reset({ tittel: '', tekst: '' })

  const ferdigstillInterntNotat = async (data: NotatFormValues) => {
    await ferdigstill(lagPayload(data))
    resetForm()
  }

  const readOnly = lesevisning || ferdigstiller

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(ferdigstillInterntNotat)} name="internt-notat-form">
        {!notaterLaster && (
          <VStack gap="4" paddingBlock="6 0">
            <Alert variant="info" size="small" inline>
              Notatet kan bli utlevert til innbygger ved forespørsel om innsyn
            </Alert>
            <NotatForm readOnly={readOnly} aktivtUtkast={aktivtUtkast} lagrerUtkast={lagrerUtkast} />
          </VStack>
        )}
        {!lesevisning && (
          <HStack justify="end">
            <SlettUtkast sakId={sakId} aktivtUtkast={aktivtUtkast} onReset={resetForm} />
          </HStack>
        )}
        {!lesevisning && (
          <VStack gap="4" paddingBlock="3 0">
            <div>
              <Button variant="secondary" size="small" loading={ferdigstiller} type="submit">
                Opprett internt notat
              </Button>
            </div>
          </VStack>
        )}
        {visFerdigstiltToast && <InfoToast bottomPosition="10px">Notatet er opprettet</InfoToast>}
      </form>
    </FormProvider>
  )
}
