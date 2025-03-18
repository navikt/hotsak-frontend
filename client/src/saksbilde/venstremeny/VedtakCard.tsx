import { Bleed, Box, Button, Heading, HelpText, HStack, ReadMore, Tag, TextField, VStack } from '@navikt/ds-react'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import styled from 'styled-components'

import { Knappepanel } from '../../felleskomponenter/Knappepanel'
import { Brødtekst, Etikett, Tekst } from '../../felleskomponenter/typografi'
import { useLogNesteNavigasjon } from '../../hooks/useLogNesteNavigasjon'
import { besvarelseToSvar, IBesvarelse } from '../../innsikt/Besvarelse.ts'
import { SpørreundersøkelseStack } from '../../innsikt/SpørreundersøkelseStack.tsx'
import { useSpørreundersøkelse } from '../../innsikt/useSpørreundersøkelse.ts'
import { postTildeling, putVedtak } from '../../io/http'
import { IkkeTildelt } from '../../oppgaveliste/kolonner/IkkeTildelt'
import { useErNotatPilot, useInnloggetSaksbehandler } from '../../state/authentication'
import { OppgaveApiOppgave } from '../../types/experimentalTypes.ts'
import { OppgaveStatusType, OppgaveVersjon, Sak, VedtakStatusType } from '../../types/types.internal'
import { amplitude_taxonomy, logAmplitudeEvent } from '../../utils/amplitude'
import { formaterDato, formaterTidsstempel } from '../../utils/dato'
import { formaterNavn, storForbokstavIAlleOrd } from '../../utils/formater'
import { BekreftelseModal } from '../komponenter/BekreftelseModal'
import { mutateSak } from '../mutateSak.ts'
import { OverførGosysModal } from '../OverførGosysModal'
import { OvertaSakModal } from '../OvertaSakModal'
import { TildelingKonfliktModal } from '../TildelingKonfliktModal.tsx'
import { useOverførGosys } from '../useOverførGosys'
import { NotatUtkastVarsel } from './NotatUtkastVarsel.tsx'
import { VenstremenyCard } from './VenstremenyCard.tsx'

export interface VedtakCardProps {
  sak: Sak
  harNotatUtkast?: boolean
  oppgave?: OppgaveApiOppgave
  lesevisning: boolean
}

interface VedtakFormValues {
  problemsammendrag: string
  besvarelse: IBesvarelse
}

