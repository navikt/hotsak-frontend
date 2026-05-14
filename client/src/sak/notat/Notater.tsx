import '@mdxeditor/editor/style.css'
import { Box, Loader, ToggleGroup, VStack } from '@navikt/ds-react'
import { useState } from 'react'

import type { Saksbehandlingsoppgave } from '../../oppgave/oppgaveTypes.ts'
import { useSakId } from '../../saksbilde/useSak.ts'
import { FerdigstilteNotater } from './FerdigstilteNotater.tsx'
import classes from './Notater.module.css'
import { Notatinformasjon } from './Notatinformasjon.tsx'
import { NotatType } from './notatTyper.ts'
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
  const { notater, mutate: mutateNotater, isLoading: notaterLaster, finnAktivtUtkast } = useNotater(sakId)
  const [notatType, setNotatType] = useState<NotatType>(NotatType.KOMMENTAR)

  const aktivtUtkast = finnAktivtUtkast(notatType)

  return (
    <>
      <VStack gap="space-8">
        <Notatinformasjon />
        <Box paddingBlock="space-24 space-0">
          <ToggleGroup
            size="small"
            value={notatType}
            label="Opprett nytt notat"
            onChange={(type) => setNotatType(type as NotatType)}
          >
            <ToggleGroup.Item value={NotatType.KOMMENTAR} label="Kommentar" />
            <ToggleGroup.Item value={NotatType.JOURNALFØRT} label="Forvaltningsnotat" />
          </ToggleGroup>
        </Box>
      </VStack>
      {notaterLaster && (
        <div>
          <Loader size="large" className={classes.loader} />
        </div>
      )}
      {oppgave && <OpprettNotat type={notatType} oppgave={oppgave} aktivtUtkast={aktivtUtkast} />}
      <FerdigstilteNotater
        oppgaveId={oppgave?.oppgaveId}
        loading={notaterLaster}
        notater={notater}
        mutateNotater={mutateNotater}
      />
    </>
  )
}
