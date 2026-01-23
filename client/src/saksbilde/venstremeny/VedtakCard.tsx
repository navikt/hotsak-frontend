import { Button, HelpText, HStack, Tag, Textarea, TextField, VStack } from '@navikt/ds-react'
import { useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import styled from 'styled-components'

import { Controller } from 'react-hook-form'
import { Eksperiment } from '../../felleskomponenter/Eksperiment.tsx'
import { Knappepanel } from '../../felleskomponenter/Knappepanel'
import { Brødtekst, Etikett, Tekst } from '../../felleskomponenter/typografi'
import { OppgavetildelingKonfliktModal } from '../../oppgave/OppgavetildelingKonfliktModal.tsx'
import { OvertaOppgaveModal } from '../../oppgave/OvertaOppgaveModal.tsx'
import { useOppgaveActions } from '../../oppgave/useOppgaveActions.ts'
import { useInnloggetAnsatt } from '../../tilgang/useTilgang.ts'
import { OpplysningId } from '../../types/BehovsmeldingTypes.ts'
import { OppgaveStatusType, Sak, VedtakStatusType } from '../../types/types.internal'
import { formaterDato, formaterTidsstempel } from '../../utils/dato'
import { formaterNavn, storForbokstavIAlleOrd } from '../../utils/formater'
import { BekreftelseModal } from '../komponenter/BekreftelseModal'
import { OverførSakTilGosysModal } from '../OverførSakTilGosysModal.tsx'
import { TaOppgaveISakButton } from '../TaOppgaveISakButton.tsx'
import { useBehovsmelding } from '../useBehovsmelding.ts'
import { useOverførSakTilGosys } from '../useOverførSakTilGosys.ts'
import { useSakActions } from '../useSakActions.ts'
import { NotatUtkastVarsel } from './NotatUtkastVarsel.tsx'
import { useProblemsammendrag } from './useProblemsammendrag.ts'
import { VenstremenyCard } from './VenstremenyCard.tsx'

export interface VedtakCardProps {
  sak: Sak
  harNotatUtkast?: boolean
  lesevisning: boolean
}

interface VedtakFormValues {
  problemsammendrag: string
  postbegrunnelse?: string
}

export function VedtakCard({ sak, lesevisning, harNotatUtkast = false }: VedtakCardProps) {
  const { sakId } = sak

  const innloggetAnsatt = useInnloggetAnsatt()
  const [visVedtakModal, setVisVedtakModal] = useState(false)
  const [visOvertaSakModal, setVisOvertaSakModal] = useState(false)
  const [submitAttempt, setSubmitAttempt] = useState(false)
  const [visTildelSakKonfliktModalForSak, setVisTildelSakKonfliktModalForSak] = useState(false)
  const [harLagretPostbegrunnelse, setHarLagretPostbegrunnelse] = useState(false)
  const { onOpen: visOverførGosys, ...overførGosys } = useOverførSakTilGosys('sak_overført_gosys_v1')
  const oppgaveActions = useOppgaveActions()
  const behovsmelding = useBehovsmelding()
  const sakActions = useSakActions()
  const problemsammendrag = useProblemsammendrag()

  const harLavereRangerte = useMemo(
    () =>
      behovsmelding.behovsmelding?.hjelpemidler.hjelpemidler.some(
        (hjelpemiddel) => (hjelpemiddel.produkt.rangering ?? 0) > 1
      ) ?? false,
    [behovsmelding]
  )

  const lavereRangertHjelpemiddel = behovsmelding.behovsmelding?.hjelpemidler.hjelpemidler.find(
    (hjelpemiddel) => (hjelpemiddel.produkt.rangering ?? 0) > 1
  )

  const lavereRangertBegrunnelse =
    'POST ' +
    lavereRangertHjelpemiddel?.opplysninger
      .find((opplysning) => opplysning.key?.id === OpplysningId.LAVERE_RANGERING_BEGRUNNELSE)
      ?.innhold.at(0)?.fritekst

  const lagProblemsammendrag = () =>
    `${storForbokstavIAlleOrd(sak.søknadGjelder.replace('Søknad om:', '').trim())}; ${sakId}`

  const form = useForm<VedtakFormValues>({
    values: {
      problemsammendrag:
        problemsammendrag.problemsammendrag == 'Søknad om hjelpemidler; '
          ? lagProblemsammendrag()
          : (problemsammendrag.problemsammendrag ?? lagProblemsammendrag()),
      postbegrunnelse: lavereRangertBegrunnelse,
    },
    resetOptions: {
      keepDirtyValues: true,
    },
  })

  const validerPostbegrunnelse = (value: string | undefined) => {
    if (!value || value.trim() === '' || value.trim() === 'POST') {
      return 'Begrunnelse er påkrevd når det er søkt om lavere rangerte hjelpemidler'
    }
    if (!value.trim().startsWith('POST ')) {
      return 'Begrunnelsen må starte med "POST"'
    }
    return true
  }

  const fattVedtak = async (data: VedtakFormValues) => {
    if (harLavereRangerte && !harLagretPostbegrunnelse) {
    } else {
      await sakActions.fattVedtak(data.problemsammendrag, data.postbegrunnelse)
      setVisVedtakModal(false)
    }
  }

  const overtaSak = async () => {
    await oppgaveActions.endreOppgavetildeling({ overtaHvisTildelt: true })
    setVisOvertaSakModal(false)
  }

  if (sak.saksstatus === OppgaveStatusType.HENLAGT) {
    return (
      <VenstremenyCard heading="Henlagt">
        <Tag data-cy="tag-soknad-status" variant="info" size="small">
          Henlagt
        </Tag>
        <StatusTekst>
          <Tekst>{`${formaterTidsstempel(sak.saksstatusGyldigFra)}`}</Tekst>
        </StatusTekst>
      </VenstremenyCard>
    )
  }

  if (sak.vedtak && sak.vedtak.status === VedtakStatusType.INNVILGET) {
    return (
      <VenstremenyCard heading="Vedtak">
        <Tag data-cy="tag-soknad-status" variant="success" size="small">
          Innvilget
        </Tag>
        <StatusTekst>
          <Tekst>{`${formaterDato(sak.vedtak.vedtaksdato)}`}</Tekst>
        </StatusTekst>
      </VenstremenyCard>
    )
  }

  if (sak.saksstatus === OppgaveStatusType.SENDT_GOSYS) {
    return (
      <VenstremenyCard heading="Overført">
        <Tag data-cy="tag-soknad-status" variant="info" size="small">
          Overført til Gosys
        </Tag>
        <StatusTekst>
          <Tekst>{`${formaterTidsstempel(sak.saksstatusGyldigFra)}`}</Tekst>
          <Tekst>Saken er overført Gosys og behandles videre der.</Tekst>
        </StatusTekst>
      </VenstremenyCard>
    )
  }

  if (sak.saksstatus === OppgaveStatusType.AVVENTER_JOURNALFØRING) {
    return (
      <VenstremenyCard heading="Avventer journalføring">
        <Tekst>Prøv igjen senere.</Tekst>
      </VenstremenyCard>
    )
  }

  if (sak.saksstatus === OppgaveStatusType.AVVENTER_SAKSBEHANDLER) {
    return (
      <VenstremenyCard heading="Sak ikke startet">
        <Tekst>Saken er ikke tildelt en saksbehandler ennå.</Tekst>
        {!lesevisning && (
          <Knappepanel>
            <TaOppgaveISakButton />
          </Knappepanel>
        )}
      </VenstremenyCard>
    )
  }

  if (sak.saksstatus === OppgaveStatusType.TILDELT_SAKSBEHANDLER && sak.saksbehandler?.id !== innloggetAnsatt.id) {
    return (
      <VenstremenyCard heading="Saksbehandler">
        <Tekst>Saken er tildelt saksbehandler {formaterNavn(sak.saksbehandler?.navn)}.</Tekst>
        {!lesevisning && (
          <>
            <Knappepanel>
              <Knapp variant="primary" size="small" onClick={() => setVisOvertaSakModal(true)}>
                Overta saken
              </Knapp>
            </Knappepanel>
            <OvertaOppgaveModal
              open={visOvertaSakModal}
              saksbehandler={sak?.saksbehandler?.navn || '<Ukjent>'}
              onBekreft={() => overtaSak()}
              loading={oppgaveActions.state.loading}
              onClose={() => setVisOvertaSakModal(false)}
            />
            <OppgavetildelingKonfliktModal
              open={visTildelSakKonfliktModalForSak}
              onClose={() => setVisTildelSakKonfliktModalForSak(false)}
              saksbehandler={sak.saksbehandler}
            />
          </>
        )}
      </VenstremenyCard>
    )
  }

  if (lesevisning) {
    return null
  }

  return (
    <VenstremenyCard>
      {submitAttempt && harNotatUtkast && <NotatUtkastVarsel />}
      <Knappepanel gap="0">
        <Knapp
          variant="primary"
          size="small"
          onClick={() => {
            if (harNotatUtkast) {
              setSubmitAttempt(true)
            } else {
              setVisVedtakModal(true)
            }
          }}
        >
          Innvilg søknaden
        </Knapp>
        <Knapp
          variant="secondary"
          size="small"
          onClick={() => {
            if (harNotatUtkast) {
              setSubmitAttempt(true)
            } else {
              visOverførGosys()
            }
          }}
        >
          Overfør til Gosys
        </Knapp>
      </Knappepanel>
      <BekreftelseModal
        heading="Vil du innvilge søknaden?"
        loading={sakActions.state.loading}
        open={visVedtakModal}
        buttonSize="medium"
        width="700px"
        bekreftButtonLabel="Innvilg søknaden"
        onBekreft={form.handleSubmit(fattVedtak)}
        onClose={() => setVisVedtakModal(false)}
      >
        <Brødtekst spacing>
          Når du innvilger søknaden vil det opprettes en serviceforespørsel (SF) i OeBS. Innbygger kan se vedtaket på
          innlogget side på nav.no neste virkedag.
        </Brødtekst>
        <FormProvider {...form}>
          <VStack gap="space-16">
            <Controller
              name="problemsammendrag"
              control={form.control}
              rules={{ required: 'Feltet er påkrevd' }}
              render={({ field, fieldState }) => (
                <TextField
                  label={
                    <HStack wrap={false} gap="2" align="center">
                      <Etikett>Problemsammendrag til OeBS </Etikett>
                      <HelpText strategy="fixed">
                        <Brødtekst>
                          Foreslått tekst oppfyller registreringsinstruksen. Du kan redigere teksten i
                          problemsammendraget dersom det er nødvendig. Det kan du gjøre i feltet nedenfor før saken
                          innvilges eller inne på SF i OeBS som tidligere.
                        </Brødtekst>
                      </HelpText>
                    </HStack>
                  }
                  size="small"
                  {...field}
                  value={field.value ?? ''}
                  error={fieldState.error?.message}
                />
              )}
            />
            <Eksperiment>
              <VStack gap="space-8">
                {harLavereRangerte && (
                  <>
                    <Textarea
                      readOnly={harLagretPostbegrunnelse}
                      label={
                        <HStack wrap={false} gap="2" align="center">
                          <Etikett>Begrunnelse for lavere rangering</Etikett>
                          <HelpText strategy="fixed">
                            <Brødtekst>
                              Faglig begrunnelse for hvorfor det velges et hjelpemiddel med lavere rangering
                              ("postbegrunnelse"). En faglig begrunnelse skal skrives slik at utenforstående forstår
                              hvorfor produktet er valgt. Det er ikke nødvendig å begrunne hvorfor produktet som er
                              rangert som nr. 1 ikke velges. Teksten overføres til OeBS.
                            </Brødtekst>
                          </HelpText>
                        </HStack>
                      }
                      description="Se over begrunnelsen og fjern sensitive opplysninger"
                      size="small"
                      error={form.formState.errors.postbegrunnelse?.message}
                      {...form.register('postbegrunnelse', {
                        validate: (value) => {
                          if (!harLagretPostbegrunnelse) {
                            return 'Du må godkjenne begrunnelsen før søknaden kan innvilges'
                          }
                          return validerPostbegrunnelse(value)
                        },
                      })}
                    ></Textarea>
                    <HStack>
                      {harLagretPostbegrunnelse ? (
                        <Button
                          variant="secondary"
                          size="small"
                          onClick={() => {
                            form.clearErrors('postbegrunnelse')
                            setHarLagretPostbegrunnelse(false)
                          }}
                        >
                          Endre begrunnelse
                        </Button>
                      ) : (
                        <Button
                          variant="secondary"
                          size="small"
                          onClick={() => {
                            const value = form.getValues('postbegrunnelse')
                            const valideringResultat = validerPostbegrunnelse(value)
                            if (valideringResultat !== true) {
                              form.setError('postbegrunnelse', { message: valideringResultat })
                            } else {
                              form.clearErrors('postbegrunnelse')
                              setHarLagretPostbegrunnelse(true)
                            }
                          }}
                        >
                          Godkjenn begrunnelse
                        </Button>
                      )}
                    </HStack>
                  </>
                )}
              </VStack>
            </Eksperiment>
          </VStack>
        </FormProvider>
      </BekreftelseModal>
      <OverførSakTilGosysModal
        {...overførGosys}
        onBekreft={async (tilbakemelding) => {
          await overførGosys.onBekreft(tilbakemelding)
        }}
      />
    </VenstremenyCard>
  )
}

const StatusTekst = styled.div`
  padding-top: 0.5rem;
`

const Knapp = styled(Button)`
  min-height: 0;
  margin: 2px;
  height: 1.8rem;
  padding: 0 0.75rem;
  box-sizing: border-box;
`
