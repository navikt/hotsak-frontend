import { Box, Heading, HGrid, HGridProps, HStack } from '@navikt/ds-react'

import { formaterAdresse, formaterNavn, storForbokstavIAlleOrd } from '../../utils/formater'

import { PersonIcon } from '@navikt/aksel-icons'
import { Merknad } from '../../felleskomponenter/Merknad'
import { Strek } from '../../felleskomponenter/Strek'
import { BrytbarBrødtekst, Brødtekst, Etikett } from '../../felleskomponenter/typografi'
import { Levering, Oppfølgingsansvarlig } from '../../types/BehovsmeldingTypes'

export interface FormidlerProps {
  levering: Levering
}

export function Formidler({ levering }: FormidlerProps) {
  const { hjelpemiddelformidler: formidler, oppfølgingsansvarlig, annenOppfølgingsansvarlig } = levering

  const InfoFormidler = () => {
    return (
      <HGrid {...hGridProps}>
        <Etikett>Navn</Etikett>
        <Brødtekst>{formaterNavn(formidler.navn)}</Brødtekst>
        <Etikett>Arbeidssted</Etikett>
        <Brødtekst>{`${storForbokstavIAlleOrd(formidler.arbeidssted)}`}</Brødtekst>
        <Etikett>Stilling</Etikett>
        <Brødtekst>{`${storForbokstavIAlleOrd(formidler.stilling)}`}</Brødtekst>
        <Etikett>Postadresse</Etikett>
        <Brødtekst>{`${storForbokstavIAlleOrd(formidler.adresse.poststed)}`}</Brødtekst>
        <Etikett>Telefon</Etikett>
        <Brødtekst>{formidler.telefon}</Brødtekst>
        <Etikett>Treffest enklest</Etikett>
        <Brødtekst>{storForbokstavIAlleOrd(formaterAdresse(formidler.adresse))}</Brødtekst>
        <Etikett>E-postadresse</Etikett>
        <BrytbarBrødtekst>{formidler.epost}</BrytbarBrødtekst>
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
      <Box paddingBlock="4 0">
        <Merknad>
          <HGrid {...hGridProps}>
            <Etikett>Navn</Etikett>
            <Brødtekst>{formaterNavn(oppfølging.navn)}</Brødtekst>
            <Etikett>Arbeidssted</Etikett>
            <Brødtekst>{`${storForbokstavIAlleOrd(oppfølging.arbeidssted)}`}</Brødtekst>
            <Etikett>Stilling</Etikett>
            <Brødtekst>{`${storForbokstavIAlleOrd(oppfølging.stilling)}`}</Brødtekst>
            <Etikett>Telefon</Etikett>
            <Brødtekst>{oppfølging.telefon}</Brødtekst>
            <Etikett>Ansvar</Etikett>
            <Brødtekst>{storForbokstavIAlleOrd(oppfølging.ansvarFor)}</Brødtekst>
          </HGrid>
        </Merknad>
      </Box>
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
        <Box paddingBlock="4 0">
          <InfoFormidler />
        </Box>
        {oppfølgingsansvarlig && (
          <>
            <Strek />
            <Box paddingBlock="4 0">
              <Heading level="1" size="small" spacing={false}>
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
  columns: 'minmax(min-content, 12rem) auto',
  gap: '05',
}
