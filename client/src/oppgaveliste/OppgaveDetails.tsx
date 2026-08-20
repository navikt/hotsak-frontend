import { ExternalLinkIcon } from '@navikt/aksel-icons'
import { BodyShort, HStack, InlineMessage, VStack } from '@navikt/ds-react'
import { type DataGridContentProps } from '../felleskomponenter/data/DataGrid.tsx'
import { FormatFødselsnummer } from '../felleskomponenter/format/FormatFødselsnummer.tsx'
import { FormatPersonnavn } from '../felleskomponenter/format/FormatPersonnavn.tsx'
import { IconLink } from '../felleskomponenter/IconLink.tsx'
import { Strek } from '../felleskomponenter/Strek.tsx'
import { type Oppgave, type OppgaveBruker, Oppgavetype } from '../oppgave/oppgaveTypes.ts'
import { useOppgaveUrl } from '../oppgave/useOppgaveUrl.ts'
import { useTilbakemeldinger } from '../saksbilde/useTilbakemeldinger.ts'
import { useInnloggetAnsatt } from '../tilgang/useTilgang.ts'
import { OppgaveStatusType, Sakstype } from '../types/types.internal.ts'
import { useMiljø } from '../utils/useMiljø.ts'
import { OppgaveDetailsItem } from './OppgaveDetailsItem.tsx'
import { OppgaveHjelpemidler } from './OppgaveHjelpemidler.tsx'
import { OppgaveSisteKommentar } from './OppgaveSisteKommentar.tsx'

export function OppgaveDetails({ row: oppgave }: DataGridContentProps<Oppgave>) {
  const oppgaveId = oppgave.oppgaveId
  const { kategorisering, bruker, sak } = oppgave
  const oppgaveUrl = useOppgaveUrl(oppgaveId)
  const { id: saksbehandlerId } = useInnloggetAnsatt()
  const isTildeltSaksbehandler = oppgave.tildeltSaksbehandler?.id === saksbehandlerId
  const tilbakemeldinger = useTilbakemeldinger(oppgave.sakId)
  const { erIkkeProd } = useMiljø()

  if (oppgave.sak?.saksstatus === OppgaveStatusType.SENDT_GOSYS && erIkkeProd) {
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
                {tilbakemelding.svar.map((svar) => (
                  <BodyShort key={svar} size="small">
                    {svar}
                  </BodyShort>
                ))}
              </VStack>
            ))}
          <BodyShort as={IconLink} icon={<ExternalLinkIcon />} href={oppgaveUrl} size="small" target="_blank" spacing>
            Åpne i Gosys
          </BodyShort>
        </div>
      </VStack>
    )
  }

  if (kategorisering.oppgavetype === Oppgavetype.JOURNALFØRING) {
    return (
      <VStack gap="space-20">
        <VStack gap="space-12">
          {isTildeltSaksbehandler && <OppgaveDetailsBruker bruker={bruker} />}
          <OppgaveDetailsItem label="Beskrivelse" value={oppgave.beskrivelse} />
        </VStack>
      </VStack>
    )
  }

  return (
    <VStack gap="space-20">
      <VStack gap="space-12">
        {isTildeltSaksbehandler && <OppgaveDetailsBruker bruker={bruker} />}
        {sak?.søknadGjelder && <OppgaveDetailsItem label="Beskrivelse" value={sak?.søknadGjelder} />}
        {sak?.sakstype !== Sakstype.BARNEBRILLER && <OppgaveHjelpemidler sakId={oppgave.sakId} />}
        <OppgaveSisteKommentar oppgaveId={oppgave.oppgaveId} />
        <div>
          <Strek />
          <BodyShort as={IconLink} icon={<ExternalLinkIcon />} href={oppgaveUrl} size="small" target="_blank" spacing>
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
      <HStack gap="space-12">
        <FormatPersonnavn size="small" value={bruker.navn} />
        <FormatFødselsnummer size="small" value={bruker.fnr} />
        {bruker.brukernummer && <BodyShort size="small">{bruker.brukernummer}</BodyShort>}
      </HStack>
    </OppgaveDetailsItem>
  )
}
