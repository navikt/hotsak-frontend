import { TrashIcon } from '@navikt/aksel-icons'
import { Button, HStack, Radio, RadioGroup, Select, VStack } from '@navikt/ds-react'
import { useState } from 'react'
import { useController, useForm, useWatch } from 'react-hook-form'

import { isBrevmal, isBrevstatusUtkast } from '../../../brev/brevSelectors'
import { Brevmal, Målform } from '../../../brev/brevTyper'
import { useBrevForSak } from '../../../brev/useBrev'
import { useBrevActions } from '../../../brev/useBrevActions'
import { Fritekst } from '../../../felleskomponenter/brev/Fritekst'
import { useToast } from '../../../felleskomponenter/toast/useToast'
import { Tekst } from '../../../felleskomponenter/typografi'
import { type Saksbehandlingsoppgave } from '../../../oppgave/oppgaveTypes'
import { mutateOppgave } from '../../../oppgave/useOppgave'
import { mutateSak } from '../../../sak/useSak'
import { useSaksdokumenter } from '../../barnebriller/useSaksdokumenter'
import { BekreftelsesDialog } from '../../komponenter/BekreftelsesDialog'
import { ForhåndsvisningModal } from './ForhåndsvisningModal'

export interface SendBrevFormProps {
  oppgave: Saksbehandlingsoppgave
}

export function SendBrevForm(props: SendBrevFormProps) {
  const { oppgave } = props
  const { handleSubmit, control } = useForm({
    defaultValues: {
      brevmal: Brevmal.BARNEBRILLER_INNHENTE_OPPLYSNINGER,
      målform: Målform.BOKMÅL,
      brevtekst: '',
    },
  })

  const brevmal = useWatch({ name: 'brevmal', control })
  const { finnBrev } = useBrevForSak(oppgave.sakId)
  const brevutkast = finnBrev(isBrevmal(brevmal), isBrevstatusUtkast)
  const { opprettBrevutkast, oppdaterBrevutkast, slettBrevutkast, ferdigstillBrevutkast } = useBrevActions(
    oppgave,
    brevutkast?.brevId
  )

  const [visForhåndsvisningsmodal, setVisForhåndsvisningsmodal] = useState(false)
  const [visSlettUtkastModal, setVisSlettUtkastModal] = useState(false)
  const [visSendBrevModal, setVisSendBrevModal] = useState(false)

  const brevmalController = useController({ name: 'brevmal', control })
  const målformController = useController({ name: 'målform', control })
  const brevtekstController = useController({ name: 'brevtekst', control })

  const { showSuccessToast } = useToast()
  const { mutate: mutateSaksdokumenter } = useSaksdokumenter(oppgave.sakId)

  const handleOpprettBrevutkast = handleSubmit(async (values) => {
    await opprettBrevutkast.trigger({
      brevutkast: {
        brevmal: values.brevmal,
        brevmalVersjon: '0',
        målform: values.målform,
        data: { brevtekst: values.brevtekst },
      },
    })
    showSuccessToast('Brevutkast opprettet.')
  })

  const handleSendBrev = handleSubmit(async (values) => {
    if (!brevutkast) return
    await oppdaterBrevutkast.trigger({
      brevutkast: {
        brevmal: values.brevmal,
        brevmalVersjon: '0',
        målform: values.målform,
        data: { brevtekst: values.brevtekst },
      },
    })
    await ferdigstillBrevutkast.trigger()
    setVisSendBrevModal(false)
    await Promise.all([mutateOppgave(oppgave.oppgaveId), mutateSak(oppgave.sakId), mutateSaksdokumenter()])
    setTimeout(() => {
      mutateSaksdokumenter()
    }, 3_000)
    showSuccessToast('Brevet er sendt. Det kan ta litt tid før det dukker opp i listen over.')
  })

  // todo -> validering 'Du kan ikke sende brevet uten å ha lagt til tekst'

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
                loading={oppdaterBrevutkast.isMutating}
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
                <Button type="button" size="small" variant="tertiary" onClick={() => setVisForhåndsvisningsmodal(true)}>
                  Forhåndsvis
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
                <Button type="button" size="small" variant="primary" onClick={() => setVisSendBrevModal(true)}>
                  Send brev
                </Button>
              </HStack>
            </>
          )}
        </VStack>
      </form>

      <ForhåndsvisningModal
        brevId={brevutkast?.brevId}
        open={visForhåndsvisningsmodal}
        onClose={() => setVisForhåndsvisningsmodal(false)}
      />

      <BekreftelsesDialog
        heading="Vil du slette brevutkastet?"
        bekreftButtonLabel="Slett brevutkast"
        bekreftButtonVariant="danger"
        open={visSlettUtkastModal}
        loading={slettBrevutkast.isMutating}
        onClose={() => setVisSlettUtkastModal(false)}
        onBekreft={async () => {
          await slettBrevutkast.trigger()
          setVisSlettUtkastModal(false)
          showSuccessToast('Brevutkast slettet')
        }}
      />

      <BekreftelsesDialog
        heading="Vil du sende brevet?"
        bekreftButtonLabel="Send brev"
        open={visSendBrevModal}
        loading={ferdigstillBrevutkast.isMutating}
        onClose={() => setVisSendBrevModal(false)}
        onBekreft={handleSendBrev}
      >
        <Tekst>Brevet sendes til adressen til barnet, og saken settes på vent.</Tekst>
      </BekreftelsesDialog>
    </>
  )
}
