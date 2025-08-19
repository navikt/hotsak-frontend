import { Button, HelpText, HStack, Tag, TextField } from '@navikt/ds-react'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import styled from 'styled-components'

import { Knappepanel } from '../../felleskomponenter/Knappepanel'
import { Brødtekst, Etikett, Tekst } from '../../felleskomponenter/typografi'
import { OppgavetildelingKonfliktModal } from '../../oppgave/OppgavetildelingKonfliktModal.tsx'
import { OvertaOppgaveModal } from '../../oppgave/OvertaOppgaveModal.tsx'
import { useOppgaveActions } from '../../oppgave/useOppgaveActions.ts'
import { useInnloggetAnsatt } from '../../tilgang/useTilgang.ts'
import { OppgaveStatusType, Sak, VedtakStatusType } from '../../types/types.internal'
import { formaterDato, formaterTidsstempel } from '../../utils/dato'
import { formaterNavn, storForbokstavIAlleOrd } from '../../utils/formater'
import { BekreftelseModal } from '../komponenter/BekreftelseModal'
import { mutateSak } from '../mutateSak.ts'
import { OverførSakTilGosysModal } from '../OverførSakTilGosysModal.tsx'
import { TaOppgaveISakButton } from '../TaOppgaveISakButton.tsx'
import { useOverførSakTilGosys } from '../useOverførSakTilGosys.ts'
import { useSakActions } from '../useSakActions.ts'
import { NotatUtkastVarsel } from './NotatUtkastVarsel.tsx'
import { VenstremenyCard } from './VenstremenyCard.tsx'

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
  const [visVedtakModal, setVisVedtakModal] = useState(false)
  const [visOvertaSakModal, setVisOvertaSakModal] = useState(false)
  const [submitAttempt, setSubmitAttempt] = useState(false)
  const [visTildelSakKonfliktModalForSak, setVisTildelSakKonfliktModalForSak] = useState(false)
  const { onOpen: visOverførGosys, ...overførGosys } = useOverførSakTilGosys(sakId, 'sak_overført_gosys_v1')
  const oppgaveActions = useOppgaveActions()
  const sakActions = useSakActions()

  const form = useForm<VedtakFormValues>({
    defaultValues: {
      problemsammendrag: `${storForbokstavIAlleOrd(sak.søknadGjelder.replace('Søknad om:', '').trim())}; ${sakId}`,
    },
  })

  const fattVedtak = async (data: VedtakFormValues) => {
    await sakActions.fattVedtak(data.problemsammendrag)
    setVisVedtakModal(false)
    return mutateSak(sakId)
  }

  const overtaSak = async () => {
    await oppgaveActions.endreOppgavetildeling({ overtaHvisTildelt: true })
    setVisOvertaSakModal(false)
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
            <TaOppgaveISakButton sakId={sakId} />
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
