import { Heading, HStack, VStack } from '@navikt/ds-react'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { Journalstatus } from '../dokument/dokumentTypes.ts'
import { SelectController } from '../felleskomponenter/skjema/SelectController.tsx'
import { TextContainer } from '../felleskomponenter/typografi.tsx'
import { type Journalføringsoppgave } from '../oppgave/oppgaveTypes.ts'
import { useOppgaveregler } from '../oppgave/useOppgaveregler.ts'
import { usePersonContext } from '../personoversikt/PersonContext.tsx'
import { useInnloggetAnsatt } from '../tilgang/useTilgang.ts'
import { type Journalpost } from '../types/types.internal.ts'
import { JournalføringDokumenter } from './JournalføringDokumenter.tsx'
import { JournalføringFerdigModal } from './JournalføringFerdigModal.tsx'
import { JournalføringHandlinger } from './JournalføringHandlinger.tsx'
import { JournalføringMenu } from './JournalføringMenu.tsx'
import { JournalføringParter } from './JournalføringParter.tsx'
import { JournalføringSakvalg } from './JournalføringSakvalg.tsx'
import classes from './JournalføringSkjema.module.css'
import { JournalpostInfo } from './JournalpostInfo.tsx'
import { KobleTilSakKort } from './KobleTilSakKort.tsx'
import { NySakSkjema } from './NySakSkjema.tsx'
import { type JournalføringStandardverdier } from './journalføringStandardverdier.ts'
import {
  OverstyrInnsynsregler,
  Sakstype,
  type JournalføringResponse,
  type JournalføringSkjemaVerdier,
  type SvartidsbrevValg,
  type TilordnetEnhet,
} from './journalføringTypes.ts'
import {
  byggJournalføringSak,
  byggSaksgrunnlag,
  byggSvartidsbrev,
  lagSkjemaverdier as lagDefaultVerdier,
  svartidsbrevManglerÅrsak,
} from './journalføringValg.ts'
import { useDokumentredigering } from './useDokumentredigering.ts'
import { useJournalføringActions } from './useJournalføringActions.ts'
import { erFagsak, useKobleTilSak, type Sakvalg } from './useKobleTilSak.ts'

interface JournalføringSkjemaProps {
  oppgave: Journalføringsoppgave
  journalpost: Journalpost
  mutateJournalpost(): void
  erBarnebrilleSøknad: boolean
  standardverdier: JournalføringStandardverdier
}

