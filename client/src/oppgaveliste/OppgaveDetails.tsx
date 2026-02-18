import { BodyShort, HStack, Link, VStack } from '@navikt/ds-react'

import { FormatFødselsnummer } from '../felleskomponenter/format/FormatFødselsnummer.tsx'
import { FormatPersonnavn } from '../felleskomponenter/format/FormatPersonnavn.tsx'
import { Strek } from '../felleskomponenter/Strek.tsx'
import { type Oppgave, type OppgaveBruker, oppgaveIdUtenPrefix, Oppgavetype } from '../oppgave/oppgaveTypes.ts'
import { useInnloggetAnsatt } from '../tilgang/useTilgang.ts'
import { Sakstype } from '../types/types.internal.ts'
import { useMiljø } from '../utils/useMiljø.ts'
import { OppgaveDetailsItem } from './OppgaveDetailsItem.tsx'
import { OppgaveHjelpemidler } from './OppgaveHjelpemidler.tsx'
import { OppgaveSisteKommentar } from './OppgaveSisteKommentar.tsx'

export interface OppgaveDetailsProps {
  oppgave: Oppgave
  visible?: boolean
}

export function OppgaveDetails({ oppgave, visible }: OppgaveDetailsProps) {
  const oppgaveId = oppgaveIdUtenPrefix(oppgave.oppgaveId)
  const { kategorisering, bruker, sak } = oppgave
  const oppgaveUrl = useOppgaveUrl(oppgaveId)
  const { id: saksbehandlerId } = useInnloggetAnsatt()
  const isTildeltSaksbehandler = oppgave.tildeltSaksbehandler?.id === saksbehandlerId

  if (kategorisering.oppgavetype === Oppgavetype.JOURNALFØRING) {
    return (
      <VStack gap="5">
        <VStack gap="3">
          {isTildeltSaksbehandler && <OppgaveDetailsBruker bruker={bruker} />}
          <OppgaveDetailsItem label="Beskrivelse" value={oppgave.beskrivelse} />
        </VStack>
      </VStack>
    )
  }

  return (
    <VStack gap="5">
      <VStack gap="3">
        {isTildeltSaksbehandler && <OppgaveDetailsBruker bruker={bruker} />}
        {sak?.søknadGjelder && <OppgaveDetailsItem label="Beskrivelse" value={sak?.søknadGjelder} />}
        {sak?.sakstype !== Sakstype.BARNEBRILLER && <OppgaveHjelpemidler sakId={visible ? oppgave.sakId : null} />}
        <OppgaveSisteKommentar oppgaveId={visible ? oppgave.oppgaveId : null} />
        <div>
          <Strek />
          <BodyShort as={Link} href={oppgaveUrl} size="small" target="_blank" variant="subtle" spacing>
            Åpne i Gosys
          </BodyShort>
        </div>
      </VStack>
    </VStack>
  )
}

function OppgaveDetailsBruker({ bruker }: { bruker?: OppgaveBruker }) {
  if (!bruker) return null
  return (
    <OppgaveDetailsItem label="Bruker">
      <HStack gap="3">
        <FormatPersonnavn size="small" value={bruker.navn} />
        <FormatFødselsnummer size="small" value={bruker.fnr} />
        {bruker.brukernummer && <BodyShort size="small">{bruker.brukernummer}</BodyShort>}
      </HStack>
    </OppgaveDetailsItem>
  )
}

function useOppgaveUrl(oppgaveId: string) {
  const { erProd } = useMiljø()
  let host: string
  if (erProd) {
    host = 'gosys.intern.nav.no'
  } else {
    host = 'gosys-q2.dev.intern.nav.no'
  }
  return `https://${host}/gosys/oppgavebehandling/oppgave/${oppgaveId}`
}
