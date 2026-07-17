import { Button, Detail, HStack, VStack } from '@navikt/ds-react'
import { useEffect } from 'react'
import { useController, useForm } from 'react-hook-form'
import useSWRMutation from 'swr/mutation'

import { Brevmal, type Brev } from '../../../../brev/brevTyper.ts'
import { useMutateBrevPdf } from '../../../../brev/useBrev.ts'
import { useBrevActions } from '../../../../brev/useBrevActions.ts'
import { useSerienummer } from '../../../../brev/useSerienummer.ts'
import { Fritekst } from '../../../../felleskomponenter/brev/Fritekst'
import { SkjemaAlert } from '../../../../felleskomponenter/SkjemaAlert'
import { Etikett } from '../../../../felleskomponenter/typografi'
import { type Saksbehandlingsoppgave } from '../../../../oppgave/oppgaveTypes.ts'
import { useOppgaveregler } from '../../../../oppgave/useOppgaveregler.ts'
import { useNotater } from '../../../../sak/notat/useNotater'
import { Brevkode, StepType, VilkårsResultat, type Barnebrillesak } from '../../../../types/types.internal'
import { useSakActions } from '../../../useSakActions.ts'
import { NotatUtkastVarsel } from '../../../venstremeny/NotatUtkastVarsel'
import { useManuellSaksbehandlingContext } from '../../ManuellSaksbehandlingTabContext'
import { useSaksdokumenter } from '../../useSaksdokumenter'
import { useSamletVurdering } from '../../useSamletVurdering'

export interface RedigeringsvisningProps {
  oppgave: Saksbehandlingsoppgave
  sak: Barnebrillesak
  vedtaksbrev?: Brev<{ brevtekst?: string }>
  harBrevutkast?: boolean
}

