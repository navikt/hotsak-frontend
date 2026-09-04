import { BodyShort, Box, Button, ErrorMessage, Heading, HGrid, HStack, Loader, Tag, VStack } from '@navikt/ds-react'

import { type Sakvalg, type SakvalgVisning, useKobleTilSak } from './useKobleTilSak.ts'
import { OmrådeFilterLabel, OppgaveStatusLabel } from '../types/types.internal.ts'
import { formaterDato } from '../utils/dato.ts'
import classes from './KobleTilSakKort.module.css'

interface KobleTilSakKortProps {
  fnr: string
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

export function KobleTilSakKort({ fnr, valgtSak, onChange, feilmelding }: KobleTilSakKortProps) {
  const { synligeSaker, alleSaker, isLoading, error, visAlle, harFlere, toggleVisAlle } = useKobleTilSak(fnr)

  if (isLoading) {
    return (
      <HStack gap="space-4" align="center">
        <Loader size="small" title="Henter saker..." />
        <BodyShort size="small">Henter saker...</BodyShort>
      </HStack>
    )
  }

  if (error) {
    return <ErrorMessage>Feil med hending av saker</ErrorMessage>
  }

  if (alleSaker.length === 0) {
    return <BodyShort size="small">Ingen saker funnet for denne brukeren.</BodyShort>
  }

  return (
    <VStack gap="space-4" className={classes.kortListe}>
      {synligeSaker.map((sak) => (
        <SakKort
          key={`${sak.valg.kilde}-${sak.sakId}`}
          sak={sak}
          valgt={sak.valg.kilde === valgtSak?.kilde && sak.sakId === valgtSak.sakId}
          onVelg={() => onChange(sak.valg)}
        />
      ))}
      {harFlere && (
        <Button variant="tertiary" size="small" type="button" onClick={toggleVisAlle}>
          {visAlle ? 'Vis færre' : `Vis alle (${alleSaker.length})`}
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
          value={`${sak.valg.kilde}-${sak.sakId}`}
          checked={valgt}
          onChange={onVelg}
          className={classes.radioInput}
          aria-label={`Velg sak ${sak.sakId}: ${sak.gjelder}`}
        />
        <VStack gap="space-4" className={classes.kortInnhold}>
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
        </VStack>
      </HStack>
    </Box>
  )
}
