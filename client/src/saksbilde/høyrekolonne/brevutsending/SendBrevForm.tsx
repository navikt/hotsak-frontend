import { TrashIcon } from '@navikt/aksel-icons'
import { Button, HStack, Radio, RadioGroup, Select, VStack } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { useController, useForm, useWatch } from 'react-hook-form'

import { isBrevmal, isBrevstatusUtkast } from '../../../brev/brevSelectors'
import { Brevmal, Målform, type Brevutkast } from '../../../brev/brevTyper'
import { useBrevForSak } from '../../../brev/useBrev'
import { useBrevActions } from '../../../brev/useBrevActions'
import { Fritekst } from '../../../felleskomponenter/brev/Fritekst'
import { ForhåndsvisDokumentModal } from '../../../felleskomponenter/dokument/ForhåndsvisDokumentModal'
import { useDebouncedWatch } from '../../../felleskomponenter/skjema/useDebouncedWatch'
import { useToast } from '../../../felleskomponenter/toast/useToast'
import { Tekst } from '../../../felleskomponenter/typografi'
import { type Saksbehandlingsoppgave } from '../../../oppgave/oppgaveTypes'
import { mutateOppgave } from '../../../oppgave/useOppgave'
import { mutateSak } from '../../../sak/useSak'
import { useSaksdokumenter } from '../../barnebriller/useSaksdokumenter'
import { BekreftelsesDialog } from '../../komponenter/BekreftelsesDialog'

export interface SendBrevFormProps {
  oppgave: Saksbehandlingsoppgave
}

