import { Box, HStack, Label, ReadMore, VStack } from '@navikt/ds-react'
import { ReactNode } from 'react'
import { Kopiknapp } from '../../felleskomponenter/Kopiknapp.tsx'
import { PanelTittel } from '../../felleskomponenter/panel/PanelTittel.tsx'
import { ScrollablePanel } from '../../felleskomponenter/ScrollablePanel.tsx'
import { Etikett, Tekst, TextContainer } from '../../felleskomponenter/typografi.tsx'
import { lagKontaktpersonTekst } from '../../saksbilde/bruker/lagKontaktpersonTekst.ts'
import { lagLeveringsmåteTekst } from '../../saksbilde/venstremeny/lagLeveringsmåteTekst.ts'
import { Brukerkilde, Innsenderbehovsmelding, Levering, Oppfølgingsansvarlig } from '../../types/BehovsmeldingTypes.ts'
import { Sak } from '../../types/types.internal.ts'
import {
  formaterAdresse,
  formaterFødselsnummer,
  formaterNavn,
  formaterTelefonnummer,
  storForbokstavIAlleOrd,
} from '../../utils/formater.ts'
import { WarningTag } from '../felles/AlertTag.tsx'
import classes from './BehovsmeldingsPanel.module.css'
import { useClosePanel } from './paneler/usePanelHooks.ts'

export function OeBSPanel({ behovsmelding }: { sak: Sak; behovsmelding: Innsenderbehovsmelding }) {
  const lukkPanel = useClosePanel('oebspanel')
  const { hjelpemiddelformidler: formidler } = behovsmelding.levering
  const levering = behovsmelding.levering
  const bruker = behovsmelding.bruker
  const oppfølging = utledOppfølging(levering)
  const adresseBruker = formaterAdresse(behovsmelding.bruker.veiadresse)
  const leveringsmåteTekst = lagLeveringsmåteTekst(levering, adresseBruker)
  const formatertNavn = formaterNavn(bruker)
  const formatertFnr = formaterFødselsnummer(bruker.fnr)
  const formatertTlf = formaterTelefonnummer(bruker.telefon)

  return (
    <Box
      background="default"
      paddingBlock="space-0 space-36"
      paddingInline="space-12 space-0"
      style={{ height: '100%' }}
    >
      <PanelTittel tittel="Behandling i OeBS" lukkPanel={lukkPanel} />
      <ScrollablePanel paddingInline="space-0 space-4" paddingBlock="space-4 space-0">
        <TextContainer>
          <VStack gap="space-32">
            <section className={classes.panel}>
              <Tittel spacing={true}>FORMIDLER</Tittel>
              <TextContainer>
                <Tekst textColor="subtle">{`${formaterNavn(formidler.navn)} - ${formidler.stilling} - ${formidler.arbeidssted} - Tlf: ${formaterTelefonnummer(formidler.telefon)}`}</Tekst>
              </TextContainer>

              <ReadMore size="small" header="Mer om formidler">
                <VStack gap="space-4">
                  <KopierbarFelt etikett="Navn" tekst={formaterNavn(formidler.navn)} />
                  <KopierbarFelt etikett="Arbeidssted" tekst={storForbokstavIAlleOrd(formidler.arbeidssted)} />
                  <KopierbarFelt etikett="Stilling" tekst={storForbokstavIAlleOrd(formidler.stilling)} />
                  <KopierbarFelt etikett="Postadresse" tekst={storForbokstavIAlleOrd(formidler.adresse.poststed)} />
                  <KopierbarFelt
                    etikett="Telefon"
                    tekst={formaterTelefonnummer(formidler.telefon)}
                    copyText={formidler.telefon}
                  />
                  <KopierbarFelt etikett="E-postadresse" tekst={formidler.epost} />
                  <KopierbarFelt
                    etikett="Treffest enklest"
                    tekst={storForbokstavIAlleOrd(formaterAdresse(formidler.adresse))}
                  />
                </VStack>
              </ReadMore>
            </section>
            <section className={classes.panel}>
              <Tittel spacing={true}>OPPFØLGING OG OPPLÆRING</Tittel>
              {behovsmelding.levering.oppfølgingsansvarlig === Oppfølgingsansvarlig.ANNEN_OPPFØLGINGSANSVARLIG && (
                <WarningTag>Annen oppfølgingsansvarlig</WarningTag>
              )}
              <Tekst textColor="subtle">{`${formaterNavn(oppfølging.navn)} - ${oppfølging.stilling} - ${oppfølging.arbeidssted} - Tlf: ${formaterTelefonnummer(oppfølging.telefon)}`}</Tekst>
              <ReadMore size="small" header="Mer om oppfølgingsansvarlig">
                <VStack gap="space-4">
                  <KopierbarFelt etikett="Navn" tekst={formaterNavn(oppfølging.navn)} />
                  <KopierbarFelt etikett="Arbeidssted" tekst={storForbokstavIAlleOrd(oppfølging.arbeidssted)} />
                  <KopierbarFelt etikett="Stilling" tekst={storForbokstavIAlleOrd(oppfølging.stilling)} />
                  <KopierbarFelt
                    etikett="Telefon"
                    tekst={formaterTelefonnummer(oppfølging.telefon)}
                    copyText={oppfølging.telefon}
                  />
                  {oppfølging.ansvarFor && (
                    <KopierbarFelt etikett="Ansvar" tekst={storForbokstavIAlleOrd(oppfølging.ansvarFor)} />
                  )}
                </VStack>
              </ReadMore>
            </section>
            <section className={classes.panel}>
              <Tittel spacing={true}>LEVERING</Tittel>
              <VStack gap="space-4">
                {leveringsmåteTekst.copyText && (
                  <KopierbarFelt etikett={leveringsmåteTekst.label} tekst={leveringsmåteTekst.copyText} />
                )}
                {levering.annenUtleveringskommune && (
                  <KopierbarFelt
                    etikett="Kommune"
                    tekst={`${storForbokstavIAlleOrd(levering.annenUtleveringskommune.navn)} (${levering.annenUtleveringskommune.nummer})`}
                  />
                )}
                {levering.annenUtleveringsbydel && (
                  <KopierbarFelt
                    etikett="Bydel"
                    tekst={`${levering.annenUtleveringsbydel.navn} (${levering.annenUtleveringsbydel.nummer})`}
                  />
                )}
                {levering.utleveringMerknad && (
                  <KopierbarFelt etikett="Beskjed til kommunen" tekst={levering.utleveringMerknad} />
                )}
                {levering.utleveringKontaktperson && (
                  <KopierbarFelt etikett="Kontaktperson" tekst={lagKontaktpersonTekst(levering)} />
                )}
              </VStack>
            </section>
            <section className={classes.panel}>
              <Tittel spacing={true}>BRUKER</Tittel>
              <VStack gap="space-4">
                <KopierbarFelt etikett="Navn" tekst={formatertNavn} />
                <KopierbarFelt etikett="Fødselsnummer" tekst={formatertFnr} copyText={bruker.fnr} />
                <KopierbarFelt etikett="Telefon" tekst={formatertTlf} copyText={bruker.telefon || ''} />
                <KopierbarFelt
                  etikett={bruker.kilde === Brukerkilde.PDL ? 'Folkeregistrert adresse' : 'Adresse'}
                  tekst={adresseBruker}
                />
              </VStack>
            </section>
          </VStack>
        </TextContainer>
      </ScrollablePanel>
    </Box>
  )
}

