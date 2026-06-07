import { Button, Detail, HStack } from '@navikt/ds-react'

import { useController, useForm } from 'react-hook-form'
import { type Brev } from '../../../../brev/brevTyper.ts'
import { mutateBrevUrl } from '../../../../brev/useBrev.ts'
import { useBrevActions } from '../../../../brev/useBrevActions.ts'
import { Fritekst } from '../../../../felleskomponenter/brev/Fritekst'
import { SkjemaAlert } from '../../../../felleskomponenter/SkjemaAlert'
import { Etikett } from '../../../../felleskomponenter/typografi'
import { type Saksbehandlingsoppgave } from '../../../../oppgave/oppgaveTypes.ts'
import { useNotater } from '../../../../sak/notat/useNotater'
import {
  type Barnebrillesak,
  Brevkode,
  OppgaveStatusType,
  StepType,
  VilkårsResultat,
} from '../../../../types/types.internal'
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
  const { setStep } = useManuellSaksbehandlingContext()
  const samletVurdering = useSamletVurdering(sak)
  const sakActions = useSakActions()
  const { oppdaterBrevutkast } = useBrevActions(oppgave, vedtaksbrev?.brevId)

  const { data: saksdokumenter } = useSaksdokumenter(
    sak.sakId,
    samletVurdering === VilkårsResultat.OPPLYSNINGER_MANGLER
  )

  const { harUtkast: harNotatUtkast } = useNotater(oppgave.sakId)

  // todo -> bør utledes og kontrolleres av backend
  const etterspørreOpplysningerBrev = saksdokumenter?.find(
    (saksdokument) => saksdokument.brevkode === Brevkode.INNHENTE_OPPLYSNINGER_BARNEBRILLER
  )
  const etterspørreOpplysningerBrevFinnes = etterspørreOpplysningerBrev !== undefined

  const manglerPåkrevdEtterspørreOpplysningerBrev =
    samletVurdering === VilkårsResultat.OPPLYSNINGER_MANGLER &&
    !etterspørreOpplysningerBrevFinnes &&
    sak.saksstatus === OppgaveStatusType.TILDELT_SAKSBEHANDLER

  const manglerPåkrevdUtbetalingsmottakerVedInnvilgelse =
    sak.vilkårsvurdering?.resultat === VilkårsResultat.JA && !sak.utbetalingsmottaker?.kontonummer

  const visFritekstFelt =
    samletVurdering === VilkårsResultat.OPPLYSNINGER_MANGLER && !manglerPåkrevdEtterspørreOpplysningerBrev

  const {
    formState: { isSubmitting },
    handleSubmit,
    control,
  } = useForm({
    defaultValues: {
      brevtekst: vedtaksbrev?.data?.brevtekst ?? '',
    },
  })

  const brevtekstController = useController({
    name: 'brevtekst',
    rules: {
      required: !visFritekstFelt || 'Du kan ikke sende brevet uten å ha lagt til tekst',
    },
    control,
  })

  const handleForhåndsvis = handleSubmit(async (values) => {
    if (!vedtaksbrev) return
    await oppdaterBrevutkast.trigger({
      brevutkast: {
        brevmal: vedtaksbrev.brevmal,
        brevmalVersjon: vedtaksbrev.brevmalVersjon,
        målform: vedtaksbrev.målform,
        data: { brevtekst: values.brevtekst },
      },
    })
    return mutateBrevUrl(vedtaksbrev.sakId, vedtaksbrev.brevId)
  })

  return (
    <form>
      {visFritekstFelt && (
        <>
          <Fritekst
            label="Beskriv hvilke opplysninger som mangler"
            description="Vises i brevet som en del av begrunnelsen for avslaget"
            error={brevtekstController.fieldState.error?.message}
            {...brevtekstController.field}
          />
          <div>
            <Button size="small" type="button" variant="secondary" loading={isSubmitting} onClick={handleForhåndsvis}>
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
      {harNotatUtkast && <NotatUtkastVarsel />}
      <HStack gap="space-8">
        <Button size="small" type="button" variant="secondary" onClick={() => setStep(StepType.VILKÅR)}>
          Forrige
        </Button>
        {!manglerPåkrevdEtterspørreOpplysningerBrev && !manglerPåkrevdUtbetalingsmottakerVedInnvilgelse && (
          <Button
            loading={sakActions.state.loading}
            disabled={sakActions.state.loading}
            size="small"
            variant="primary"
            onClick={async () => {
              // todo -> valider at brev har blitt oppdatert ved manglende opplysninger
              if (!visFritekstFelt && !harNotatUtkast) {
                await sakActions.opprettTotrinnskontroll()
              }
            }}
          >
            Send til godkjenning
          </Button>
        )}
      </HStack>
    </form>
  )
}
