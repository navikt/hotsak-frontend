import { Box, Heading, HGrid, HGridProps, HStack } from '@navikt/ds-react'

import { formaterNavn, storForbokstavIAlleOrd } from '../../utils/formater'

import { Merknad } from '../../felleskomponenter/Merknad'
import { Strek } from '../../felleskomponenter/Strek'
import { BrytbarBrødtekst, Brødtekst, Etikett } from '../../felleskomponenter/typografi'
import type { Formidler as FormidlerType, Oppfølgingsansvarlig } from '../../types/types.internal'
import { PersonIcon } from '@navikt/aksel-icons'

export interface FormidlerProps {
  formidler: FormidlerType
  oppfølgingsansvarlig: Oppfølgingsansvarlig
}

export function Formidler({ formidler, oppfølgingsansvarlig }: FormidlerProps) {
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
        <Brødtekst>{`${storForbokstavIAlleOrd(formidler.postadresse)}`}</Brødtekst>
        <Etikett>Telefon</Etikett>
        <Brødtekst>{formidler.telefon}</Brødtekst>
        <Etikett>Treffest enklest</Etikett>
        <Brødtekst>{storForbokstavIAlleOrd(formidler.treffestEnklest)}</Brødtekst>
        <Etikett>E-postadresse</Etikett>
        <BrytbarBrødtekst>{formidler.epost}</BrytbarBrødtekst>
      </HGrid>
    )
  }

  const InfoOppfølgingsansvarlig = () => {
    return (
      <Box paddingBlock="4 0">
        <Merknad>
          <HGrid {...hGridProps}>
            <Etikett>Navn</Etikett>
            <Brødtekst>{formaterNavn(oppfølgingsansvarlig.navn)}</Brødtekst>
            <Etikett>Arbeidssted</Etikett>
            <Brødtekst>{`${storForbokstavIAlleOrd(oppfølgingsansvarlig.arbeidssted)}`}</Brødtekst>
            <Etikett>Stilling</Etikett>
            <Brødtekst>{`${storForbokstavIAlleOrd(oppfølgingsansvarlig.stilling)}`}</Brødtekst>
            <Etikett>Telefon</Etikett>
            <Brødtekst>{oppfølgingsansvarlig.telefon}</Brødtekst>
            <Etikett>Ansvar</Etikett>
            <Brødtekst>{storForbokstavIAlleOrd(oppfølgingsansvarlig.ansvarFor)}</Brødtekst>
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

const hGridProps: Partial<HGridProps> = {
  columns: 'minmax(min-content, 12rem) auto',
  gap: '05',
}
