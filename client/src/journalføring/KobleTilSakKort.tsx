import { useState } from 'react'
import { BodyShort, Box, Button, ErrorMessage, Heading, HGrid, HStack, Loader, Tag, VStack } from '@navikt/ds-react'

import { useSaksoversikt } from '../personoversikt/useSaksoversikt.ts'
import { type SaksoversiktSak } from '../personoversikt/saksoversiktTypes.ts'
import { OmrådeFilterLabel, OppgaveStatusLabel, OppgaveStatusType, Sakstype } from '../types/types.internal.ts'
import { formaterDato } from '../utils/dato.ts'
import classes from './KobleTilSakKort.module.css'

const MAKS_SAKER_SYNLIG = 10

interface KobleTilSakKortProps {
  fnr: string
  valgtSakId: string | null
  onChange: (sakId: string | null) => void
  feilmelding?: string
}

const ÅPNE_STATUSER = new Set<OppgaveStatusType>([
  OppgaveStatusType.AVVENTER_JOURNALFORING,
  OppgaveStatusType.AVVENTER_SAKSBEHANDLER,
  OppgaveStatusType.TILDELT_SAKSBEHANDLER,
  OppgaveStatusType.AVVENTER_DOKUMENTASJON,
  OppgaveStatusType.AVVENTER_GODKJENNER,
  OppgaveStatusType.TILDELT_GODKJENNER,
])

function statusKategoriRekkefølge(saksstatus: OppgaveStatusType): number {
  if (ÅPNE_STATUSER.has(saksstatus)) return 0
  return 1
}

function sorterSaker(saker: SaksoversiktSak[]): SaksoversiktSak[] {
  return [...saker].sort((a, b) => {
    const kategoriDiff = statusKategoriRekkefølge(a.saksstatus) - statusKategoriRekkefølge(b.saksstatus)
    if (kategoriDiff !== 0) return kategoriDiff
    return b.mottattTidspunkt.localeCompare(a.mottattTidspunkt)
  })
}

function statusTagVariant(saksstatus: OppgaveStatusType): 'success' | 'warning' | 'neutral' | 'info' {
  if (ÅPNE_STATUSER.has(saksstatus)) return 'info'
  return 'neutral'
}

function formaterOmråde(område: string[]): string {
  return område
    .map((o) => OmrådeFilterLabel.get(o) ?? o)
    .filter(Boolean)
    .join(', ')
}

export function KobleTilSakKort({ fnr, valgtSakId, onChange, feilmelding }: KobleTilSakKortProps) {
  const { saksoversikt, isLoading, error } = useSaksoversikt(fnr)
  const [visAlle, setVisAlle] = useState(false)

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

  const alleSaker = sorterSaker((saksoversikt?.saker ?? []).filter((sak) => sak.sakstype !== Sakstype.BARNEBRILLER))

  if (alleSaker.length === 0) {
    return <BodyShort size="small">Ingen saker funnet for denne brukeren.</BodyShort>
  }

  const synligeSaker = visAlle ? alleSaker : alleSaker.slice(0, MAKS_SAKER_SYNLIG)
  const harFlere = alleSaker.length > MAKS_SAKER_SYNLIG

  return (
    <VStack gap="space-4" className={classes.kortListe}>
      {synligeSaker.map((sak) => (
        <SakKort key={sak.sakId} sak={sak} valgt={sak.sakId === valgtSakId} onVelg={() => onChange(sak.sakId)} />
      ))}
      {harFlere && (
        <Button variant="tertiary" size="small" type="button" onClick={() => setVisAlle((prev) => !prev)}>
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
  sak: SaksoversiktSak
  valgt: boolean
  onVelg: () => void
}

function SakKort({ sak, valgt, onVelg }: SakKortProps) {
  const område = formaterOmråde(sak.område)
  const statusLabel = OppgaveStatusLabel.get(sak.saksstatus) ?? sak.saksstatus

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
          value={sak.sakId}
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
              <BodyShort size="small">
                <strong>Sak:</strong> {sak.sakId}
              </BodyShort>
            </VStack>
            <VStack gap="space-1">
              <span>
                <Tag variant={statusTagVariant(sak.saksstatus)} size="small">
                  {statusLabel}
                </Tag>
              </span>
              <BodyShort size="small">
                <strong>Dato:</strong> {formaterDato(sak.mottattTidspunkt)}
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
