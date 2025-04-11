import '@mdxeditor/editor/style.css'
import { TrashIcon } from '@navikt/aksel-icons'
import { Alert, Button, Checkbox, CheckboxGroup, HStack, TextField, VStack } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { InfoToast } from '../../../felleskomponenter/Toast.tsx'
import { Brødtekst } from '../../../felleskomponenter/typografi.tsx'
import { ferdigstillNotat, slettNotatUtkast } from '../../../io/http.ts'
import { Brevtype, FerdigstillNotatRequest, MålformType, NotatType } from '../../../types/types.internal.ts'
import { useBrev } from '../../barnebriller/steg/vedtak/brev/useBrev.ts'
import { BekreftelseModal } from '../../komponenter/BekreftelseModal.tsx'
import { InfoModal } from '../../komponenter/InfoModal.tsx'
import { useSak } from '../../useSak.ts'
import { ForhåndsvisningsModal } from '../brevutsending/ForhåndsvisningModal.tsx'
import { MarkdownTextArea } from './markdown/MarkdownTextArea.tsx'
import { useNotater } from './useNotater.tsx'
import { useUtkastEndret } from './useUtkastEndret.ts'

export interface NotaterProps {
  sakId: string
  lesevisning: boolean
}

export function JournalførtNotatForm({ sakId, lesevisning }: NotaterProps) {
  const [sletter, setSletter] = useState(false)
  const { sak } = useSak()

  const { mutate: mutateNotatTeller } = useNotater(sakId)
  const [journalførerNotat, setJournalførerNotat] = useState(false)
  const { utkast: aktiveUtkast, isLoading: notaterLaster, mutate: mutateNotater } = useNotater(sakId)
  const [visSlettUtkastModal, setVisSlettUtkastModal] = useState(false)
  const [visSlettetUtkastToast, setVisSlettetUtkastToast] = useState(false)
  const [visJournalførNotatModal, setVisJournalførNotatModal] = useState(false)
  const [visUtkastManglerModal, setVisUtkastManglerModal] = useState(false)
  const [visNotatJournalførtToast, setVisNotatJournalførtToast] = useState(false)
  const [visForhåndsvisningsmodal, setVisForhåndsvisningsmodal] = useState(false)
  const [aktivtUtkastHentet, setAktivtUtkastHentet] = useState(false)
  const { hentForhåndsvisning } = useBrev()

  const aktivtUtkast = aktiveUtkast.find((u) => u.type === NotatType.JOURNALFØRT)

  const defaultValues = {
    tittel: '',
    tekst: '',
    bekreftSynlighet: false,
  }

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues,
  })

  const tittel = watch('tittel')
  const tekst = watch('tekst')

  const { lagrerUtkast } = useUtkastEndret(NotatType.JOURNALFØRT, sakId, tittel, tekst, mutateNotater, aktivtUtkast)

  useEffect(() => {
    if (aktivtUtkast && !aktivtUtkastHentet) {
      setValue('tittel', aktivtUtkast.tittel || '')
      setValue('tekst', aktivtUtkast.tekst || '')
      setAktivtUtkastHentet(true)
    }
  }, [aktivtUtkast, aktivtUtkastHentet, setValue])

  const lagPayload = (): FerdigstillNotatRequest => {
    return {
      id: aktivtUtkast!.id,
      sakId,
      målform: MålformType.BOKMÅL,
      type: NotatType.JOURNALFØRT,
      tittel: tittel,
      tekst: tekst,
    }
  }

  const journalførNotat = async () => {
    setJournalførerNotat(true)
    await ferdigstillNotat(lagPayload())
    mutateNotater()
    mutateNotatTeller()
    setVisNotatJournalførtToast(true)
    setJournalførerNotat(false)
    setVisJournalførNotatModal(false)
    setTimeout(() => setVisNotatJournalførtToast(false), 3000)
  }

  const slettUtkast = async () => {
    if (aktivtUtkast) {
      setSletter(true)
      await slettNotatUtkast(sakId, aktivtUtkast.id)
      await mutateNotater()
      mutateNotatTeller()
      setVisSlettetUtkastToast(true)

      reset(defaultValues)

      setTimeout(() => {
        setVisSlettetUtkastToast(false)
      }, 5000)
      setSletter(false)
    }
    setVisSlettUtkastModal(false)
  }

  const onSubmit = (data: any) => {
    console.log('submitting data', data)
    journalførNotat()
    reset(defaultValues)
  }

  const readOnly = lesevisning || journalførerNotat

  // TODO Se hvordan vi kan dette felles for begge formsene
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {!notaterLaster && (
        <VStack gap="4" paddingBlock="6 0">
          <Alert variant="info" size="small">
            Notatet blir journalført og tilgjengelig for bruker på nav.no virkedagen etter at det er ferdigstilt.
          </Alert>
          <Controller
            name="tittel"
            control={control}
            rules={{ required: 'Du må skrive en tittel' }}
            render={({ field }) => (
              <TextField
                size="small"
                label="Tittel"
                error={errors.tittel?.message}
                readOnly={readOnly}
                value={field.value}
                onChange={(e) => {
                  field.onChange(e)
                  trigger('tittel')
                }}
              />
            )}
          />
          <Controller
            name="tekst"
            control={control}
            rules={{ required: 'Du må skrive en tekst' }}
            render={({ field }) => (
              <MarkdownTextArea
                label="Notat"
                tekst={field.value}
                onChange={(e) => {
                  field.onChange(e)
                  trigger('tekst')
                }}
                readOnly={readOnly}
                lagrer={lagrerUtkast}
                valideringsfeil={errors.tekst?.message}
              />
            )}
          />
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

          <Button
            icon={<TrashIcon />}
            variant="tertiary"
            size="xsmall"
            onClick={() => {
              setVisSlettUtkastModal(true)
            }}
          >
            Slett utkast
          </Button>
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
                const isValid = await trigger(['tittel', 'tekst'])
                if (isValid) {
                  setVisJournalførNotatModal(true)
                }
              }}
            >
              Journalfør notat
            </Button>
          </div>
        </VStack>
      )}

      {visNotatJournalførtToast && <InfoToast bottomPosition="10px">Notatet er journalført.</InfoToast>}
      {visSlettetUtkastToast && <InfoToast bottomPosition="10px">Utkast slettet</InfoToast>}

      <BekreftelseModal
        heading="Er du sikker på at du vil slette utkastet?"
        bekreftButtonLabel="Ja, slett utkastet"
        avbrytButtonLabel="Nei, behold utkastet"
        bekreftButtonVariant="secondary"
        avbrytButtonVariant="primary"
        reverserKnapperekkefølge={true}
        open={visSlettUtkastModal}
        loading={sletter}
        onClose={() => setVisSlettUtkastModal(false)}
        onBekreft={slettUtkast}
      >
        <Brødtekst>Utkastet til notat vil forsvinne, og kan ikke gjenopprettes.</Brødtekst>
      </BekreftelseModal>

      <BekreftelseModal
        heading="Er du sikker på at du vil journalføre notatet?"
        bekreftButtonLabel="Ja, journalfør notatet"
        reverserKnapperekkefølge={true}
        bekreftButtonVariant="secondary"
        avbrytButtonVariant="primary"
        width={'660px'}
        open={visJournalførNotatModal}
        loading={journalførerNotat}
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
  )
}
