import { InformationSquareIcon } from '@navikt/aksel-icons'
import { BodyShort, Detail, HStack, Loader, VStack } from '@navikt/ds-react'

import { FormatDateTime } from '../../felleskomponenter/format/FormatDateTime.tsx'
import { Strek } from '../../felleskomponenter/Strek.tsx'
import { type OppgaveId } from '../../oppgave/oppgaveTypes.ts'
import { OppgaveDetailsItem } from './OppgaveDetailsItem.tsx'
import { useOppgavekommentarer } from './useOppgavekommentarer.ts'

export interface OppgaveSisteKommentarProps {
  oppgaveId?: Nullable<OppgaveId>
}

export function OppgaveSisteKommentar(props: OppgaveSisteKommentarProps) {
  const { oppgaveId } = props
  const { data: kommentarer = [], isLoading } = useOppgavekommentarer(oppgaveId)
  const sisteKommentar = kommentarer[0]
  return (
    <div>
      <Strek />
      <OppgaveDetailsItem label="Siste kommentar">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {sisteKommentar ? (
              <VStack gap="2">
                <HStack gap="2" align="center">
                  <Detail>{sisteKommentar.registrertAv}</Detail>
                  <Detail>|</Detail>
                  <Detail>{sisteKommentar.registrertAvEnhetsnummer}</Detail>
                  <Detail>|</Detail>
                  <Detail>
                    <FormatDateTime dateTime={sisteKommentar.registrertTidspunkt} />
                  </Detail>
                </HStack>
                <BodyShort size="small">{sisteKommentar.tekst}</BodyShort>
              </VStack>
            ) : (
              <HStack gap="2" align="center">
                <InformationSquareIcon />
                <BodyShort size="small">Det er ingen kommentarer til oppgaven</BodyShort>
              </HStack>
            )}
          </>
        )}
      </OppgaveDetailsItem>
    </div>
  )
}
