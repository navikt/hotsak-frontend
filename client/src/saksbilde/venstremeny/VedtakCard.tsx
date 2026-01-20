import { Button, HelpText, HStack, Tag, Textarea, TextField, VStack } from '@navikt/ds-react'
import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import styled from 'styled-components'

import { Eksperiment } from '../../felleskomponenter/Eksperiment.tsx'
import { Knappepanel } from '../../felleskomponenter/Knappepanel'
import { Brødtekst, Etikett, Tekst } from '../../felleskomponenter/typografi'
import { http } from '../../io/HttpClient.ts'
import { OppgavetildelingKonfliktModal } from '../../oppgave/OppgavetildelingKonfliktModal.tsx'
import { OvertaOppgaveModal } from '../../oppgave/OvertaOppgaveModal.tsx'
import { useOppgaveActions } from '../../oppgave/useOppgaveActions.ts'
import { useInnloggetAnsatt } from '../../tilgang/useTilgang.ts'
import { OppgaveStatusType, Sak, VedtakStatusType } from '../../types/types.internal'
import { formaterDato, formaterTidsstempel } from '../../utils/dato'
import { formaterNavn, storForbokstavIAlleOrd } from '../../utils/formater'
import { useMiljø } from '../../utils/useMiljø.ts'
import { BekreftelseModal } from '../komponenter/BekreftelseModal'
import { OverførSakTilGosysModal } from '../OverførSakTilGosysModal.tsx'
import { TaOppgaveISakButton } from '../TaOppgaveISakButton.tsx'
import { useBehovsmelding } from '../useBehovsmelding.ts'
import { useOverførSakTilGosys } from '../useOverførSakTilGosys.ts'
import { useSakActions } from '../useSakActions.ts'
import { NotatUtkastVarsel } from './NotatUtkastVarsel.tsx'
import { VenstremenyCard } from './VenstremenyCard.tsx'
import { OpplysningId } from '../../types/BehovsmeldingTypes.ts'

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
  const { erProd } = useMiljø()

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

  const lavereRangertBegrunnelse = lavereRangertHjelpemiddel?.opplysninger
    .find((opplysning) => opplysning.key?.id === OpplysningId.LAVERE_RANGERING_BEGRUNNELSE)
    ?.innhold.at(0)?.fritekst

  const form = useForm<VedtakFormValues>({
    defaultValues: {
      problemsammendrag: `${storForbokstavIAlleOrd(sak.søknadGjelder.replace('Søknad om:', '').trim())}; ${sakId}`,
      postbegrunnelse: lavereRangertBegrunnelse,
    },
  })

  useEffect(() => {
    async function lastProblemsammendrag() {
      if (erProd) {
        form.reset({
          problemsammendrag: `${storForbokstavIAlleOrd(sak.søknadGjelder.replace('Søknad om:', '').trim())}; ${sakId}`,
          postbegrunnelse: lavereRangertBegrunnelse,
        })
        return
      }

      const response = await http.get<string>(`/api/sak/${sak.sakId}/serviceforesporsel`)

      form.reset({
        problemsammendrag: response,
        postbegrunnelse: lavereRangertBegrunnelse,
      })
    }

    lastProblemsammendrag()
  }, [erProd, sak.sakId])

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
            if (!erProd) {
              http.get<any>(`/api/sak/${sak.sakId}/serviceforesporsel`)
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
        width="700px"
        bekreftButtonLabel="Innvilg søknaden"
        onBekreft={form.handleSubmit(fattVedtak)}
        onClose={() => setVisVedtakModal(false)}
      >
        <Brødtekst spacing>
          Når du innvilger søknaden vil det opprettes en serviceforespørsel (SF) i OeBS. Innbygger kan se vedtaket på
          innlogget side på nav.no
        </Brødtekst>
        <FormProvider {...form}>
          <VStack gap="space-16">
            <TextField
              label={
                <HStack wrap={false} gap="2" align="center">
                  <Etikett>Tekst til problemsammendrag i SF i OeBS</Etikett>
                  <HelpText strategy="fixed">
                    <Brødtekst>
                      Foreslått tekst oppfyller registreringsinstruksen. Du kan redigere teksten i problemsammendraget
                      dersom det er nødvendig. Det kan du gjøre i feltet nedenfor før saken innvilges eller inne på SF i
                      OeBS som tidligere.
                    </Brødtekst>
                  </HelpText>
                </HStack>
              }
              size="small"
              {...form.register('problemsammendrag', { required: 'Feltet er påkrevd' })}
            />
            <Eksperiment>
              <VStack gap="space-8">
                {harLavereRangerte && (
                  <>
                    <Textarea
                      readOnly={harLagretPostbegrunnelse}
                      label={
                        <HStack wrap={false} gap="2" align="center">
                          <Etikett>Postbegrunnelse</Etikett>
                          <HelpText strategy="fixed">
                            <Brødtekst>
                              Skriv begrunnelse for hvorfor et lavere rangert hjelpemiddel velges. Teksten overføres til
                              dagbok notat på SF i OeBS.
                            </Brødtekst>
                          </HelpText>
                        </HStack>
                      }
                      size="small"
                      error={form.formState.errors.postbegrunnelse?.message}
                      {...form.register('postbegrunnelse', {
                        validate: (value) => {
                          if (!harLagretPostbegrunnelse) {
                            return 'Du må lagre begrunnelsen før du kan innvilge søknaden'
                          }
                          if (!value || value.trim() === '') {
                            return 'Postbegrunnelse er påkrevd når det er søkt om lavere rangerte hjelpemidler'
                          }
                          return true
                        },
                      })}
                    ></Textarea>
                    <HStack justify="end">
                      {harLagretPostbegrunnelse ? (
                        // TODO Håndtere clear error her
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
                        <Button variant="secondary" size="small" onClick={() => setHarLagretPostbegrunnelse(true)}>
                          Lagre begrunnelse
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
