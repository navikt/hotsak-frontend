import { Button, Tag } from '@navikt/ds-react'
import { useState } from 'react'
import styled from 'styled-components'

import { Knappepanel } from '../../felleskomponenter/Knappepanel'
import { Tekst } from '../../felleskomponenter/typografi'
import { OppgavetildelingKonfliktModal } from '../../oppgave/OppgavetildelingKonfliktModal.tsx'
import { OvertaOppgaveModal } from '../../oppgave/OvertaOppgaveModal.tsx'
import { useOppgaveActions } from '../../oppgave/useOppgaveActions.ts'
import { useVedtak } from '../../sak/felles/useVedtak.ts'
import { useUmami } from '../../sporing/useUmami.ts'
import { useInnloggetAnsatt } from '../../tilgang/useTilgang.ts'
import { OppgaveStatusType, Sak, VedtakStatusType } from '../../types/types.internal'
import { formaterDato, formaterTidsstempel } from '../../utils/dato'
import { formaterNavn } from '../../utils/formater'
import { FattVedtakModal } from '../modaler/FattVedtakModal.tsx'
import { OverførSakTilGosysModal } from '../OverførSakTilGosysModal.tsx'
import { TaOppgaveISakButton } from '../TaOppgaveISakButton.tsx'
import { useOverførSakTilGosys } from '../useOverførSakTilGosys.ts'
import { NotatUtkastVarsel } from './NotatUtkastVarsel.tsx'
import { VenstremenyCard } from './VenstremenyCard.tsx'

export interface VedtakCardProps {
  sak: Sak
  harNotatUtkast?: boolean
  lesevisning: boolean
}

export function VedtakCard({ sak, lesevisning, harNotatUtkast = false }: VedtakCardProps) {
  const innloggetAnsatt = useInnloggetAnsatt()
  const [visVedtakModal, setVisVedtakModal] = useState(false)
  const [visOvertaSakModal, setVisOvertaSakModal] = useState(false)
  const [submitAttempt, setSubmitAttempt] = useState(false)
  const [visTildelSakKonfliktModalForSak, setVisTildelSakKonfliktModalForSak] = useState(false)
  const { onOpen: visOverførGosys, ...overførGosys } = useOverførSakTilGosys('sak_overført_gosys_v1')
  const oppgaveActions = useOppgaveActions()
  const { logUtfallLavereRangert, logPostbegrunnelseEndret } = useUmami()

  const { lavereRangertHjelpemiddel, harEndretPostbegrunnelse } = useVedtak(sak)

  const overtaSak = async () => {
    await oppgaveActions.endreOppgavetildeling({ overtaHvisTildelt: true })
    setVisOvertaSakModal(false)
  }

  if (sak.saksstatus === OppgaveStatusType.HENLAGT) {
    return (
      <VenstremenyCard heading="Henlagt">
        <Tag data-color="info" data-cy="tag-soknad-status" variant="outline" size="small">
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
        <Tag variant="outline" data-color="success" data-cy="tag-soknad-status" size="small">
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
        <Tag data-color="info" data-cy="tag-soknad-status" variant="outline" size="small">
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
      <FattVedtakModal sak={sak} open={visVedtakModal} onClose={() => setVisVedtakModal(false)} />
      <OverførSakTilGosysModal
        {...overførGosys}
        onBekreft={async (tilbakemelding) => {
          if (lavereRangertHjelpemiddel) {
            logUtfallLavereRangert({ utfall: 'overført_gosys' })
            if (harEndretPostbegrunnelse()) logPostbegrunnelseEndret()
          }
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
