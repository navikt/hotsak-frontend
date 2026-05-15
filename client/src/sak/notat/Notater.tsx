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

export interface NotatFormValues {
  tittel: string
  tekst: string
}

export function Notater(props: NotaterProps) {
  const { oppgave } = props
  const sakId = useSakId(oppgave)
  const { oppgaveErUnderBehandlingAvInnloggetAnsatt, oppgaveErAvsluttet } = useOppgaveregler(oppgave)
  const { notater, mutate: mutateNotater, isLoading: notaterLaster, finnAktivtUtkast } = useNotater(sakId)

  if (!oppgave || oppgaveErAvsluttet) {
    return (
      <VStack gap="space-16">
        <Notatinformasjon />
        <FerdigstilteNotater
          oppgaveId={oppgave?.oppgaveId}
          loading={notaterLaster}
          notater={notater}
          mutateNotater={mutateNotater}
        />
      </VStack>
    )
  }

  return (
    <VStack gap="space-16">
      <Notatinformasjon />
      {oppgaveErUnderBehandlingAvInnloggetAnsatt ? (
        <OpprettNotat oppgave={oppgave} finnAktivtUtkast={finnAktivtUtkast} />
      ) : (
        <div>
          <Label as="div" size="small" spacing>
            Opprett nytt notat
          </Label>
          <BodyShort size="small">Saken er i lesevisning. Du må ta saken for å kunne opprette notater.</BodyShort>
        </div>
      )}
      <FerdigstilteNotater
        oppgaveId={oppgave.oppgaveId}
        loading={notaterLaster}
        notater={notater}
        mutateNotater={mutateNotater}
      />
    </VStack>
  )
}
