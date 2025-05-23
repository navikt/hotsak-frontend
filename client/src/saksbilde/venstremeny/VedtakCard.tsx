import { Button, HelpText, HStack, Tag, TextField } from '@navikt/ds-react'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import styled from 'styled-components'

import { Knappepanel } from '../../felleskomponenter/Knappepanel'
import { Brødtekst, Etikett, Tekst } from '../../felleskomponenter/typografi'
import { useLogNesteNavigasjon } from '../../hooks/useLogNesteNavigasjon'
import { putVedtak } from '../../io/http'
import { IkkeTildelt } from '../../oppgaveliste/kolonner/IkkeTildelt'
import { useInnloggetAnsatt } from '../../tilgang/useTilgang.ts'
import { OppgaveStatusType, Sak, VedtakStatusType } from '../../types/types.internal'
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
import { useOppgaveService } from '../../oppgave/OppgaveService.ts'

export interface VedtakCardProps {
  sak: Sak
  harNotatUtkast?: boolean
  lesevisning: boolean
}

interface VedtakFormValues {
  problemsammendrag: string
}

export function VedtakCard({ sak, lesevisning, harNotatUtkast = false }: VedtakCardProps) {
  const { sakId } = sak

  const innloggetAnsatt = useInnloggetAnsatt()
  const [loading, setLoading] = useState(false)
  const [visVedtakModal, setVisVedtakModal] = useState(false)
  const [visOvertaSakModal, setVisOvertaSakModal] = useState(false)
  const [submitAttempt, setSubmitAttempt] = useState(false)
  const [visTildelSakKonfliktModalForSak, setVisTildelSakKonfliktModalForSak] = useState(false)
  const { onOpen: visOverførGosys, ...overførGosys } = useOverførGosys(sakId, 'sak_overført_gosys_v1')
  const { endreOppgavetildeling } = useOppgaveService()

  const [logNesteNavigasjon] = useLogNesteNavigasjon()

  const form = useForm<VedtakFormValues>({
    defaultValues: {
      problemsammendrag: `${storForbokstavIAlleOrd(sak.søknadGjelder.replace('Søknad om:', '').trim())}; ${sakId}`,
    },
  })

  const opprettVedtak = async (data: VedtakFormValues) => {
    const { problemsammendrag } = data
    setLoading(true)
    await putVedtak(sakId, problemsammendrag).catch(() => setLoading(false))
    setLoading(false)
    setVisVedtakModal(false)
    logAmplitudeEvent(amplitude_taxonomy.SOKNAD_INNVILGET)
    logNesteNavigasjon(amplitude_taxonomy.SOKNAD_INNVILGET)
    return mutateSak(sakId)
  }

  const overtaSak = async () => {
    setLoading(true)
    await endreOppgavetildeling({ overtaHvisTildelt: true }).catch(() => setLoading(false))
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
              gåTilSak={false}
              onTildelingKonflikt={() => setVisTildelSakKonfliktModalForSak(true)}
            ></IkkeTildelt>
          </Knappepanel>
        )}
      </VenstremenyCard>
    )
  }

  if (sak.status === OppgaveStatusType.TILDELT_SAKSBEHANDLER && sak.saksbehandler?.id !== innloggetAnsatt.id) {
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
        loading={loading}
        open={visVedtakModal}
        width="700px"
        bekreftButtonLabel="Innvilg søknaden"
        onBekreft={form.handleSubmit(opprettVedtak)}
        onClose={() => setVisVedtakModal(false)}
      >
        <Brødtekst spacing>
          Når du innvilger søknaden vil det opprettes en serviceforespørsel (SF) i OeBS. Innbygger kan se vedtaket på
          innlogget side på nav.no
        </Brødtekst>
        <FormProvider {...form}>
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