export function VedtakCard({ sak, oppgave, lesevisning, harNotatUtkast = false }: VedtakCardProps) {
  const { sakId } = sak

  const oppgaveVersjon: OppgaveVersjon = oppgave
    ? {
        oppgaveId: oppgave.oppgaveId,
        versjon: oppgave.versjon,
      }
    : {}

  const saksbehandler = useInnloggetSaksbehandler()
  const [loading, setLoading] = useState(false)
  const [visVedtakModal, setVisVedtakModal] = useState(false)
  const [visOvertaSakModal, setVisOvertaSakModal] = useState(false)
  const [submitAttempt, setSubmitAttempt] = useState(false)
  const [visTildelSakKonfliktModalForSak, setVisTildelSakKonfliktModalForSak] = useState(false)
  const erNotatPilot = useErNotatPilot()
  const { onOpen: visOverførGosys, ...overførGosys } = useOverførGosys(sakId, oppgaveVersjon, 'sak_overført_gosys_v1')

  const [logNesteNavigasjon] = useLogNesteNavigasjon()

  const { spørreundersøkelse, defaultValues } = useSpørreundersøkelse('kontaktet_formidler_v1')
  const form = useForm<VedtakFormValues>({
    defaultValues: {
      problemsammendrag: `${storForbokstavIAlleOrd(sak.søknadGjelder.replace('Søknad om:', '').trim())}; ${sakId}`,
      besvarelse: defaultValues,
    },
  })

  const opprettVedtak = async (data: VedtakFormValues) => {
    const { problemsammendrag, besvarelse } = data
    const svar = besvarelseToSvar(spørreundersøkelse, besvarelse)
    setLoading(true)
    await putVedtak(sakId, oppgaveVersjon, problemsammendrag, {
      skjema: spørreundersøkelse.skjema,
      svar,
    }).catch(() => setLoading(false))
    setLoading(false)
    setVisVedtakModal(false)
    logAmplitudeEvent(amplitude_taxonomy.SOKNAD_INNVILGET)
    logNesteNavigasjon(amplitude_taxonomy.SOKNAD_INNVILGET)
    return mutateSak(sakId)
  }

  const overtaSak = async () => {
    setLoading(true)
    await postTildeling(sakId, oppgaveVersjon, true).catch(() => setLoading(false))
    setLoading(false)
    setVisOvertaSakModal(false)
    logAmplitudeEvent(amplitude_taxonomy.SAK_OVERTATT)
    return mutateSak(sakId)
  }

  if (sak.status === OppgaveStatusType.HENLAGT) {
    return (
      <VenstremenyCard heading="Henlagt">
        <Tag data-cy="tag-soknad-status" variant="info" size="small">
          Henlagt
        </Tag>
        <StatusTekst>
          <Tekst>{`${formaterTidsstempel(sak.statusEndret)}`}</Tekst>
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

  if (sak.status === OppgaveStatusType.SENDT_GOSYS) {
    return (
      <VenstremenyCard heading="Overført">
        <Tag data-cy="tag-soknad-status" variant="info" size="small">
          Overført til Gosys
        </Tag>
        <StatusTekst>
          <Tekst>{`${formaterTidsstempel(sak.statusEndret)}`}</Tekst>
          <Tekst>Saken er overført Gosys og behandles videre der.</Tekst>
        </StatusTekst>
      </VenstremenyCard>
    )
  }

  if (sak.status === OppgaveStatusType.AVVENTER_JOURNALFØRING) {
    return (
      <VenstremenyCard heading="Avventer journalføring">
        <Tekst>Prøv igjen senere.</Tekst>
      </VenstremenyCard>
    )
  }

  if (sak.status === OppgaveStatusType.AVVENTER_SAKSBEHANDLER) {
    return (
      <VenstremenyCard heading="Sak ikke startet">
        <Tekst>Saken er ikke tildelt en saksbehandler ennå.</Tekst>
        {!lesevisning && (
          <Knappepanel>
            <IkkeTildelt
              sakId={sakId}
              oppgaveVersjon={oppgaveVersjon}
              gåTilSak={false}
              onTildelingKonflikt={() => setVisTildelSakKonfliktModalForSak(true)}
            ></IkkeTildelt>
          </Knappepanel>
        )}
      </VenstremenyCard>
    )
  }

  if (sak.status === OppgaveStatusType.TILDELT_SAKSBEHANDLER && sak.saksbehandler?.id !== saksbehandler.id) {
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
            <OvertaSakModal
              open={visOvertaSakModal}
              saksbehandler={sak?.saksbehandler?.navn || '<Ukjent>'}
              onBekreft={() => overtaSak()}
              loading={loading}
              onClose={() => setVisOvertaSakModal(false)}
            />
            <TildelingKonfliktModal
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
      <Knappepanel gap="0rem">
        <Knapp
          variant="primary"
          size="small"
          onClick={() => {
            if (erNotatPilot && harNotatUtkast) {
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
            if (erNotatPilot && harNotatUtkast) {
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
        loading={loading}
        open={visVedtakModal}
        width="700px"
        buttonLabel="Innvilg søknaden"
        onBekreft={form.handleSubmit(opprettVedtak)}
        onClose={() => setVisVedtakModal(false)}
      >
        <Brødtekst spacing>
          Når du innvilger søknaden vil det opprettes en serviceforespørsel (SF) i OeBS. Innbygger kan se vedtaket på
          innlogget side på nav.no
        </Brødtekst>
        <FormProvider {...form}>
          <VStack gap="5">
            <TextField
              label={
                <HStack wrap={false} gap="2" align="center">
                  <Etikett>Tekst til problemsammendrag i SF i OeBS</Etikett>
                  <HelpText>
                    <Bleed marginInline="full" asChild>
                      <Brødtekst>
                        Foreslått tekst oppfyller registreringsinstruksen. Du kan redigere teksten i problemsammendraget
                        dersom det er nødvendig. Det kan du gjøre i feltet nedenfor før saken innvilges eller inne på SF
                        i OeBS som tidligere.
                      </Brødtekst>
                    </Bleed>
                  </HelpText>
                </HStack>
              }
              size="small"
              {...form.register('problemsammendrag', { required: 'Feltet er påkrevd' })}
            />
            <Box borderWidth="1" borderColor="border-default" padding="5">
              <Heading level="2" size="small" spacing>
                Spørreundersøkelse
              </Heading>
              <VStack gap="6">
                <div>
                  <Brødtekst>
                    Informasjonen du oppgir her vil ikke bli lagt ved saken. Svarene blir anonymisert.
                  </Brødtekst>
                  <ReadMore header="Grunnen til at vi samler inn denne informasjonen" size="small">
                    <Brødtekst spacing>
                      Denne undersøkelsen varer fra 21. til 23.oktober. Hensikten er å lære mer om hvilken informasjon
                      dere trenger i sakene, og hvilken informasjon dere får fra formidler. Resultatet fra undersøkelsen
                      vil gjøre oss i stand til å lære mer om behovet for informasjon i sakene. Når vi etter hvert vil
                      be om flere opplysninger i behovsmeldingen, så kan vi gjøre en ny undersøkelse. Da kan vi se om
                      behovet for å innhente informasjon fra formidler har gått ned. Takk for at dere hjelper oss ved å
                      svare!
                    </Brødtekst>
                  </ReadMore>
                </div>

                <SpørreundersøkelseStack spørreundersøkelse={spørreundersøkelse} navn="besvarelse" size="small" />
              </VStack>
            </Box>
          </VStack>
        </FormProvider>
      </BekreftelseModal>
      <OverførGosysModal
        {...overførGosys}
        onBekreft={async (tilbakemelding) => {
          await overførGosys.onBekreft(tilbakemelding)
          logAmplitudeEvent(amplitude_taxonomy.SOKNAD_OVERFORT_TIL_GOSYS)
          logNesteNavigasjon(amplitude_taxonomy.SOKNAD_OVERFORT_TIL_GOSYS)
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
