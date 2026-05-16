import { InformationSquareIcon } from '@navikt/aksel-icons'
import { BodyShort, Detail, HStack, Loader, VStack } from '@navikt/ds-react'

import { FormatDateTime } from '../felleskomponenter/format/FormatDateTime.tsx'
import { Strek } from '../felleskomponenter/Strek.tsx'
import { useOppgavekommentarer } from '../oppgave/kommentar/useOppgavekommentarer.ts'
import { type OppgaveId } from '../oppgave/oppgaveTypes.ts'
import { utførtAvNavn } from '../tilgang/UtførtAv.ts'
import { OppgaveDetailsItem } from './OppgaveDetailsItem.tsx'

export interface OppgaveSisteKommentarProps {
  oppgaveId: OppgaveId
}

export function OppgaveSisteKommentar(props: OppgaveSisteKommentarProps) {
  const { oppgaveId } = props
  const { kommentarer = [], isLoading } = useOppgavekommentarer(oppgaveId)
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
              <VStack gap="space-8">
                <HStack gap="space-8" align="center">
                  <Detail>{utførtAvNavn(sisteKommentar.registrertAv)}</Detail>
                  <Detail>|</Detail>
                  <Detail>{sisteKommentar.registrertAvEnhet.navn}</Detail>
                  <Detail>|</Detail>
                  <Detail>
                    <FormatDateTime dateTime={sisteKommentar.registrertTidspunkt} />
                  </Detail>
                </HStack>
                <BodyShort size="small">{sisteKommentar.tekst}</BodyShort>
              </VStack>
            ) : (
              <HStack gap="space-8" align="center">
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