export function Redigeringsvisning(props: RedigeringsvisningProps) {
  const { oppgave, sak, vedtaksbrev, harBrevutkast } = props
  const { oppgaveErUnderBehandling } = useOppgaveregler(oppgave)
  const { setStep } = useManuellSaksbehandlingContext()
  const samletVurdering = useSamletVurdering(sak)
  const sakActions = useSakActions()
  const { oppdaterBrevutkast } = useBrevActions(oppgave, vedtaksbrev?.brevId)
  const mutateBrevPdf = useMutateBrevPdf()

  const { data: saksdokumenter } = useSaksdokumenter(
    sak.sakId,
    samletVurdering === VilkårsResultat.OPPLYSNINGER_MANGLER
  )

  const { harUtkast: harNotatUtkast } = useNotater(oppgave.sakId)

  // todo -> bør utledes og kontrolleres av backend
  const etterspørreOpplysningerBrev = saksdokumenter?.find(
    (saksdokument) => saksdokument.brevkode === Brevkode.INNHENTE_OPPLYSNINGER_BARNEBRILLER
  )
  const etterspørreOpplysningerBrevFinnes = etterspørreOpplysningerBrev != null

  const manglerPåkrevdEtterspørreOpplysningerBrev =
    oppgaveErUnderBehandling &&
    samletVurdering === VilkårsResultat.OPPLYSNINGER_MANGLER &&
    !etterspørreOpplysningerBrevFinnes

  const manglerPåkrevdUtbetalingsmottakerVedInnvilgelse =
    sak.vilkårsvurdering?.resultat === VilkårsResultat.JA && !sak.utbetalingsmottaker?.kontonummer

  const isVedtakAvslagManglendeOpplysninger =
    vedtaksbrev?.brevmal === Brevmal.BARNEBRILLER_VEDTAK_AVSLAG_MANGLENDE_OPPLYSNINGER

  const {
    getValues,
    formState: { isSubmitting },
    reset,
    handleSubmit,
    control,
  } = useForm({
    defaultValues: {
      brevtekst: vedtaksbrev?.data?.brevtekst ?? '',
    },
  })

  useEffect(() => {
    reset(
      {
        brevtekst: vedtaksbrev?.data?.brevtekst ?? '',
      },
      { keepDirtyValues: true }
    )
  }, [vedtaksbrev, reset])

  const brevtekstController = useController({
    name: 'brevtekst',
    rules: {
      required: isVedtakAvslagManglendeOpplysninger ? 'Du kan ikke sende brevet uten å ha lagt til tekst' : false,
    },
    control,
  })

  const nesteSerienummer = useSerienummer(vedtaksbrev?.brevId, vedtaksbrev?.serienummer)

  const handleUpdateBrevutkast = async (values: { brevtekst: string }) => {
    if (!vedtaksbrev) return
    await oppdaterBrevutkast
      .trigger({
        brevutkast: {
          brevmal: vedtaksbrev.brevmal,
          brevmalVersjon: vedtaksbrev.brevmalVersjon,
          målform: vedtaksbrev.målform,
          data: { brevtekst: values.brevtekst },
        },
        serienummer: nesteSerienummer(),
      })
      .catch((error) => {
        if (error?.status === 409) return
        throw error
      })
  }

  const handleForhåndsvis = useSWRMutation<void, Error, string, unknown>('vedtaksbrev-barnebriller', async () => {
    if (!vedtaksbrev || !isVedtakAvslagManglendeOpplysninger) return
    await handleUpdateBrevutkast(getValues())
    await mutateBrevPdf(vedtaksbrev.sakId, vedtaksbrev.brevId)
  })

  const handleSendTilGodkjenning = handleSubmit(async (values) => {
    if (!vedtaksbrev) return
    if (isVedtakAvslagManglendeOpplysninger) {
      await handleUpdateBrevutkast(values)
    }
    if (!harNotatUtkast) {
      await sakActions.opprettTotrinnskontroll()
    }
  })

  return (
    <form onSubmit={handleSendTilGodkjenning}>
      <VStack gap="space-16">
        {isVedtakAvslagManglendeOpplysninger && (
          <>
            <Fritekst
              label="Beskriv hvilke opplysninger som mangler"
              description="Vises i brevet som en del av begrunnelsen for avslaget"
              error={brevtekstController.fieldState.error?.message}
              {...brevtekstController.field}
            />
            <div>
              <Button
                size="small"
                type="button"
                variant="secondary"
                loading={handleForhåndsvis.isMutating}
                onClick={handleForhåndsvis.trigger}
              >
                Forhåndsvis
              </Button>
            </div>
          </>
        )}
        {manglerPåkrevdEtterspørreOpplysningerBrev && (
          <SkjemaAlert variant="warning" role="status">
            <Etikett>Mangler innhente opplysninger brev</Etikett>
            <Detail>
              Det er ikke sendt ut brev for å innhente manglende opplysninger i denne saken. Du kan ikke avslå en sak på
              grunn av manglende opplysninger før det er sendt brev til bruker for å innhenter manglende opplysninger og
              bruker ikke har sendt inn dette før fristen på 3 uker.
            </Detail>
          </SkjemaAlert>
        )}
        {harBrevutkast === true && (
          <SkjemaAlert variant="warning">
            <Detail>
              Det er laget et brev i saken som ikke er sendt ut. Gå til brev-fanen for å sende eller slette brevet.
            </Detail>
          </SkjemaAlert>
        )}
        {harNotatUtkast === true && <NotatUtkastVarsel />}
        <HStack gap="space-8">
          <Button
            size="small"
            type="button"
            variant="secondary"
            onClick={() => {
              setStep(StepType.VILKÅR)
              return handleUpdateBrevutkast(getValues())
            }}
          >
            Forrige
          </Button>
          {!manglerPåkrevdEtterspørreOpplysningerBrev && !manglerPåkrevdUtbetalingsmottakerVedInnvilgelse && (
            <Button size="small" type="submit" variant="primary" loading={isSubmitting}>
              Send til godkjenning
            </Button>
          )}
        </HStack>
      </VStack>
    </form>
  )
}
