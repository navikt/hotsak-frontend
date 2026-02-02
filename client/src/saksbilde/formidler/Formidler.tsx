import { Box, Heading, HGrid, HGridProps, HStack } from '@navikt/ds-react'

import { formaterAdresse, formaterNavn, formaterTelefonnummer, storForbokstavIAlleOrd } from '../../utils/formater'

import { PersonIcon } from '@navikt/aksel-icons'
import { MerknadBox } from '../../felleskomponenter/Merknad'
import { Strek } from '../../felleskomponenter/Strek'
import { BrytbarBrødtekst, Brødtekst, Etikett } from '../../felleskomponenter/typografi'
import { Levering, Oppfølgingsansvarlig } from '../../types/BehovsmeldingTypes'
import { Kopiknapp } from '../../felleskomponenter/Kopiknapp'

export interface FormidlerProps {
  levering: Levering
}

export function Formidler({ levering }: FormidlerProps) {
  const { hjelpemiddelformidler: formidler, oppfølgingsansvarlig, annenOppfølgingsansvarlig } = levering

  const InfoFormidler = () => {
    return (
      <HGrid {...hGridProps} align="center">
        <Etikett>Navn</Etikett>
        <BrytbarBrødtekst>{formaterNavn(formidler.navn)}</BrytbarBrødtekst>
        <Etikett>Arbeidssted</Etikett>
        <BrytbarBrødtekst>{`${storForbokstavIAlleOrd(formidler.arbeidssted)}`}</BrytbarBrødtekst>
        <Etikett>Stilling</Etikett>
        <BrytbarBrødtekst>{`${storForbokstavIAlleOrd(formidler.stilling)}`}</BrytbarBrødtekst>
        <Etikett>Postadresse</Etikett>
        <BrytbarBrødtekst>{`${storForbokstavIAlleOrd(formidler.adresse.poststed)}`}</BrytbarBrødtekst>
        <Etikett>Telefon</Etikett>
        <HStack align="center" wrap={false}>
          <Brødtekst>{formaterTelefonnummer(formidler.telefon)}</Brødtekst>
          <Kopiknapp tooltip="Kopier telefon" copyText={formidler.telefon} placement="bottom" />
        </HStack>
        <Etikett>Treffest enklest</Etikett>
        <BrytbarBrødtekst>{storForbokstavIAlleOrd(formaterAdresse(formidler.adresse))}</BrytbarBrødtekst>
        <Etikett>E-postadresse</Etikett>
        <HStack align="center" wrap={false}>
          <BrytbarBrødtekst>{formidler.epost}</BrytbarBrødtekst>
          <Kopiknapp tooltip="Kopier epost" copyText={formidler.epost} placement="bottom" />
        </HStack>
      </HGrid>
    )
  }

  const InfoOppfølgingsansvarlig = () => {
    const oppfølging =
      oppfølgingsansvarlig === Oppfølgingsansvarlig.HJELPEMIDDELFORMIDLER
        ? {
            navn: formidler.navn,
            arbeidssted: formidler.arbeidssted,
            stilling: formidler.stilling,
            telefon: formidler.telefon,
            ansvarFor: '',
          }
        : {
            navn: annenOppfølgingsansvarlig!.navn,
            arbeidssted: annenOppfølgingsansvarlig!.arbeidssted,
            stilling: annenOppfølgingsansvarlig!.stilling,
            telefon: annenOppfølgingsansvarlig!.telefon,
            ansvarFor: annenOppfølgingsansvarlig!.ansvarFor,
          }

    return (
      <MerknadBox>
        <HGrid {...hGridProps} align="center">
          <Etikett>Navn</Etikett>
          <BrytbarBrødtekst>{formaterNavn(oppfølging.navn)}</BrytbarBrødtekst>
          <Etikett>Arbeidssted</Etikett>
          <BrytbarBrødtekst>{`${storForbokstavIAlleOrd(oppfølging.arbeidssted)}`}</BrytbarBrødtekst>
          <Etikett>Stilling</Etikett>
          <BrytbarBrødtekst>{`${storForbokstavIAlleOrd(oppfølging.stilling)}`}</BrytbarBrødtekst>
          <Etikett>Telefon</Etikett>
          <BrytbarBrødtekst>{formaterTelefonnummer(oppfølging.telefon)}</BrytbarBrødtekst>
          <Etikett>Ansvar</Etikett>
          <BrytbarBrødtekst>{storForbokstavIAlleOrd(oppfølging.ansvarFor)}</BrytbarBrødtekst>
        </HGrid>
      </MerknadBox>
    )
  }

  return (
    <>
      <Heading level="1" size="medium" spacing={false}>
        <HStack align="center" gap="1">
          <PersonIcon />
          Formidler og opplæringsansvarlig
        </HStack>
      </Heading>
      <Box paddingBlock="4 0">
        <Heading level="1" size="small" spacing={false}>
          Hjelpemiddelformidler
        </Heading>
        <InfoFormidler />
        {oppfølgingsansvarlig && (
          <>
            <Strek />
            <Box paddingBlock="4 0">
              <Heading level="1" size="small" spacing>
                Oppfølgings- og opplæringsansvarlig
              </Heading>
              <InfoOppfølgingsansvarlig />
            </Box>
          </>
        )}
      </Box>
    </>
  )
}

const hGridProps: Pick<HGridProps, 'columns' | 'gap'> = {
  columns: 'max-content auto',
  gap: 'space-0 space-16',
}
