import { BodyShort, Button, Heading, HStack, useDatepicker, VStack } from '@navikt/ds-react'
import { addWeeks, formatISO, isAfter, parseISO } from 'date-fns'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { Skillelinje } from '../felleskomponenter/Strek.tsx'
import { SelectController } from '../felleskomponenter/skjema/SelectController.tsx'
import { OppgaveModalType, useOppgaveÅpneModalHandler } from '../oppgave/OppgaveContext.ts'
import { type Journalføringsoppgave, Oppgaveprioritet, Oppgavetype } from '../oppgave/oppgaveTypes.ts'
import { useOppgaveregler } from '../oppgave/useOppgaveregler.ts'
import { usePerson } from '../personoversikt/usePerson.ts'
import { type Dokument, type Journalpost } from '../types/types.internal.ts'
import { formaterDato } from '../utils/dato.ts'
import { JournalføringDokumenter } from './JournalføringDokumenter.tsx'
import { JournalføringFerdigModal } from './JournalføringFerdigModal.tsx'
import { JournalføringMenu } from './JournalføringMenu.tsx'
import { JournalføringParter } from './JournalføringParter.tsx'
import { JournalføringSakvalg } from './JournalføringSakvalg.tsx'
import { NySakSkjema } from './NySakSkjema.tsx'
import { type JournalføringV2Response, type JournalføringV2SkjemaVerdier } from './journalføringTypes.ts'
import { useJournalføringActions } from './useJournalføringActions.ts'
import { KobleTilSakKort } from './KobleTilSakKort.tsx'
import { TextContainer } from '../felleskomponenter/typografi.tsx'

interface JournalføringV2SkjemaProps {
  oppgave: Journalføringsoppgave
  journalpost: Journalpost
  mutateJournalpost(): void
}