export function SendBrevForm(props: SendBrevFormProps) {
  const { oppgave } = props
  const { getValues, reset, handleSubmit, control } = useForm<SendBrevFormValues>({
    defaultValues: {
      brevmal: Brevmal.BARNEBRILLER_INNHENTE_OPPLYSNINGER,
      målform: Målform.BOKMÅL,
      brevtekst: '',
    },
  })

  const brevmal = useWatch({ name: 'brevmal', control })
  const målform = useWatch({ name: 'målform', control })
  const brevtekst = useDebouncedWatch({ name: 'brevtekst', control }, 1_000)

  const { finnBrev } = useBrevForSak(oppgave.sakId)
  const brevutkast = finnBrev<{ brevtekst?: string }>(isBrevmal(brevmal), isBrevstatusUtkast)
  const { opprettBrevutkast, oppdaterBrevutkast, slettBrevutkast, forhåndsvisBrev, ferdigstillBrevutkast } =
    useBrevActions(oppgave, brevutkast?.brevId)

  const {
    brevmal: lagretBrevmal,
    målform: lagretMålform,
    data: { brevtekst: lagretBrevtekst = '' },
  } = brevutkast ?? { data: {} }
  useEffect(() => {
    if (lagretBrevmal || lagretMålform || lagretBrevtekst) {
      reset(
        {
          brevmal: lagretBrevmal,
          målform: lagretMålform,
          brevtekst: lagretBrevtekst,
        },
        { keepDirtyValues: true }
      )
    }
  }, [lagretBrevmal, lagretMålform, lagretBrevtekst, reset])

  const [visForhåndsvisningsmodal, setVisForhåndsvisningsmodal] = useState(false)
  const [visSendBrevModal, setVisSendBrevModal] = useState(false)
  const [visSlettUtkastModal, setVisSlettUtkastModal] = useState(false)

  const brevmalController = useController({ name: 'brevmal', control })
  const målformController = useController({ name: 'målform', control })
  const brevtekstController = useController({
    name: 'brevtekst',
    control,
    rules: {
      required: brevutkast ? 'Du kan ikke sende brevet uten å ha lagt til tekst' : false,
    },
  })

  const { showSuccessToast } = useToast()
  const { mutate: mutateSaksdokumenter } = useSaksdokumenter(oppgave.sakId)

  const handleOpprettBrevutkast = handleSubmit(async (values) => {
    await opprettBrevutkast.trigger(lagRequest(values))
    showSuccessToast('Brevutkast opprettet.')
  })

  const oppdaterBrevutkastTrigger = oppdaterBrevutkast.trigger
  const handleUpdateBrevutkast = async (values: SendBrevFormValues) => {
    if (!brevutkast?.brevId) return
    await oppdaterBrevutkastTrigger(lagRequest(values))
  }

  useEffect(() => {
    if (!brevutkast?.brevId) return
    if (målform || brevtekst) {
      oppdaterBrevutkastTrigger(lagRequest(getValues()))
    }
  }, [brevutkast?.brevId, målform, brevtekst, getValues, oppdaterBrevutkastTrigger])

  const handleForhåndsvisBrev = async () => {
    if (!brevutkast?.brevId) return
    await handleUpdateBrevutkast(getValues())
    await forhåndsvisBrev.trigger()
    setVisForhåndsvisningsmodal(true)
  }

  const handleSendBrev = handleSubmit(async (values) => {
    if (!brevutkast?.brevId) return
    await handleUpdateBrevutkast(values)
    await ferdigstillBrevutkast.trigger()
    setVisSendBrevModal(false)
    // todo -> sjekk om alle disse mutatene fremdeles trengs
    await Promise.all([mutateOppgave(oppgave.oppgaveId), mutateSak(oppgave.sakId), mutateSaksdokumenter()])
    setTimeout(() => {
      mutateSaksdokumenter()
    }, 3_000)
    showSuccessToast('Brevet er sendt. Det kan ta litt tid før det dukker opp i listen over.')
  })

  const handleSlettBrevutkast = async () => {
    if (!brevutkast?.brevId) return
    await slettBrevutkast.trigger()
    setVisSlettUtkastModal(false)
  }

  return (
    <>
      <form>
        <VStack gap="space-16">
          <Select
            size="small"
            label="Velg brevmal"
            readOnly={brevutkast != null}
            error={brevmalController.fieldState.error?.message}
            {...brevmalController.field}
          >
            <option value={Brevmal.BARNEBRILLER_INNHENTE_OPPLYSNINGER}>Innhente opplysninger</option>
          </Select>
          {!brevutkast && (
            <div>
              <Button
                size="small"
                type="button"
                loading={opprettBrevutkast.isMutating}
                onClick={handleOpprettBrevutkast}
              >
                Opprett brevutkast
              </Button>
            </div>
          )}
          {brevutkast && (
            <>
              <RadioGroup
                legend="Målform"
                size="small"
                error={målformController.fieldState.error?.message}
                {...målformController.field}
              >
                <Radio value={Målform.BOKMÅL}>Bokmål</Radio>
                <Radio value={Målform.NYNORSK}>Nynorsk</Radio>
              </RadioGroup>
              <Fritekst
                label="Fritekst"
                description="Beskriv hva som mangler av dokumentasjon"
                loading={false}
                error={brevtekstController.fieldState.error?.message}
                {...brevtekstController.field}
              />
              <HStack gap="space-8">
                <Button type="button" size="small" variant="secondary" onClick={handleForhåndsvisBrev}>
                  Forhåndsvis
                </Button>
                <Button type="button" size="small" variant="primary" onClick={() => setVisSendBrevModal(true)}>
                  Send brev
                </Button>
                <Button
                  type="button"
                  size="small"
                  variant="secondary"
                  data-color="danger"
                  icon={<TrashIcon />}
                  onClick={() => setVisSlettUtkastModal(true)}
                >
                  Slett brevutkast
                </Button>
              </HStack>
            </>
          )}
        </VStack>
      </form>

      <ForhåndsvisDokumentModal
        data={forhåndsvisBrev.data}
        open={visForhåndsvisningsmodal}
        onOpenChange={setVisForhåndsvisningsmodal}
      />

      <BekreftelsesDialog
        heading="Vil du sende brevet?"
        bekreftButtonLabel="Send brev"
        loading={ferdigstillBrevutkast.isMutating}
        open={visSendBrevModal}
        onClose={setVisSendBrevModal}
        onBekreft={handleSendBrev}
      >
        <Tekst>Brevet sendes til adressen til barnet, og saken settes på vent.</Tekst>
      </BekreftelsesDialog>

      <BekreftelsesDialog
        heading="Vil du slette brevutkastet?"
        bekreftButtonLabel="Slett brevutkast"
        bekreftButtonVariant="danger"
        loading={slettBrevutkast.isMutating}
        open={visSlettUtkastModal}
        onClose={setVisSlettUtkastModal}
        onBekreft={handleSlettBrevutkast}
      />
    </>
  )
}

interface SendBrevFormValues {
  brevmal: Brevmal
  målform: Målform
  brevtekst: string
}

function lagRequest(values: SendBrevFormValues): { brevutkast: Brevutkast<{ brevtekst: string }> } {
  return {
    brevutkast: {
      brevmal: values.brevmal,
      brevmalVersjon: '0',
      målform: values.målform,
      data: { brevtekst: values.brevtekst },
    },
  }
}
