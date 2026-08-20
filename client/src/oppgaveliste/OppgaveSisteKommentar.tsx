import { InformationSquareIcon } from '@navikt/aksel-icons'
import { BodyShort, Detail, HStack, Loader, VStack } from '@navikt/ds-react'

import { joinElements } from '../felleskomponenter/elements.ts'
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

  const detaljer = sisteKommentar
    ? [
        sisteKommentar.registrertAv && <Detail key="registrertAv">{utførtAvNavn(sisteKommentar.registrertAv)}</Detail>,
        sisteKommentar.registrertAvEnhet && (
          <Detail key="registrertAvEnhet">{sisteKommentar.registrertAvEnhet.navn}</Detail>
        ),
        <Detail key="registrertTidspunkt">
          <FormatDateTime dateTime={sisteKommentar.registrertTidspunkt} />
        </Detail>,
      ].filter(Boolean)
    : []

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
                  {joinElements(detaljer, <Detail>|</Detail>)}
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
