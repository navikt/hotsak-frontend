import '@mdxeditor/editor/style.css'
import { Alert, Button, HStack, VStack } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { InfoToast } from '../../../felleskomponenter/Toast.tsx'
import { FerdigstillNotatRequest, MålformType, NotatType } from '../../../types/types.internal.ts'
import { NotatFormValues } from './Notater.tsx'
import { NotatForm } from './NotatForm.tsx'
import { SlettUtkast } from './SlettUtkast.tsx'
import { useNotater } from './useNotater.tsx'
import { useUtkastEndret } from './useUtkastEndret.ts'
import { useFerdigstillNotat } from './useFerdigstillNotat.tsx'

export interface NotaterProps {
  sakId: string
  lesevisning: boolean
}

export function InterntNotatForm({ sakId, lesevisning }: NotaterProps) {
  const { finnAktivtUtkast, isLoading: notaterLaster, mutate: mutateNotater } = useNotater(sakId)
  const [aktivtUtkastHentet, setAktivtUtkastHentet] = useState(false)

  const aktivtUtkast = finnAktivtUtkast(NotatType.INTERNT)

  const defaultValues = {
    tittel: '',
    tekst: '',
  }

  const form = useForm<NotatFormValues>({ defaultValues })
  const { handleSubmit, setValue, reset, watch } = form

  const tittel = watch('tittel')
  const tekst = watch('tekst')

  const { lagrerUtkast } = useUtkastEndret(NotatType.INTERNT, sakId, tittel, tekst, mutateNotater, aktivtUtkast)
  const { ferdigstill, ferdigstiller, visFerdigstiltToast } = useFerdigstillNotat()
  useEffect(() => {
    if (aktivtUtkast && !aktivtUtkastHentet) {
      setValue('tittel', aktivtUtkast.tittel)
      setValue('tekst', aktivtUtkast.tekst)
      setAktivtUtkastHentet(true)
    }
  }, [aktivtUtkast, tittel, tekst, setValue])

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

  const ferdigstillInterntNotat = async (data: NotatFormValues) => {
    await ferdigstill(lagPayload(data), () => {
      reset(defaultValues)
    })
  }

  const readOnly = lesevisning || ferdigstiller

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(ferdigstillInterntNotat)}>
        {!notaterLaster && (
          <VStack gap="4" paddingBlock="6 0">
            <Alert variant="info" size="small" inline>
              Notatet kan bli utlevert til innbygger ved forespørsel om innsyn
            </Alert>
            <NotatForm readOnly={readOnly} aktivtUtkast={aktivtUtkast} lagrerUtkast={lagrerUtkast} />
          </VStack>
        )}
        {!lesevisning && (
          <HStack justify={'end'}>
            <SlettUtkast sakId={sakId} aktivtUtkast={aktivtUtkast} onReset={() => reset(defaultValues)} />
          </HStack>
        )}
        {!lesevisning && (
          <VStack gap="4" paddingBlock={'3 0'}>
            <div>
              <Button variant="secondary" size="small" loading={visFerdigstiltToast} type="submit">
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
