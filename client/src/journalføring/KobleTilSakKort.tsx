import { ExternalLinkIcon } from '@navikt/aksel-icons'
import { BodyShort, Box, Button, ErrorMessage, HGrid, HStack, Loader, Tag, VStack, Link } from '@navikt/ds-react'
import { useState } from 'react'

import { GOSYS_GENERELL_SAK, type Sakvalg } from './journalføringValg.ts'
import { MAKS_SAKER_SYNLIG, type SakvalgVisning, HOTSAK_SYSTEM } from './useKobleTilSak.ts'
import { type HttpError } from '../io/HttpError.ts'
import { OmrådeFilterLabel, SaksstatusLabel, type Journalpost } from '../types/types.internal.ts'
import { formaterDato } from '../utils/dato.ts'
import { CompactExpandableCard } from '../felleskomponenter/panel/CompactExpandableCard.tsx'
import { journalposttypeTag } from '../personoversikt/dokumentColumns.tsx'
import { usePersonContext } from '../personoversikt/PersonContext.tsx'
import classes from './KobleTilSakKort.module.css'
import { Sakstype } from './journalføringTypes.ts'
import { useJournalposterPerSak } from './useJournalposterPerSak.ts'
import { Etikett } from '../felleskomponenter/typografi.tsx'
import { FinnHjelpemiddelLink } from '../felleskomponenter/FinnHjelpemiddelLink.tsx'
import { useBehovsmelding } from '../saksbilde/useBehovsmelding.ts'
import { type Behovsmelding } from '../types/BehovsmeldingTypes.ts'

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

export function KobleTilSakKort({ saker, isLoading, error, valgtSak, onChange, feilmelding }: KobleTilSakKortProps) {
  const [visAlle, setVisAlle] = useState(false)
  const { fodselsnummer } = usePersonContext()
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
  journalposter?: Journalpost[]
  journalposterLaster?: boolean
  journalposterFeil?: unknown
}

