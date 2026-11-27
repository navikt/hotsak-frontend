import { BodyShort, HStack, InlineMessage, Link, VStack } from '@navikt/ds-react'
import type { ReactNode } from 'react'

import { type DataGridContentProps } from '../felleskomponenter/data/DataGrid.tsx'
import { FormatFødselsnummer } from '../felleskomponenter/format/FormatFødselsnummer.tsx'
import { FormatPersonnavn } from '../felleskomponenter/format/FormatPersonnavn.tsx'
import { Strek } from '../felleskomponenter/Strek.tsx'
import { type Oppgave, type OppgaveBruker, Oppgavetype } from '../oppgave/oppgaveTypes.ts'
import { useOppgaveUrl } from '../oppgave/useOppgaveUrl.ts'
import { useTilbakemeldinger } from '../saksbilde/useTilbakemeldinger.ts'
import { useInnloggetAnsatt } from '../tilgang/useTilgang.ts'
import { Saksstatus, Sakstype } from '../types/types.internal.ts'
import { OppgaveDetailsDokumenter } from './OppgaveDetailsDokumenter.tsx'
import { OppgaveDetailsHjelpemidler } from './OppgaveDetailsHjelpemidler.tsx'
import { OppgaveDetailsItem } from './OppgaveDetailsItem.tsx'
import { OppgaveSisteKommentar } from './OppgaveSisteKommentar.tsx'
import { useLocation } from 'react-router'

export interface OppgaveDetailsProps extends DataGridContentProps<Oppgave> {
  children?: ReactNode
}

export function OppgaveDetails(props: OppgaveDetailsProps) {
  const { row: oppgave, children } = props
  const oppgaveId = oppgave.oppgaveId
  const { kategorisering, bruker, sak, sakId } = oppgave
  const oppgaveUrl = useOppgaveUrl(oppgaveId)
  const { id: saksbehandlerId } = useInnloggetAnsatt()
  const location = useLocation()
  const visBruker =
    oppgave.tildeltSaksbehandler?.id === saksbehandlerId && !location.pathname.includes('personoversikt')

  if (oppgave.sak?.saksstatus === Saksstatus.OVERFØRT_GOSYS) {
    return <OppgaveDetailsSakOverførtGosys sakId={oppgave.sakId} oppgaveUrl={oppgaveUrl} />
  }

  if (kategorisering.oppgavetype === Oppgavetype.JOURNALFØRING) {
    return (
      <VStack gap="space-20">
        <VStack gap="space-12">{visBruker && <OppgaveDetailsBruker bruker={bruker} />}</VStack>
      </VStack>
    )
  }

  return (
    <VStack gap="space-20">
      <VStack gap="space-12">
        {visBruker && <OppgaveDetailsBruker bruker={bruker} />}
        {sakId && <OppgaveDetailsDokumenter sakId={sakId} />}
        {sak?.sakstype !== Sakstype.BARNEBRILLER && <OppgaveDetailsHjelpemidler sakId={sakId} />}
        {children}
        <OppgaveSisteKommentar oppgaveId={oppgave.oppgaveId} />
        <div>
          <Strek />
          <BodyShort as={Link} href={oppgaveUrl} size="small" target="_blank" spacing>
            Åpne i Gosys
          </BodyShort>
        </div>
      </VStack>
    </VStack>
  )
}

function OppgaveDetailsSakOverførtGosys({ sakId, oppgaveUrl }: { sakId?: string; oppgaveUrl?: string }) {
  const tilbakemeldinger = useTilbakemeldinger(sakId)
  return (
    <VStack gap="space-12">
      <InlineMessage size="small" status="info">
        Oppgaven er overført til Gosys
      </InlineMessage>
      <div>
        {tilbakemeldinger.isLoading && <BodyShort>Laster overføringsgrunn...</BodyShort>}
        {tilbakemeldinger.grupperteOverførtGosysTilbakemeldinger.length > 0 &&
          tilbakemeldinger.grupperteOverførtGosysTilbakemeldinger.map((tilbakemelding) => (
            <VStack
              key={`${tilbakemelding.sti.join('>')}|${tilbakemelding.spørsmål}`}
              gap="space-2"
              marginBlock="space-0 space-16"
            >
              <BodyShort size="small">
                <strong>{tilbakemelding.spørsmål}</strong>
              </BodyShort>
              {tilbakemelding.svar.length > 1 ? (
                <ul style={{ margin: '0' }}>
                  {tilbakemelding.svar.map((svar, index) => (
                    <BodyShort key={`${tilbakemelding.spørsmål}-${svar}-${index}`} as="li" size="small">
                      {svar}
                    </BodyShort>
                  ))}
                </ul>
              ) : (
                tilbakemelding.svar[0] && <BodyShort size="small">{tilbakemelding.svar[0]}</BodyShort>
              )}
            </VStack>
          ))}
        <BodyShort as={Link} href={oppgaveUrl} size="small" target="_blank" spacing>
          Åpne i Gosys
        </BodyShort>
      </div>
    </VStack>
  )
}

function OppgaveDetailsBruker({ bruker }: { bruker?: OppgaveBruker }) {
  if (!bruker) return null
  return (
    <OppgaveDetailsItem label="Bruker">
      <HStack gap="space-12">
        <FormatPersonnavn size="small" value={bruker.navn} />
        <FormatFødselsnummer size="small" value={bruker.fnr} />
        {bruker.brukernummer && <BodyShort size="small">{bruker.brukernummer}</BodyShort>}
      </HStack>
    </OppgaveDetailsItem>
  )
}
