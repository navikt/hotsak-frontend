import '@mdxeditor/editor/style.css'
import { Alert, Button, Checkbox, CheckboxGroup, HStack, Radio, RadioGroup, VStack } from '@navikt/ds-react'
import { useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'

import { InfoToast } from '../../../felleskomponenter/Toast.tsx'
import { Brødtekst } from '../../../felleskomponenter/typografi.tsx'
import {
  Brevtype,
  FerdigstillNotatRequest,
  MålformType,
  Notat,
  NotatKlassifisering,
  NotatType,
} from '../../../types/types.internal.ts'
import { useBrev } from '../../barnebriller/steg/vedtak/brev/useBrev.ts'
import { BekreftelseModal } from '../../komponenter/BekreftelseModal.tsx'
import { InfoModal } from '../../komponenter/InfoModal.tsx'
import { useSak } from '../../useSak.ts'
import { ForhåndsvisningsModal } from '../brevutsending/ForhåndsvisningModal.tsx'
import type { NotatFormValues } from './Notater.tsx'
import { NotatForm } from './NotatForm.tsx'
import { SlettUtkast } from './SlettUtkast.tsx'
import { useFerdigstillNotat } from './useFerdigstillNotat.tsx'
import { useNotater } from './useNotater.tsx'
import { useUtkastEndret } from './useUtkastEndret.ts'

export interface ForvaltningsnotatFormValues extends NotatFormValues {
  klassifisering?: NotatKlassifisering | null
  bekreftSynlighet: boolean
}

export interface ForvaltningsnotatFormProps {
  sakId: string
  lesevisning: boolean
  aktivtUtkast?: Notat
}

export function ForvaltningsnotatForm({ sakId, lesevisning, aktivtUtkast }: ForvaltningsnotatFormProps) {
  const { sak } = useSak()

  const { mutate: mutateNotater, isLoading: notaterLaster } = useNotater(sakId)
  const [visJournalførNotatModal, setVisJournalførNotatModal] = useState(false)
  const [visUtkastManglerModal, setVisUtkastManglerModal] = useState(false)
  const [visForhåndsvisningsmodal, setVisForhåndsvisningsmodal] = useState(false)
  const { hentForhåndsvisning } = useBrev()
  const { ferdigstill, ferdigstiller, visFerdigstiltToast } = useFerdigstillNotat()

  const form = useForm<ForvaltningsnotatFormValues>({
    defaultValues: {
      tittel: aktivtUtkast?.tittel ?? '',
      tekst: aktivtUtkast?.tekst ?? '',
      klassifisering: aktivtUtkast?.klassifisering ?? null,
      bekreftSynlighet: false,
    },
  })

  const {
    control,
    handleSubmit,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = form

  const tittel = watch('tittel')
  const tekst = watch('tekst')
  const klassifisering = watch('klassifisering')

  const { lagrerUtkast } = useUtkastEndret(
    NotatType.JOURNALFØRT,
    sakId,
    tittel,
    tekst,
    mutateNotater,
    aktivtUtkast,
    klassifisering
  )

  const lagPayload = (): FerdigstillNotatRequest => {
    return {
      id: aktivtUtkast!.id,
      sakId,
      målform: MålformType.BOKMÅL,
      type: NotatType.JOURNALFØRT,
      tittel,
      tekst,
      klassifisering,
    }
  }

  const resetForm = () =>
    reset({
      tittel: '',
      tekst: '',
      klassifisering: null,
      bekreftSynlighet: false,
    })

  const onSubmit = async () => {
    await ferdigstill(lagPayload())
    setVisJournalførNotatModal(false)
    resetForm()
  }

  const readOnly = lesevisning || ferdigstiller

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} name="forvaltningsnotat-form">
        {!notaterLaster && (
          <VStack gap="4" paddingBlock="6 0">
            <Controller
              name="klassifisering"
              control={control}
              rules={{ required: 'Du må velge en verdi' }}
              render={({ field }) => (
                <RadioGroup
                  legend="Hvilken type informasjon skal journalføres?"
                  size="small"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e)
                    trigger('klassifisering')
                  }}
                  error={errors.klassifisering?.message}
                >
                  <Radio value={NotatKlassifisering.INTERNE_SAKSOPPLYSNINGER}>Interne saksopplysninger</Radio>
                  <Radio value={NotatKlassifisering.EKSTERNE_SAKSOPPLYSNINGER}>Eksterne saksopplysninger</Radio>
                </RadioGroup>
              )}
            />

            {klassifisering === NotatKlassifisering.EKSTERNE_SAKSOPPLYSNINGER && (
              <Alert variant="info" size="small">
                Notatet blir journalført. Bruker vil få innsyn i notatet på innlogget side på nav.no fra første virkedag
                etter at det er ferdigstilt.
              </Alert>
            )}
            {klassifisering === NotatKlassifisering.INTERNE_SAKSOPPLYSNINGER && (
              <Alert variant="info" size="small">
                Notatet blir journalført. Notatet vil ikke være tilgjengelig på innlogget side på nav.no, men bruker kan
                be om innsyn i det.
              </Alert>
            )}
            <NotatForm readOnly={readOnly} aktivtUtkast={aktivtUtkast} lagrerUtkast={lagrerUtkast} />
          </VStack>
        )}

        {!lesevisning && (
          <HStack justify="space-between" paddingBlock={'1-alt 0'}>
            <Button
              type="button"
              size="xsmall"
              variant="tertiary"
              onClick={() => {
                if (aktivtUtkast?.id) {
                  hentForhåndsvisning(sakId, Brevtype.JOURNALFØRT_NOTAT, aktivtUtkast?.id)
                  setVisForhåndsvisningsmodal(true)
                } else {
                  setVisUtkastManglerModal(true)
                }
              }}
            >
              Forhåndsvis dokument
            </Button>
            <SlettUtkast sakId={sakId} aktivtUtkast={aktivtUtkast} onReset={resetForm} />
          </HStack>
        )}

        {!lesevisning && (
          <VStack paddingBlock={'3 0'}>
            <div>
              <Button
                variant="secondary"
                type="button"
                size="small"
                onClick={async () => {
                  const isValid = await trigger(['tittel', 'tekst', 'klassifisering'])
                  if (isValid) {
                    if (klassifisering === NotatKlassifisering.EKSTERNE_SAKSOPPLYSNINGER) {
                      setVisJournalførNotatModal(true)
                    } else {
                      onSubmit()
                    }
                  }
                }}
                loading={false}
              >
                Journalfør notat
              </Button>
            </div>
          </VStack>
        )}

        {visFerdigstiltToast && <InfoToast bottomPosition="10px">Notatet er journalført.</InfoToast>}

        <BekreftelseModal
          heading="Er du sikker på at du vil journalføre notatet?"
          bekreftButtonLabel="Ja, journalfør notatet"
          reverserKnapperekkefølge={true}
          bekreftButtonVariant="secondary"
          avbrytButtonVariant="primary"
          width={'660px'}
          open={visJournalførNotatModal}
          loading={ferdigstiller}
          onClose={() => setVisJournalførNotatModal(false)}
          onBekreft={handleSubmit(onSubmit)}
        >
          <Controller
            name="bekreftSynlighet"
            control={control}
            rules={{
              validate: (value) => value || 'Du må bekrefte at du er klar over at notatet blir synlig for bruker',
            }}
            render={({ field }) => (
              <CheckboxGroup
                size="small"
                hideLegend={true}
                value={field.value ? ['bekreft'] : []}
                legend="Bekreft synlighet"
                error={errors.bekreftSynlighet?.message}
              >
                <Checkbox value="bekreft" size="small" onChange={(e) => field.onChange(e.target.checked)}>
                  <Brødtekst>
                    Jeg er klar over at notatet blir synlig for
                    {sak?.data.bruker.fulltNavn ? <strong>{` ${sak?.data.bruker.fulltNavn} `}</strong> : 'bruker'}
                    på nav.no neste virkedag
                  </Brødtekst>
                </Checkbox>
              </CheckboxGroup>
            )}
          />
        </BekreftelseModal>

        <InfoModal heading="Ingen utkast" open={visUtkastManglerModal} onClose={() => setVisUtkastManglerModal(false)}>
          <Brødtekst>Notatet kan ikke forhåndsvises før det er opprettet et utkast</Brødtekst>
        </InfoModal>
        <ForhåndsvisningsModal
          open={visForhåndsvisningsmodal}
          sakId={sakId}
          brevtype={Brevtype.JOURNALFØRT_NOTAT}
          onClose={() => {
            setVisForhåndsvisningsmodal(false)
          }}
        />
      </form>
    </FormProvider>
  )
}
