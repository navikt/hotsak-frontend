import '@mdxeditor/editor/style.css'
import { Alert, Button, Checkbox, CheckboxGroup, HStack, Radio, RadioGroup, VStack } from '@navikt/ds-react'
import { useState } from 'react'
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form'

import { Tekst } from '../../felleskomponenter/typografi.tsx'
import { useBrev } from '../../saksbilde/barnebriller/steg/vedtak/brev/useBrev.ts'
import { ForhåndsvisningsModal } from '../../saksbilde/høyrekolonne/brevutsending/ForhåndsvisningModal.tsx'
import { BekreftelseModal } from '../../saksbilde/komponenter/BekreftelseModal.tsx'
import { InfoModal } from '../../saksbilde/komponenter/InfoModal.tsx'
import { useSak } from '../../saksbilde/useSak.ts'
import { Brevtype, MålformType } from '../../types/types.internal.ts'
import { NotatForm } from './NotatForm.tsx'
import { type ForvaltningsnotatFormValues, type Notat, NotatKlassifisering, NotatType } from './notatTyper.ts'
import { SlettUtkast } from './SlettUtkast.tsx'
import { useFerdigstillNotat } from './useFerdigstillNotat.tsx'
import { useNotater } from './useNotater.tsx'
import { useUtkastEndret } from './useUtkastEndret.ts'

export interface ForvaltningsnotatFormProps {
  sakId: string
  aktivtUtkast?: Notat
}

export function ForvaltningsnotatForm({ sakId, aktivtUtkast }: ForvaltningsnotatFormProps) {
  const { sak } = useSak()

  const { mutate: mutateNotater, isLoading: notaterLaster } = useNotater(sakId)
  const [visJournalførNotatModal, setVisJournalførNotatModal] = useState(false)
  const [visUtkastManglerModal, setVisUtkastManglerModal] = useState(false)
  const [visForhåndsvisningsmodal, setVisForhåndsvisningsmodal] = useState(false)
  const { hentForhåndsvisning } = useBrev()
  const { ferdigstill } = useFerdigstillNotat()

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
    reset,
    formState: { isSubmitting, errors },
  } = form

  const tittel = useWatch({ control, name: 'tittel' })
  const tekst = useWatch({ control, name: 'tekst' })
  const klassifisering = useWatch({ control, name: 'klassifisering' })

  const { lagrerUtkast } = useUtkastEndret(
    NotatType.JOURNALFØRT,
    sakId,
    tittel,
    tekst,
    mutateNotater,
    aktivtUtkast,
    klassifisering
  )

  const resetForm = () =>
    reset({
      tittel: '',
      tekst: '',
      klassifisering: null,
      bekreftSynlighet: false,
    })

  const handleSubmit = form.handleSubmit(async (data) => {
    await ferdigstill({
      id: aktivtUtkast!.id,
      sakId,
      målform: MålformType.BOKMÅL,
      type: NotatType.JOURNALFØRT,
      tittel: data.tittel,
      tekst: data.tekst,
      klassifisering: data.klassifisering,
    })
    setVisJournalførNotatModal(false)
    resetForm()
  })

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} name="forvaltningsnotat-form">
        <VStack gap="space-8">
          {!notaterLaster && (
            <VStack gap="space-16">
              <Controller
                name="klassifisering"
                control={control}
                rules={{ required: 'Du må velge en verdi' }}
                render={({ field }) => (
                  <RadioGroup
                    legend="Hvilken type informasjon skal journalføres?"
                    size="small"
                    error={errors.klassifisering?.message}
                    {...field}
                  >
                    <Radio value={NotatKlassifisering.INTERNE_SAKSOPPLYSNINGER}>Interne saksopplysninger</Radio>
                    <Radio value={NotatKlassifisering.EKSTERNE_SAKSOPPLYSNINGER}>Eksterne saksopplysninger</Radio>
                  </RadioGroup>
                )}
              />
              {klassifisering === NotatKlassifisering.EKSTERNE_SAKSOPPLYSNINGER && (
                <Alert variant="info" size="small">
                  Notatet blir journalført. Bruker vil få innsyn i notatet på innlogget side på nav.no fra første
                  virkedag etter at det er ferdigstilt.
                </Alert>
              )}
              {klassifisering === NotatKlassifisering.INTERNE_SAKSOPPLYSNINGER && (
                <Alert variant="info" size="small">
                  Notatet blir journalført. Notatet vil ikke være tilgjengelig på innlogget side på nav.no, men bruker
                  kan be om innsyn i det.
                </Alert>
              )}
              <NotatForm readOnly={isSubmitting} aktivtUtkast={aktivtUtkast} lagrerUtkast={lagrerUtkast} />
            </VStack>
          )}

          <HStack align="center" justify="space-between">
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

          <div>
            <Button
              variant="secondary"
              type="button"
              size="small"
              onClick={() => {
                if (klassifisering === NotatKlassifisering.EKSTERNE_SAKSOPPLYSNINGER) {
                  setVisJournalførNotatModal(true)
                } else {
                  handleSubmit()
                }
              }}
              loading={isSubmitting}
            >
              Journalfør notat
            </Button>
          </div>
        </VStack>

        <BekreftelseModal
          heading="Er du sikker på at du vil journalføre notatet?"
          bekreftButtonLabel="Ja, journalfør notatet"
          reverserKnapperekkefølge={true}
          bekreftButtonVariant="secondary"
          avbrytButtonVariant="primary"
          width="660px"
          open={visJournalførNotatModal}
          loading={isSubmitting}
          onClose={() => setVisJournalførNotatModal(false)}
          onBekreft={handleSubmit}
        >
          <Controller
            name="bekreftSynlighet"
            control={control}
            rules={{
              validate: (value, data) =>
                data.klassifisering !== NotatKlassifisering.EKSTERNE_SAKSOPPLYSNINGER ||
                value ||
                'Du må bekrefte at du er klar over at notatet blir synlig for bruker',
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
                  <Tekst>
                    Jeg er klar over at notatet blir synlig for
                    {sak?.data.bruker.fulltNavn ? <strong>{` ${sak?.data.bruker.fulltNavn} `}</strong> : 'bruker'}
                    på nav.no neste virkedag
                  </Tekst>
                </Checkbox>
              </CheckboxGroup>
            )}
          />
        </BekreftelseModal>

        <InfoModal heading="Ingen utkast" open={visUtkastManglerModal} onClose={() => setVisUtkastManglerModal(false)}>
          <Tekst>Notatet kan ikke forhåndsvises før det er opprettet et utkast</Tekst>
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
