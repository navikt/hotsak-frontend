import '@mdxeditor/editor/style.css'
import { TrashIcon } from '@navikt/aksel-icons'
import { Alert, Button, HStack, TextField, VStack } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import styled from 'styled-components'
import { InfoToast } from '../../../felleskomponenter/Toast.tsx'
import { Brødtekst } from '../../../felleskomponenter/typografi.tsx'
import { ferdigstillNotat } from '../../../io/http.ts'
import { FerdigstillNotatRequest, MålformType, NotatType } from '../../../types/types.internal.ts'
import { BekreftelseModal } from '../../komponenter/BekreftelseModal.tsx'
import { Lagreindikator } from './markdown/Lagreindikator.tsx'
import { MarkdownTextArea } from './markdown/MarkdownTextArea.tsx'
import { useNotater } from './useNotater.tsx'
import { useUtkastEndret } from './useUtkastEndret.ts'

export interface NotaterProps {
  sakId: string
  lesevisning: boolean
}

interface InternNotatFormValues {
  tittel: string
  tekst: string
}

export function InterntNotatForm({ sakId, lesevisning }: NotaterProps) {
  const [sletter, setSletter] = useState(false)

  const { utkast: aktiveUtkast, isLoading: notaterLaster, mutate: mutateNotater } = useNotater(sakId)
  const [ferdigstillerNotat, setFerdigstillerNotat] = useState(false)
  const [visSlettUtkastModal, setVisSlettUtkastModal] = useState(false)
  const [visSlettetUtkastToast, setVisSlettetUtkastToast] = useState(false)
  const [visNotatFerdigstiltToast, setVisFerdigstillerNotatToast] = useState(false)

  const aktivtUtkast = aktiveUtkast.find((u) => u.type === NotatType.INTERNT)

  const defaultValues = {
    tittel: '',
    tekst: '',
  }

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    trigger,
    formState: { errors },
  } = useForm<InternNotatFormValues>({
    defaultValues,
  })

  const tittel = watch('tittel')
  const tekst = watch('tekst')

  const { lagrerUtkast, slettNotatUtkast } = useUtkastEndret(
    NotatType.INTERNT,
    sakId,
    tittel,
    tekst,
    mutateNotater,
    aktivtUtkast
  )

  useEffect(() => {
    if (aktivtUtkast) {
      setValue('tittel', aktivtUtkast.tittel || '')
      setValue('tekst', aktivtUtkast.tekst || '')
    }
  }, [aktivtUtkast, setValue])

  const lagPayload = (data: InternNotatFormValues): FerdigstillNotatRequest => {
    return {
      id: aktivtUtkast!.id,
      sakId,
      målform: MålformType.BOKMÅL,
      type: NotatType.INTERNT,
      tittel: data.tittel,
      tekst: data.tekst,
    }
  }

  const ferdigstillInterntNotat = async (data: InternNotatFormValues) => {
    setFerdigstillerNotat(true)
    await ferdigstillNotat(lagPayload(data))
    mutateNotater()
    setVisFerdigstillerNotatToast(true)
    setTimeout(() => setVisFerdigstillerNotatToast(false), 3000)
    setFerdigstillerNotat(false)
    reset(defaultValues)
  }

  const slettUtkast = async () => {
    if (aktivtUtkast) {
      setSletter(true)
      await slettNotatUtkast(sakId, aktivtUtkast?.id || '')
      setVisSlettUtkastModal(false)
      setVisSlettetUtkastToast(true)

      reset(defaultValues)
      setTimeout(() => {
        setVisSlettetUtkastToast(false)
      }, 5000)
      mutateNotater()
      setSletter(false)
    } else {
      setVisSlettUtkastModal(false)
    }
  }

  const readOnly = lesevisning || ferdigstillerNotat

  return (
    <form onSubmit={handleSubmit(ferdigstillInterntNotat)}>
      {!notaterLaster && (
        <VStack>
          <VStack gap="4" paddingBlock="6 0">
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
                    field.onChange(e), trigger('tekst')
                  }}
                  readOnly={readOnly}
                  valideringsfeil={errors.tekst?.message}
                />
              )}
            />
          </VStack>
          <Lagreindikator lagrerUtkast={lagrerUtkast} sistLagretTidspunkt={aktivtUtkast?.oppdatert} />
        </VStack>
      )}

      {!lesevisning && (
        <ResponsivHStack justify={'space-between'}>
          <div>
            <Alert variant="info" size="small" inline>
              Notatet kan bli utlevert til innbygger ved forespørsel om innsyn
            </Alert>
          </div>
          <div>
            <Button
              icon={<TrashIcon />}
              type="button"
              variant="tertiary"
              size="xsmall"
              onClick={() => {
                setVisSlettUtkastModal(true)
              }}
            >
              Slett utkast
            </Button>
          </div>
        </ResponsivHStack>
      )}

      {!lesevisning && (
        <VStack gap="4" paddingBlock={'3 0'}>
          <div>
            <Button variant="secondary" size="small" loading={ferdigstillerNotat} type="submit">
              Opprett internt notat
            </Button>
          </div>
        </VStack>
      )}

      {visNotatFerdigstiltToast && <InfoToast bottomPosition="10px">Notatet er opprettet</InfoToast>}

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

      {visSlettetUtkastToast && <InfoToast bottomPosition="10px">Utkast slettet</InfoToast>}
    </form>
  )
}

const ResponsivHStack = styled(HStack)`
  // Foreløpig hardkodet px verdi for brekkpunkt. Dette er minste bredde før knappen brekker til ny linje
  // På sikt bør vi lage hele sideoppsett i Hotsak for de ulike brekkpunktene fra Aksel
  @media (max-width: 1730px) {
    order: reverse;
    flex-direction: column-reverse;
    gap: var(--a-spacing-4);
  }
`