export function JournalføringV2Skjema({ oppgave, journalpost, mutateJournalpost }: JournalføringV2SkjemaProps) {
  const [sakType, setSakType] = useState<'ny' | 'eksisterende'>('ny')
  const [valgtSakId, setValgtSakId] = useState<string | null>(null)
  const [valgtSakIdFeil, setValgtSakIdFeil] = useState<string | null>(null)
  const [dokumentTitler, setDokumentTitler] = useState<Record<string, string>>({})
  const [annetInnhold, setAnnetInnhold] = useState<Record<string, string[]>>({})
  const [journalføringResultat, setJournalføringResultat] = useState<JournalføringV2Response | null>(null)

  const mottattDatoDefault = parseISO(journalpost.journalpostOpprettetTid)
  const aktivFraDatoDefault = new Date()
  const fristDefault = addWeeks(mottattDatoDefault, 4)
  const opprinneligJournalføresPåFnr = journalpost.bruker?.fnr ?? journalpost.fnrInnsender ?? ''

  const { journalførV2 } = useJournalføringActions(oppgave, journalpost.journalpostId)
  const { oppgaveErUnderBehandlingAvInnloggetAnsatt } = useOppgaveregler(oppgave)
  const kanRedigere = oppgaveErUnderBehandlingAvInnloggetAnsatt
  const åpneModal = useOppgaveÅpneModalHandler()

  const form = useForm<JournalføringV2SkjemaVerdier>({
    mode: 'onChange',
    defaultValues: {
      tema: 'HJE',
      prioritet: Oppgaveprioritet.NORMAL,
      tilordnetEnhet: 'enhetensOppgaveliste',
      kommentar: '',
      behandlingstype: journalpost.behandlingstema?.kode ?? '',
      stønadsklassifisering: 'DA',
      stønadType: 'S',
      journalføresPåFnr: opprinneligJournalføresPåFnr,
      mottattDato: formatISO(mottattDatoDefault, { representation: 'date' }),
      aktivFra: formatISO(aktivFraDatoDefault, { representation: 'date' }),
      frist: formatISO(fristDefault, { representation: 'date' }),
    },
  })

  const { handleSubmit, control, setValue, getValues, watch, trigger, register } = form

  useEffect(() => {
    register('journalføresPåFnr')
    register('mottattDato')
    register('frist')
    register('aktivFra', {
      validate: (value) => {
        const fristVerdi = getValues('frist')
        if (value && fristVerdi && isAfter(parseISO(value), parseISO(fristVerdi))) {
          return 'Aktiv fra kan ikke være etter fristen'
        }
        return true
      },
    })
  }, [register, getValues])

  const {
    datepickerProps: fristProps,
    inputProps: fristInputProps,
    setSelected: setFrist,
  } = useDatepicker({
    defaultSelected: fristDefault,
    onDateChange: (dato) => {
      if (dato) {
        setValue('frist', formatISO(dato, { representation: 'date' }))
        trigger('aktivFra')
      }
    },
  })

  const journalføresPåFnr = watch('journalføresPåFnr')
  const { personInfo: valgtBruker } = usePerson(journalføresPåFnr || undefined)
  const brukerFnr = valgtBruker?.fnr ?? journalføresPåFnr

  const registrertDato = formaterDato(journalpost.journalpostOpprettetTid)
  const tildeltEnhet = `${oppgave.tildeltEnhet.navn} - ${oppgave.tildeltEnhet.nummer}`

  function byggJournalføringPayload() {
    const tittel =
      dokumentTitler[journalpost.dokumenter[0]?.dokumentId ?? ''] ??
      journalpost.dokumenter[0]?.tittel ??
      journalpost.tittel
    const fnr = getValues('journalføresPåFnr')
    const dokumenter = journalpost.dokumenter.map((dok: Dokument) => ({
      dokumentId: dok.dokumentId,
      tittel: dokumentTitler[dok.dokumentId] ?? dok.tittel,
      annetInnhold: annetInnhold[dok.dokumentId] ?? [],
    }))
    return { tittel, journalføresPåFnr: fnr, dokumenter }
  }

  // TODO Sjekk tildelt enhet vs gjeldende enhet for saksbehandler. Kan det være forskjell på dem?
  const onSubmit = async (verdier: JournalføringV2SkjemaVerdier) => {
    const { tittel, journalføresPåFnr: fnr, dokumenter } = byggJournalføringPayload()
    const resultat = await journalførV2.trigger({
      tittel,
      journalføresPåFnr: fnr,
      saksgrunnlag: {
        tema: verdier.tema,
        prioritet: verdier.prioritet,
        oppgavetype: Oppgavetype.BEHANDLE_SAK,
        behandlingstype: verdier.behandlingstype,
        behandlingstema: verdier.behandlingstema,
        stønadsklassifisering: verdier.stønadsklassifisering,
        stønad: verdier.stønadType,
        kommentar: verdier.kommentar,
        mottattDato: verdier.mottattDato,
        aktivDato: verdier.aktivFra,
        fristDato: verdier.frist,
        tildeltEnhet: oppgave.tildeltEnhet.nummer,
        tildeltSaksbehandler: verdier.tilordnetEnhet === 'medarbeidersOppgaveliste' ? verdier.medarbeider : undefined,
      },
      dokumenter,
    })
    if (resultat) {
      mutateJournalpost()
      setJournalføringResultat(resultat)
    }
  }

  const onSubmitKobleTilSak = async () => {
    if (!valgtSakId) {
      setValgtSakIdFeil('Du må velge en sak å koble til')
      return
    }
    const { tittel, journalføresPåFnr: fnr, dokumenter } = byggJournalføringPayload()
    const resultat = await journalførV2.trigger({ tittel, journalføresPåFnr: fnr, sakId: valgtSakId, dokumenter })
    if (resultat) {
      mutateJournalpost()
      setJournalføringResultat(resultat)
    }
  }

  return (
    <VStack gap="space-16">
      <HStack justify="space-between" align="center">
        <Heading level="1" size="xsmall">
          Journalføring
        </Heading>
        <JournalføringMenu
          oppgave={oppgave}
          spørreundersøkelseId="journalføringingsoppgave_overført_gosys_v1"
          onAction={mutateJournalpost}
        />
      </HStack>

      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <VStack gap="space-16">
            <div>
              <HStack gap="space-12" paddingBlock="space-0">
                <BodyShort size="small">
                  <strong>Kilde:</strong>
                  {`${journalpost.kanal.kode === 'SKAN_IM' ? ' Skanning' : ` ${journalpost.kanal.term}`}`}
                </BodyShort>
                <BodyShort size="small">
                  <strong>Registrert dato:</strong> {registrertDato}
                </BodyShort>
              </HStack>
              <Skillelinje />
            </div>

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
              <JournalføringParter journalpost={journalpost} tildeltEnhet={tildeltEnhet} kanRedigere={kanRedigere} />
            </VStack>

            <JournalføringDokumenter
              journalpost={journalpost}
              dokumentTitler={dokumentTitler}
              annetInnhold={annetInnhold}
              onTittelChange={(id, tittel) => setDokumentTitler((prev) => ({ ...prev, [id]: tittel }))}
              onChipsChange={(id, chips) => setAnnetInnhold((prev) => ({ ...prev, [id]: chips }))}
              readOnly={!kanRedigere}
            />

            <JournalføringSakvalg
              sakType={sakType}
              kanRedigere={kanRedigere}
              onSakTypeChange={(type) => {
                setSakType(type)
                if (type === 'ny') {
                  setValgtSakId(null)
                  setValgtSakIdFeil(null)
                }
              }}
            />
            {sakType === 'eksisterende' && brukerFnr && (
              <VStack gap="space-8" paddingBlock="space-20 space-0">
                <Heading level="2" size="small">
                  Koble til eksisterende sak
                </Heading>
                <KobleTilSakKort
                  fnr={brukerFnr}
                  valgtSakId={valgtSakId}
                  onChange={(sakId) => {
                    setValgtSakId(sakId)
                    if (sakId) setValgtSakIdFeil(null)
                  }}
                  feilmelding={valgtSakIdFeil ?? undefined}
                />
              </VStack>
            )}

            {sakType === 'ny' && kanRedigere && (
              <NySakSkjema
                kanRedigere={kanRedigere}
                tildeltEnhet={tildeltEnhet}
                setFrist={setFrist}
                fristProps={fristProps}
                fristInputProps={fristInputProps}
              />
            )}

            {kanRedigere && (
              <HStack gap="space-4" paddingBlock="space-8 space-0">
                <Button
                  type={sakType === 'eksisterende' ? 'button' : 'submit'}
                  variant="primary"
                  size="small"
                  loading={journalførV2.isMutating}
                  disabled={journalførV2.isMutating}
                  onClick={sakType === 'eksisterende' ? onSubmitKobleTilSak : undefined}
                >
                  {sakType === 'eksisterende' ? 'Journalfør og knytt til sak' : 'Journalfør og opprett sak'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="small"
                  onClick={() => åpneModal(OppgaveModalType.OVERFØR_TIL_GOSYS)}
                >
                  Overfør til Gosys
                </Button>
              </HStack>
            )}
          </VStack>
        </form>
      </FormProvider>

      <JournalføringFerdigModal
        open={journalføringResultat != null}
        resultat={journalføringResultat}
        sakType={sakType}
        onClose={() => setJournalføringResultat(null)}
      />
    </VStack>
  )
}
