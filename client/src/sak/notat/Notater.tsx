import '@mdxeditor/editor/style.css'
import { BodyShort, Label, VStack } from '@navikt/ds-react'

import { type Saksbehandlingsoppgave } from '../../oppgave/oppgaveTypes.ts'
import { useOppgaveregler } from '../../oppgave/useOppgaveregler.ts'
import { useSakId } from '../../saksbilde/useSak.ts'
import { FerdigstilteNotater } from './FerdigstilteNotater.tsx'
import { Notatinformasjon } from './Notatinformasjon.tsx'
import { OpprettNotat } from './OpprettNotat.tsx'
import { useNotater } from './useNotater.tsx'

export interface NotaterProps {
  oppgave?: Saksbehandlingsoppgave
}

export function Notater(props: NotaterProps) {
  const { oppgave } = props
  const sakId = useSakId(oppgave)
  const { oppgaveErUnderBehandlingAvInnloggetAnsatt, oppgaveErAvsluttet } = useOppgaveregler(oppgave)
  const { notater, isLoading: notaterIsLoading, gjeldendeUtkast, opprettNotat } = useNotater(sakId)

  if (!oppgave || oppgaveErAvsluttet) {
    return (
      <VStack gap="space-16" paddingBlock="space-12">
        <Notatinformasjon />
        <FerdigstilteNotater oppgaveId={oppgave?.oppgaveId} loading={notaterIsLoading} notater={notater.ferdigstilte} />
      </VStack>
    )
  }

  return (
    <VStack gap="space-16" paddingBlock="space-12">
      <Notatinformasjon />
      {oppgaveErUnderBehandlingAvInnloggetAnsatt ? (
        <OpprettNotat oppgave={oppgave} opprettNotat={opprettNotat} gjeldendeUtkast={gjeldendeUtkast} />
      ) : (
        <div>
          <Label as="div" size="small" spacing>
            Opprett nytt notat
          </Label>
          <BodyShort size="small">Saken er i lesevisning. Du må ta saken for å kunne opprette notater.</BodyShort>
        </div>
      )}
      <FerdigstilteNotater oppgaveId={oppgave.oppgaveId} loading={notaterIsLoading} notater={notater.ferdigstilte} />
    </VStack>
  )
}