function utledOppfølging(levering: Levering) {
  const { hjelpemiddelformidler: formidler, oppfølgingsansvarlig, annenOppfølgingsansvarlig } = levering
  if (oppfølgingsansvarlig === Oppfølgingsansvarlig.HJELPEMIDDELFORMIDLER) {
    return {
      navn: formidler.navn,
      arbeidssted: formidler.arbeidssted,
      stilling: formidler.stilling,
      telefon: formidler.telefon,
      ansvarFor: '',
    }
  }
  return { ...annenOppfølgingsansvarlig! }
}

function Tittel({ children, spacing = true }: { children: ReactNode; spacing?: boolean }) {
  return (
    <Label as="h2" size="small" textColor="subtle" spacing={spacing}>
      {children}
    </Label>
  )
}

function KopierbarFelt({ etikett, tekst, copyText }: KopierbarFeltProps) {
  return (
    <HStack gap="space-8" align="start" wrap={false}>
      <Kopiknapp tooltip={`Kopier ${etikett.toLowerCase()}`} copyText={copyText ?? tekst} placement="bottom" />
      <VStack>
        <Etikett>{etikett}</Etikett>
        <Tekst>{tekst}</Tekst>
      </VStack>
    </HStack>
  )
}

interface KopierbarFeltProps {
  etikett: string
  tekst: string
  copyText?: string
}
