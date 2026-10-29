import { BodyShort, Box, Button, ErrorMessage, HStack, Loader, VStack } from '@navikt/ds-react'
import { useState } from 'react'

import { type HttpError } from '../io/HttpError.ts'
import { usePersonContext } from '../personoversikt/PersonContext.tsx'
import classes from './KobleTilSakKort.module.css'
import { GOSYS_GENERELL_SAK, type Sakvalg } from './journalføringValg.ts'
import { Sakstype } from './journalføringTypes.ts'
import { SakKort } from './SakKort.tsx'
import { useJournalposterPerSak } from './useJournalposterPerSak.ts'
import { MAKS_SAKER_SYNLIG, type SakvalgVisning } from './useKobleTilSak.ts'
import { useOppgaverPerSak } from './useOppgaverPerSak.ts'

interface KobleTilSakKortProps {
  saker: SakvalgVisning[]
  isLoading: boolean
  error?: HttpError
  valgtSak: Sakvalg | null
  onChange: (sak: Sakvalg | null) => void
  feilmelding?: string
}

export function KobleTilSakKort({ saker, isLoading, error, valgtSak, onChange, feilmelding }: KobleTilSakKortProps) {
  const [visAlle, setVisAlle] = useState(false)
  const { fodselsnummer } = usePersonContext()
  const { oppgaverPerSak, oppgaverFeil } = useOppgaverPerSak(fodselsnummer)
  const {
    journalposterPerSak,
    isLoading: journalposterLaster,
    error: journalposterFeil,
  } = useJournalposterPerSak(fodselsnummer)
  const synligeSaker = visAlle ? saker : saker.slice(0, MAKS_SAKER_SYNLIG)
  const harFlere = saker.length > MAKS_SAKER_SYNLIG

  return (
    <VStack gap="space-4" className={classes.kortListe}>
      <Box
        as="label"
        borderRadius="12"
        borderWidth="2"
        borderColor={valgtSak?.sakstype === Sakstype.GENERELL_SAK ? 'info' : 'neutral-subtleA'}
        padding="space-12"
        className={`${classes.sakKort} ${classes.generellSak}`}
      >
        <input
          type="radio"
          name="valgtSak"
          value={GOSYS_GENERELL_SAK.sakstype}
          checked={valgtSak?.sakstype === Sakstype.GENERELL_SAK}
          onChange={() => onChange(GOSYS_GENERELL_SAK)}
          className={classes.radioInput}
          aria-label="Velg Generell sak"
        />
        <BodyShort size="small">Generell sak</BodyShort>
      </Box>
      {isLoading && (
        <HStack gap="space-4" align="center">
          <Loader size="small" title="Henter saker..." />
          <BodyShort size="small">Henter saker...</BodyShort>
        </HStack>
      )}
      {error && <ErrorMessage>Feil med hending av saker</ErrorMessage>}
      {!isLoading && !error && saker.length === 0 && (
        <BodyShort size="small">Ingen saker funnet for denne brukeren.</BodyShort>
      )}
      {!isLoading &&
        !error &&
        synligeSaker.map((sak) => (
          <SakKort
            key={`${sak.valg.sakstype}-${sak.sakId}-${sak.valg.sakstype === Sakstype.FAGSAK ? sak.valg.fagsaksystem : ''}`}
            sak={sak}
            valgt={
              sak.valg.sakstype === Sakstype.FAGSAK &&
              valgtSak?.sakstype === Sakstype.FAGSAK &&
              sak.valg.fagsaksystem === valgtSak.fagsaksystem &&
              sak.sakId === valgtSak.sakId
            }
            onVelg={() => onChange(sak.valg)}
            journalposter={journalposterPerSak.get(sak.sakId) ?? []}
            journalposterLaster={journalposterLaster}
            journalposterFeil={journalposterFeil}
            oppgave={!oppgaverFeil ? oppgaverPerSak.get(sak.sakId) : undefined}
          />
        ))}
      {!isLoading && !error && harFlere && (
        <Button variant="tertiary" size="small" type="button" onClick={() => setVisAlle((forrige) => !forrige)}>
          {visAlle ? 'Vis færre' : `Vis alle (${saker.length})`}
        </Button>
      )}
      <div role="alert" aria-live="polite">
        {feilmelding && <ErrorMessage size="small">{feilmelding}</ErrorMessage>}
      </div>
    </VStack>
  )
}
