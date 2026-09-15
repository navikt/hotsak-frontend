import { BodyShort, Box, Button, ErrorMessage, Heading, HGrid, HStack, Loader, Tag, VStack } from '@navikt/ds-react'
import { useState } from 'react'

import { GOSYS_GENERELL_SAK, type Sakvalg } from './journalføringValg.ts'
import { MAKS_SAKER_SYNLIG, type SakvalgVisning } from './useKobleTilSak.ts'
import { type HttpError } from '../io/HttpError.ts'
import { OmrådeFilterLabel, OppgaveStatusLabel } from '../types/types.internal.ts'
import { formaterDato } from '../utils/dato.ts'
import classes from './KobleTilSakKort.module.css'
import { Sakstype } from './journalføringTypes.ts'

interface KobleTilSakKortProps {
  saker: SakvalgVisning[]
  isLoading: boolean
  error?: HttpError
  valgtSak: Sakvalg | null
  onChange: (sak: Sakvalg | null) => void
  feilmelding?: string
}

function formaterOmråde(område: string[]): string {
  return område
    .map((o) => OmrådeFilterLabel.get(o) ?? o)
    .filter(Boolean)
    .join(', ')
}

const GOSYS_GENERELL_SAK_VISNING: SakvalgVisning = {
  valg: GOSYS_GENERELL_SAK,
  sakId: '',
  gjelder: 'Gosys generell',
  dato: '',
  fagsystemLabel: 'Fagsak system',
}

export function KobleTilSakKort({ saker, isLoading, error, valgtSak, onChange, feilmelding }: KobleTilSakKortProps) {
  const [visAlle, setVisAlle] = useState(false)
  const synligeSaker = visAlle ? saker : saker.slice(0, MAKS_SAKER_SYNLIG)
  const harFlere = saker.length > MAKS_SAKER_SYNLIG

  return (
    <VStack gap="space-4" className={classes.kortListe}>
      <SakKort
        sak={GOSYS_GENERELL_SAK_VISNING}
        valgt={valgtSak?.sakstype === Sakstype.GENERELL_SAK}
        onVelg={() => onChange(GOSYS_GENERELL_SAK)}
      />
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

interface SakKortProps {
  sak: SakvalgVisning
  valgt: boolean
  onVelg: () => void
}

function SakKort({ sak, valgt, onVelg }: SakKortProps) {
  const erGenerellSak = sak.valg.sakstype === Sakstype.GENERELL_SAK
  const område = sak.område ? formaterOmråde(sak.område) : ''
  const statusLabel = sak.saksstatus ? (OppgaveStatusLabel.get(sak.saksstatus) ?? sak.saksstatus) : null

  return (
    <Box
      as="label"
      borderRadius="12"
      borderWidth="2"
      borderColor={valgt ? 'info' : 'neutral-subtleA'}
      padding="space-12"
      className={classes.kortLabel}
    >
      <HStack gap="space-8" align="start" wrap={false}>
        <input
          type="radio"
          name="valgtSak"
          value={
            sak.valg.sakstype === Sakstype.GENERELL_SAK ? sak.valg.sakstype : `${sak.valg.fagsaksystem}-${sak.sakId}`
          }
          checked={valgt}
          onChange={onVelg}
          className={classes.radioInput}
          aria-label={erGenerellSak ? `Velg ${sak.gjelder}` : `Velg sak ${sak.sakId}: ${sak.gjelder}`}
        />
        <VStack gap="space-4" className={classes.kortInnhold}>
          {erGenerellSak ? (
            <VStack gap="space-1">
              <BodyShort>{sak.gjelder}</BodyShort>
              <BodyShort>{sak.fagsystemLabel}</BodyShort>
            </VStack>
          ) : (
            <>
              <HGrid columns="1fr 10rem" gap="space-8" align="start">
                <VStack gap="space-1">
                  <Heading level="3" size="xsmall">
                    {sak.gjelder}
                  </Heading>
                  <HStack gap="space-4" align="center">
                    <BodyShort size="small">
                      <strong>Sak:</strong>
                    </BodyShort>
                    <BodyShort>{sak.sakId}</BodyShort>
                  </HStack>
                  <HStack gap="space-4" align="center">
                    <BodyShort>
                      <strong>Fagsystem:</strong>
                    </BodyShort>
                    <BodyShort>{sak.fagsystemLabel}</BodyShort>
                  </HStack>
                </VStack>
                <VStack gap="space-1">
                  <span>
                    {statusLabel && (
                      <Tag variant="moderate" data-color="info" size="small">
                        {statusLabel}
                      </Tag>
                    )}
                  </span>
                  <BodyShort size="small">
                    <strong>Dato:</strong> {formaterDato(sak.dato)}
                  </BodyShort>
                </VStack>
              </HGrid>
              {område && (
                <BodyShort size="small">
                  <strong>Område:</strong> {område}
                </BodyShort>
              )}
            </>
          )}
        </VStack>
      </HStack>
    </Box>
  )
}
