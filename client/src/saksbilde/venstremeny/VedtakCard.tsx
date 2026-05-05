import { Button, Tag } from '@navikt/ds-react'
import { useState } from 'react'

import classes from './VedtakCard.module.css'

import { Knappepanel } from '../../felleskomponenter/Knappepanel'
import { Tekst } from '../../felleskomponenter/typografi'
import { type Oppgave } from '../../oppgave/oppgaveTypes.ts'
import { useOppgaveregler } from '../../oppgave/useOppgaveregler.ts'
import { useVedtak } from '../../sak/felles/useVedtak.ts'
import {
  type Behandling,
  isBehandlingsutfallHenleggelse,
  isBehandlingsutfallOverføring,
  isBehandlingsutfallVedtak,
} from '../../sak/v2/behandling/behandlingTyper.ts'
import { useUmami } from '../../sporing/useUmami.ts'
import { OppgaveStatusType, Sak } from '../../types/types.internal'
import { formaterDato, formaterTidsstempel } from '../../utils/dato'
import { formaterNavn } from '../../utils/formater'
import { FattVedtakModal } from '../modaler/FattVedtakModal.tsx'
import { OverførSakTilGosysModal } from '../OverførSakTilGosysModal.tsx'
import { useOverførSakTilGosys } from '../useOverførSakTilGosys.ts'
import { NotatUtkastVarsel } from './NotatUtkastVarsel.tsx'
import { VenstremenyCard } from './VenstremenyCard.tsx'

export interface VedtakCardProps {
  oppgave?: Oppgave
  gjeldendeBehandling?: Behandling
  sak: Sak
  harNotatUtkast?: boolean
}

export function VedtakCard(props: VedtakCardProps) {
  const { oppgave, gjeldendeBehandling, sak, harNotatUtkast = false } = props
  const {
    oppgaveErKlarTilBehandling,
    oppgaveErUnderBehandlingAvInnloggetAnsatt,
    oppgaveErUnderBehandlingAvAnnenAnsatt,
  } = useOppgaveregler(oppgave)
  const [visVedtakModal, setVisVedtakModal] = useState(false)
  const [submitAttempt, setSubmitAttempt] = useState(false)
  const { onOpen: visOverførGosys, ...overførGosys } = useOverførSakTilGosys('sak_overført_gosys_v1')
  const { logUtfallLavereRangert, logPostbegrunnelseEndret } = useUmami()

  const { lavereRangertHjelpemiddel, harEndretPostbegrunnelse } = useVedtak(sak)

  if (isBehandlingsutfallHenleggelse(gjeldendeBehandling?.utfall)) {
    return (
      <VenstremenyCard heading="Henlagt">
        <Tag data-color="info" data-cy="tag-soknad-status" variant="outline" size="small">
          Henlagt
        </Tag>
        <div className={classes.statusTekst}>
          <Tekst>{`${formaterTidsstempel(gjeldendeBehandling.ferdigstiltTidspunkt)}`}</Tekst>
        </div>
      </VenstremenyCard>
    )
  }

  // NB! Kun innvilgelse hvis ikke Hotsak 1.5
  if (isBehandlingsutfallVedtak(gjeldendeBehandling?.utfall)) {
    return (
      <VenstremenyCard heading="Vedtak">
        <Tag variant="outline" data-color="success" data-cy="tag-soknad-status" size="small">
          Innvilget
        </Tag>
        <div className={classes.statusTekst}>
          <Tekst>{`${formaterDato(gjeldendeBehandling.ferdigstiltTidspunkt)}`}</Tekst>
        </div>
      </VenstremenyCard>
    )
  }

  // NB! Eneste mulige overføring er overføring til Gosys
  if (isBehandlingsutfallOverføring(gjeldendeBehandling?.utfall)) {
    return (
      <VenstremenyCard heading="Overført">
        <Tag data-color="info" data-cy="tag-soknad-status" variant="outline" size="small">
          Overført til Gosys
        </Tag>
        <div className={classes.statusTekst}>
          <Tekst>{`${formaterTidsstempel(sak.saksstatusGyldigFra)}`}</Tekst>
          <Tekst>Saken er overført Gosys og behandles videre der.</Tekst>
        </div>
      </VenstremenyCard>
    )
  }

  // todo -> fjern denne, bør ikke kunne åpne sak som ikke er klar til behandling
  if (sak.saksstatus === OppgaveStatusType.AVVENTER_JOURNALFORING) {
    return (
      <VenstremenyCard heading="Avventer journalføring">
        <Tekst>Prøv igjen senere.</Tekst>
      </VenstremenyCard>
    )
  }

  if (oppgaveErKlarTilBehandling) {
    return (
      <VenstremenyCard heading="Sak ikke startet">
        <Tekst>Saken er ikke tildelt en saksbehandler ennå.</Tekst>
      </VenstremenyCard>
    )
  }

  if (oppgaveErUnderBehandlingAvAnnenAnsatt) {
    return (
      <VenstremenyCard heading="Saksbehandler">
        <Tekst>Saken er tildelt saksbehandler {formaterNavn(oppgave?.tildeltSaksbehandler?.navn)}.</Tekst>
      </VenstremenyCard>
    )
  }

  if (!oppgaveErUnderBehandlingAvInnloggetAnsatt) {
    return null
  }

  return (
    <VenstremenyCard>
      {submitAttempt && harNotatUtkast && <NotatUtkastVarsel />}
      <Knappepanel gap="space-0">
        <Button
          className={classes.knapp}
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
        </Button>
        <Button
          className={classes.knapp}
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
        </Button>
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
