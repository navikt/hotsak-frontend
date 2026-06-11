import { Alert, Button, Checkbox, CheckboxGroup, HStack, Radio, RadioGroup, VStack } from '@navikt/ds-react'
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form'

import { Målform } from '../../brev/brevTyper.ts'
import { Tekst } from '../../felleskomponenter/typografi.tsx'
import { BekreftelsesDialog } from '../../saksbilde/komponenter/BekreftelsesDialog.tsx'
import { useSak } from '../../saksbilde/useSak.ts'
import { useDialogToggle, useToggle } from '../../state/useToggle.ts'
import { MålformType } from '../../types/types.internal.ts'
import { ForhåndsvisningModal } from './ForhåndsvisningModal.tsx'
import { NotatForm } from './NotatForm.tsx'
import { type ForvaltningsnotatFormValues, type Notat, NotatKlassifisering, NotatType } from './notatTyper.ts'
import { SlettNotatUtkast } from './SlettNotatUtkast.tsx'
import { useNotat } from './useNotat.ts'

export interface ForvaltningsnotatFormProps {
  sakId: string
  gjeldendeUtkast: Notat
}

export function ForvaltningsnotatForm({ sakId, gjeldendeUtkast }: ForvaltningsnotatFormProps) {
  const { sak } = useSak()

  const forhåndsvisningModalProps = useDialogToggle()
  const [visJournalførNotatModal, toggleVisJournalførNotatModal] = useToggle()
  const { oppdaterNotat, forhåndsvisNotat, slettNotatUtkast, ferdigstillNotat } = useNotat(sakId, gjeldendeUtkast.id)

  const form = useForm<ForvaltningsnotatFormValues>({
    defaultValues: {
      tittel: gjeldendeUtkast.tittel ?? '',
      tekst: gjeldendeUtkast.tekst ?? '',
      klassifisering: gjeldendeUtkast.klassifisering ?? null,
      bekreftSynlighet: false,
    },
  })

  const {
    getValues,
    control,
    reset,
    formState: { isSubmitting, errors },
  } = form

  // const tittel = useWatch({ control, name: 'tittel' })
  // const tekst = useWatch({ control, name: 'tekst' })
  const klassifisering = useWatch({ control, name: 'klassifisering' })

  const resetForm = () =>
    reset({
      tittel: '',
      tekst: '',
      klassifisering: null,
      bekreftSynlighet: false,
    })

  const handleSubmit = form.handleSubmit(async (data) => {
    await ferdigstillNotat.trigger({
      type: NotatType.JOURNALFØRT,
      tittel: data.tittel,
      tekst: data.tekst,
      målform: MålformType.BOKMÅL,
      klassifisering: data.klassifisering,
    })
    toggleVisJournalførNotatModal(false)
    resetForm()
  })

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} name="forvaltningsnotat-form">
        <VStack gap="space-8">
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
              <Alert variant="info" size="small" inline>
                Notatet blir journalført. Bruker vil få innsyn i notatet på innlogget side på nav.no fra første virkedag
                etter at det er ferdigstilt.
              </Alert>
            )}
            {klassifisering === NotatKlassifisering.INTERNE_SAKSOPPLYSNINGER && (
              <Alert variant="info" size="small" inline>
                Notatet blir journalført. Notatet vil ikke være tilgjengelig på innlogget side på nav.no, men bruker kan
                be om innsyn i det.
              </Alert>
            )}
            <NotatForm readOnly={isSubmitting} gjeldendeUtkast={gjeldendeUtkast} lagrerUtkast={false} />
          </VStack>

          <HStack align="center" justify="space-between">
            <Button
              type="button"
              size="xsmall"
              variant="tertiary"
              onClick={async () => {
                const values = getValues()
                await oppdaterNotat.trigger({
                  type: NotatType.JOURNALFØRT,
                  tittel: values.tittel ?? '',
                  tekst: values.tekst ?? '',
                  målform: Målform.BOKMÅL,
                  klassifisering: values.klassifisering || null,
                })
                await forhåndsvisNotat.trigger()
                forhåndsvisningModalProps.onOpenChange(true)
              }}
            >
              Forhåndsvis dokument
            </Button>
            <SlettNotatUtkast slettNotatUtkast={slettNotatUtkast} onReset={resetForm} />
          </HStack>

          <div>
            <Button
              variant="secondary"
              type="button"
              size="small"
              onClick={() => {
                if (klassifisering === NotatKlassifisering.EKSTERNE_SAKSOPPLYSNINGER) {
                  toggleVisJournalførNotatModal()
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

        <ForhåndsvisningModal data={forhåndsvisNotat.data} {...forhåndsvisningModalProps} />

        <BekreftelsesDialog
          heading="Er du sikker på at du vil journalføre notatet?"
          bekreftButtonLabel="Ja, journalfør notatet"
          reverserKnapperekkefølge={true}
          bekreftButtonVariant="secondary"
          avbrytButtonVariant="primary"
          width="660px"
          open={visJournalførNotatModal}
          loading={isSubmitting}
          onClose={toggleVisJournalførNotatModal}
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
        </BekreftelsesDialog>
      </form>
    </FormProvider>
  )
}