function SakKort({
  sak,
  valgt,
  onVelg,
  journalposter = [],
  journalposterLaster = false,
  journalposterFeil,
}: SakKortProps) {
  const [åpnet, setÅpnet] = useState(false)
  const område = sak.område ? formaterOmråde(sak.område) : ''
  const statusLabel = sak.saksstatus ? (SaksstatusLabel.get(sak.saksstatus) ?? sak.saksstatus) : null

  const erHotsak = sak.valg.sakstype === Sakstype.FAGSAK && sak.valg.fagsaksystem === HOTSAK_SYSTEM
  const fagsaksystem = sak.valg.sakstype === Sakstype.FAGSAK ? sak.valg.fagsaksystem : ''
  const journalpostSystem = erHotsak ? 'HJELPEMIDLER' : fagsaksystem
  const sakensJournalposter = journalposter.filter((journalpost) => journalpost.sak?.fagsaksystem === journalpostSystem)

  const headerDetails = (
    <div className={classes.headerDetaljer}>
      <div className={classes.hovedDetaljer}>
        <HStack gap="space-4" align="center">
          <BodyShort size="small">
            <strong>Sak:</strong>
          </BodyShort>
          <BodyShort size="small">{sak.sakId}</BodyShort>
          {erHotsak && (
            <Link
              href={`/sak/${sak.sakId}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Åpne sak ${sak.sakId} i ny fane`}
              className={classes.sakLenke}
              onClick={(event) => event.stopPropagation()}
            >
              Åpne <ExternalLinkIcon aria-hidden />
            </Link>
          )}
        </HStack>
        <HStack gap="space-4" align="center">
          <BodyShort size="small">
            <strong>Fagsystem:</strong>
          </BodyShort>
          <BodyShort size="small">{sak.fagsystemLabel}</BodyShort>
        </HStack>
      </div>
      {område && (
        <BodyShort size="small" className={classes.område}>
          <strong>Område:</strong> {område}
        </BodyShort>
      )}
    </div>
  )

  return (
    <CompactExpandableCard
      tittel={sak.gjelder}
      variant="default"
      defaultOpen={false}
      onToggle={setÅpnet}
      className={`${classes.sakKort} ${valgt ? classes.valgtSak : ''}`}
      headerClassName={classes.sakHeader}
      titleClassName={classes.sakTittel}
      startContent={
        <input
          type="radio"
          name="valgtSak"
          value={`${fagsaksystem}-${sak.sakId}`}
          checked={valgt}
          onChange={onVelg}
          onClick={(event) => event.stopPropagation()}
          className={classes.radioInput}
          aria-label={`Velg sak ${sak.sakId}: ${sak.gjelder}`}
        />
      }
      headerDetails={headerDetails}
      endContent={
        <div className={classes.sideDetaljer}>
          {statusLabel && (
            <Tag variant="moderate" data-color="info" size="small">
              {statusLabel}
            </Tag>
          )}
          <BodyShort size="small">
            <strong>Dato:</strong> {formaterDato(sak.dato)}
          </BodyShort>
        </div>
      }
    >
      <div className={classes.utvidetInnhold}>
        {journalposterFeil ? (
          <ErrorMessage>Kunne ikke hente journalposter for saken.</ErrorMessage>
        ) : journalposterLaster ? (
          <HStack gap="space-4" align="center">
            <Loader size="small" title="Henter journalposter..." />
            <BodyShort size="small">Henter journalposter...</BodyShort>
          </HStack>
        ) : sakensJournalposter.length === 0 ? (
          <BodyShort size="small">Ingen journalposter funnet for denne saken.</BodyShort>
        ) : (
          <>
            <Etikett>Dokumenter i saken</Etikett>
            <ul className={classes.journalpostListe} role="list">
              {sakensJournalposter.map((journalpost) => (
                <li key={journalpost.journalpostId} className={classes.journalpost}>
                  {journalposttypeTag(journalpost.journalposttype)}
                  <ul className={classes.dokumentListe} role="list">
                    {journalpost.dokumenter.map((dokument) => (
                      <li key={dokument.dokumentId} className={classes.dokument}>
                        <Link
                          inlineText
                          href={`/api/journalpost/${journalpost.journalpostId}/${dokument.dokumentId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {dokument.tittel}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <BodyShort size="small" className={classes.journalpostDato}>
                    {formaterDato(journalpost.journalpostOpprettetTid)}
                  </BodyShort>
                </li>
              ))}
            </ul>
          </>
        )}
        {erHotsak && åpnet && <SakensHjelpemidler sakId={sak.sakId} />}
      </div>
    </CompactExpandableCard>
  )
}

function SakensHjelpemidler({ sakId }: { sakId: string }) {
  const { behovsmelding, isLoading, error } = useBehovsmelding<Behovsmelding>(sakId)
  const hjelpemidler = behovsmelding?.isDigitalBehovsmelding ? behovsmelding.hjelpemidler?.hjelpemidler : undefined

  return (
    <section className={classes.hjelpemiddelSeksjon} aria-label="Hjelpemidler i saken">
      <Etikett>Hjelpemidler</Etikett>
      {error ? (
        <ErrorMessage>Kunne ikke hente hjelpemidler for saken.</ErrorMessage>
      ) : isLoading ? (
        <BodyShort size="small">Henter hjelpemidler...</BodyShort>
      ) : !behovsmelding ? (
        <ErrorMessage>Fant ikke behovsmelding for saken.</ErrorMessage>
      ) : !hjelpemidler?.length ? (
        <BodyShort size="small">Ingen hjelpemidler registrert for saken.</BodyShort>
      ) : (
        <ul className={classes.hjelpemiddelListe}>
          {hjelpemidler.map((hjelpemiddel) => (
            <HGrid
              as="li"
              key={hjelpemiddel.hjelpemiddelId}
              columns="minmax(0, 7rem) minmax(0, 1fr) auto"
              gap="space-8"
              align="start"
              className={classes.hjelpemiddel}
            >
              <FinnHjelpemiddelLink hmsnr={hjelpemiddel.produkt.hmsArtNr}>
                {hjelpemiddel.produkt.hmsArtNr}
              </FinnHjelpemiddelLink>
              <BodyShort size="small" className={classes.artikkelnavn}>
                {hjelpemiddel.produkt.artikkelnavn}
              </BodyShort>
              <BodyShort size="small">Antall: {hjelpemiddel.antall}</BodyShort>
            </HGrid>
          ))}
        </ul>
      )}
    </section>
  )
}