export function JournalføringSkjema({
  oppgave,
  journalpost,
  mutateJournalpost,
  erBarnebrilleSøknad,
  standardverdier,
}: JournalføringSkjemaProps) {
  const [sakType, setSakType] = useState<'ny' | 'eksisterende'>('ny')
  const [valgtSak, setValgtSak] = useState<Sakvalg | null>(null)
  const [valgtSakIdFeil, setValgtSakIdFeil] = useState<string | null>(null)
  const [journalføringResultat, setJournalføringResultat] = useState<JournalføringResponse | null>(null)
  const [tilordnetEnhet, setTilordnetEnhet] = useState<TilordnetEnhet>()
  const [svartidsbrevValg, setSvartidsbrevValg] = useState<SvartidsbrevValg | null>(null)
  const [visSvartidsbrevFeil, setVisSvartidsbrevFeil] = useState(false)
  const { fodselsnummer, setFodselsnummer } = usePersonContext()
  const [avsenderFnr, setAvsenderFnr] = useState(journalpost.fnrInnsender)

  const dokumentredigering = useDokumentredigering(journalpost)
  const { journalfør } = useJournalføringActions(oppgave)
  const { oppgaveErUnderBehandlingAvInnloggetAnsatt: kanRedigere } = useOppgaveregler(oppgave)
  const { id: innloggetAnsattId } = useInnloggetAnsatt()

  const [defaultValues] = useState(() => lagDefaultVerdier(journalpost, standardverdier, new Date()))
  const form = useForm<JournalføringSkjemaVerdier>({ mode: 'onChange', defaultValues })
  const {
    handleSubmit,
    control,
    getValues,
    trigger,
    formState: { isSubmitting },
  } = form
  const isJournalfører = isSubmitting || journalfør.isMutating

  const [forrigeFodselsnummer, setForrigeFodselsnummer] = useState(fodselsnummer)
  if (fodselsnummer !== forrigeFodselsnummer) {
    setForrigeFodselsnummer(fodselsnummer)
    setValgtSak(null)
    setValgtSakIdFeil(null)
  }

  const {
    saker,
    antallSaker,
    isLoading: sakerIsLoading,
    error: sakerError,
  } = useKobleTilSak(kanRedigere ? fodselsnummer : undefined, journalpost.dokumenter[0]?.brevkode)

  const tildeltEnhet = `${oppgave.tildeltEnhet.navn} - ${oppgave.tildeltEnhet.nummer}`

  async function journalførOgOpprettSak(verdier: JournalføringSkjemaVerdier) {
    if (!dokumentredigering.validerTitler()) return
    if (svartidsbrevValg && svartidsbrevManglerÅrsak(svartidsbrevValg)) {
      return
    }

    const resultat = await journalfør.trigger({
      ...dokumentredigering.byggDokumentPayload(),
      brukerFnr: fodselsnummer,
      avsenderFnr,
      overstyrInnsynsregler: verdier.overstyrInnsynsregler as OverstyrInnsynsregler,
      saksgrunnlag: byggSaksgrunnlag(verdier, oppgave.tildeltEnhet.nummer, innloggetAnsattId),
      svartidsbrev: svartidsbrevValg ? byggSvartidsbrev(svartidsbrevValg) : undefined,
    })
    if (resultat) {
      setTilordnetEnhet(verdier.tilordnetEnhet)
      setJournalføringResultat(resultat)
    }
  }

  async function journalførOgKobleTilSak() {
    if (!valgtSak) {
      setValgtSakIdFeil('Du må velge en sak å koble til')
      return
    }
    const innsynGyldig = await trigger(['dokumentkontroll', 'dokumentavvik', 'overstyrInnsynsregler'])
    if (!dokumentredigering.validerTitler() || !innsynGyldig) return

    const resultat = await journalfør.trigger({
      ...dokumentredigering.byggDokumentPayload(),
      brukerFnr: fodselsnummer,
      avsenderFnr,
      overstyrInnsynsregler: getValues('overstyrInnsynsregler') as OverstyrInnsynsregler,
      sak: byggJournalføringSak(valgtSak),
    })
    if (resultat) {
      setTilordnetEnhet(undefined)
      setJournalføringResultat(resultat)
    }
  }

  async function onJournalfør() {
    if (sakType === 'eksisterende') {
      await journalførOgKobleTilSak()
    } else {
      dokumentredigering.visTittelfeilmeldinger()
      if (svartidsbrevValg && svartidsbrevManglerÅrsak(svartidsbrevValg)) {
        setVisSvartidsbrevFeil(true)
      }
      await handleSubmit(journalførOgOpprettSak)()
    }
  }

  return (
    <VStack className={classes.rot}>
      <HStack justify="space-between" align="center" className={classes.header}>
        <Heading level="1" size="xsmall">
          Journalføring
        </Heading>
        <JournalføringMenu
          oppgave={oppgave}
          spørreundersøkelseId={
            erBarnebrilleSøknad ? 'barnebrillesak_overført_gosys_v1' : 'journalføringingsoppgave_overført_gosys_v1'
          }
          onAction={mutateJournalpost}
        />
      </HStack>

      <FormProvider {...form}>
        <form onSubmit={(e) => e.preventDefault()} noValidate className={classes.form}>
          <VStack gap="space-16" className={classes.innhold}>
            <JournalpostInfo journalpost={journalpost} />

            <VStack gap="space-8">
              <Heading level="2" size="small">
                Gjelder
              </Heading>
              <TextContainer>
                <SelectController
                  control={control}
                  name="tema"
                  label="Tema"
                  size="small"
                  readOnly={!kanRedigere}
                  rules={{ required: 'Du må velge tema' }}
                >
                  <option value="HJE">Hjelpemidler</option>
                </SelectController>
              </TextContainer>
              <JournalføringParter
                journalpost={journalpost}
                tildeltEnhet={tildeltEnhet}
                kanRedigere={kanRedigere}
                avsenderFnr={avsenderFnr}
                onAvsenderChange={setAvsenderFnr}
                onBrukerChange={setFodselsnummer}
              />
            </VStack>

            <JournalføringDokumenter
              key={journalpost.journalpostId}
              journalpost={journalpost}
              dokumentTitler={dokumentredigering.dokumentTitler}
              onTittelChange={dokumentredigering.settTittel}
              onChipsChange={dokumentredigering.settAnnetInnhold}
              readOnly={!kanRedigere}
              visTittelFeil={dokumentredigering.visTittelFeil}
            />

            <JournalføringSakvalg
              sakType={sakType}
              kanRedigere={kanRedigere}
              antallSaker={antallSaker}
              onSakTypeChange={(type) => {
                setSakType(type)
                if (type === 'ny') {
                  setValgtSak(null)
                  setValgtSakIdFeil(null)
                }
              }}
            />
            {sakType === 'eksisterende' && fodselsnummer && (
              <VStack gap="space-8" paddingBlock="space-20 space-0">
                <Heading level="2" size="small">
                  Koble til eksisterende sak
                </Heading>
                <KobleTilSakKort
                  brukerFnr={fodselsnummer}
                  saker={saker}
                  isLoading={sakerIsLoading}
                  error={sakerError}
                  valgtSak={valgtSak}
                  onChange={(sak) => {
                    setValgtSak(sak)
                    if (sak) setValgtSakIdFeil(null)
                  }}
                  feilmelding={valgtSakIdFeil ?? undefined}
                />
              </VStack>
            )}

            {sakType === 'ny' && kanRedigere && (
              <NySakSkjema
                kanRedigere={kanRedigere}
                tildeltEnhet={tildeltEnhet}
                oppgave={oppgave}
                onSvartidsbrevChange={setSvartidsbrevValg}
                visSvartidsbrevFeil={visSvartidsbrevFeil}
                erBarnebrilleSøknad={erBarnebrilleSøknad}
              />
            )}
          </VStack>

          <JournalføringHandlinger
            kanRedigere={kanRedigere}
            erJournalført={journalpost.journalstatus === Journalstatus.JOURNALFOERT}
            sakType={sakType}
            isJournalfører={isJournalfører}
            onJournalfør={onJournalfør}
            svartidsbrevValg={svartidsbrevValg}
          />
        </form>
      </FormProvider>

      <JournalføringFerdigModal
        open={journalføringResultat != null}
        resultat={journalføringResultat}
        sakType={sakType}
        tilordnetEnhet={tilordnetEnhet}
        skjulTilSaken={valgtSak?.sakstype === Sakstype.GENERELL_SAK || (valgtSak ? erFagsak(valgtSak) : false)}
        onJournalpostSakFerdigstilt={mutateJournalpost}
      />
    </VStack>
  )
}
