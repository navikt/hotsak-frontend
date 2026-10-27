import { BodyShort, Detail, Heading, HStack } from '@navikt/ds-react'
import { useMemo } from 'react'

import { FormatDateTime } from '../felleskomponenter/format/FormatDateTime.tsx'
import { useOppgavekommentarer } from '../oppgave/kommentar/useOppgavekommentarer.ts'
import { type Oppgave, type OppgaveId } from '../oppgave/oppgaveTypes.ts'
import { utførtAvNavn } from '../tilgang/UtførtAv.ts'
import { sorterKronologiskSynkende } from '../utils/dato.ts'
import classes from './KobleTilSakKort.module.css'

export function OppgaveDetaljer({ oppgave }: { oppgave: Oppgave }) {
  const { behandlingstema, behandlingstype } = oppgave.kategorisering
  const gjelder = [behandlingstema?.term, behandlingstype?.term].filter(Boolean).join(' | ')

  return (
    <div className={classes.oppgaveSeksjon}>
      {gjelder && (
        <BodyShort size="small">
          <strong>Gjelder:</strong> {gjelder}
        </BodyShort>
      )}
      <Oppgavekommentarer oppgaveId={oppgave.oppgaveId} />
    </div>
  )
}

function Oppgavekommentarer({ oppgaveId }: { oppgaveId: OppgaveId }) {
  const { kommentarer, isLoading, error } = useOppgavekommentarer(oppgaveId)
  const sorterteKommentarer = useMemo(
    () => kommentarer.toSorted((a, b) => sorterKronologiskSynkende(a.registrertTidspunkt, b.registrertTidspunkt)),
    [kommentarer]
  )

  if (error || (!isLoading && sorterteKommentarer.length === 0)) return null

  return (
    <div className={classes.kommentarSeksjon}>
      <Heading level="3" size="xsmall" spacing>
        Kommentarer
      </Heading>
      {isLoading ? (
        <BodyShort size="small">Henter kommentarer...</BodyShort>
      ) : (
        <ul className={classes.kommentarListe} role="list">
          {sorterteKommentarer.map((kommentar, index) => (
            <li
              key={`${kommentar.oppgaveId}-${kommentar.registrertTidspunkt}-${kommentar.tekst}-${index}`}
              className={classes.kommentar}
            >
              <HStack gap="space-4" wrap>
                {kommentar.registrertAv && <Detail>{utførtAvNavn(kommentar.registrertAv)}</Detail>}
                {kommentar.registrertAvEnhet && <Detail>{kommentar.registrertAvEnhet.navn}</Detail>}
                <Detail>
                  <FormatDateTime dateTime={kommentar.registrertTidspunkt} />
                </Detail>
              </HStack>
              <BodyShort size="small">{kommentar.tekst}</BodyShort>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
