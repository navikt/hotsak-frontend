import { PersonIcon } from '@navikt/aksel-icons'
import { Box, CopyButton, Heading, HGrid, HGridProps, HStack, List, Tooltip } from '@navikt/ds-react'

import { MerknadBox } from '../../felleskomponenter/Merknad'
import { Strek } from '../../felleskomponenter/Strek'
import { Brødtekst, Etikett, Tekst } from '../../felleskomponenter/typografi'
import {
  Bruker as Behovsmeldingsbruker,
  Brukerkilde,
  Brukersituasjon,
  Levering,
  Vilkår,
} from '../../types/BehovsmeldingTypes'
import { Bruker as Hjelpemiddelbruker } from '../../types/types.internal'
import {
  formaterAdresse,
  formaterFødselsnummer,
  formaterNavn,
  formaterTelefonnummer,
  storForbokstavIAlleOrd,
} from '../../utils/formater'
import { Kontaktperson } from './Kontaktperson'
import { Leveringsmåte } from './Leveringsmåte'
import { Signatur } from './Signatur'

export interface BrukerProps {
  bruker: Hjelpemiddelbruker
  behovsmeldingsbruker: Behovsmeldingsbruker
  brukerSituasjon: Brukersituasjon
  levering: Levering
  vilkår: Vilkår[]
}

export function Bruker({ bruker, behovsmeldingsbruker, brukerSituasjon, levering, vilkår }: BrukerProps) {
  const { utleveringMerknad } = levering
  const formatertNavn = formaterNavn(bruker)
  const adresseBruker = formaterAdresse(behovsmeldingsbruker.veiadresse)
  const formatertFnr = formaterFødselsnummer(bruker.fnr)
  const formatertTlf = formaterTelefonnummer(bruker.telefon)

  return (
    <>
      <Heading level="1" size="medium">
        <HStack align="center" gap="1">
          <PersonIcon />
          Hjelpemiddelbruker
        </HStack>
      </Heading>
      <Box paddingBlock="4 8">
        <HGrid {...hGridProps}>
          <Etikett>Navn</Etikett>
          <Tekst>{formatertNavn}</Tekst>
          <Etikett>Fødselsnummer</Etikett>
          <Tekst>{formatertFnr}</Tekst>
          <Etikett>{behovsmeldingsbruker.kilde === Brukerkilde.PDL ? 'Folkeregistert adresse' : 'Adresse'}</Etikett>
          <Tekst>{adresseBruker}</Tekst>
          <Etikett>Telefon</Etikett>
          <Tekst>{formatertTlf}</Tekst>

          <Etikett>Funksjonsnedsettelse</Etikett>
          <Tekst>{storForbokstavIAlleOrd(brukerSituasjon.funksjonsnedsettelser.join(', '))}</Tekst>
        </HGrid>
      </Box>

      <Strek />

      <Heading level="1" size="medium" spacing={true}>
        Levering
      </Heading>
      <Box paddingBlock="4 8">
        <HGrid {...hGridProps}>
          <Leveringsmåte levering={levering} adresseBruker={adresseBruker} />
          <Kontaktperson levering={levering} />
          {utleveringMerknad && (
            <>
              <MerknadBox>
                <Etikett>Merknad til utlevering</Etikett>
              </MerknadBox>
              <HStack align="center">
                <Brødtekst>{utleveringMerknad}</Brødtekst>
                <Tooltip content="Kopier merknad til utlevering" placement="right">
                  <CopyButton size="small" copyText={utleveringMerknad} />
                </Tooltip>
              </HStack>
            </>
          )}
        </HGrid>
      </Box>

      <Strek />
      <Signatur signaturType={behovsmeldingsbruker.signaturtype} navn={formatertNavn} />
      <Strek />

      <Box paddingBlock="4" paddingInline={{ xs: '0 4', md: '0 16' }}>
        <Heading level="2" size="small" spacing>
          Formidlers vurdering
        </Heading>
        <List as="ul" size="small">
          {vilkår.map((vilkårItem) => (
            <List.Item key={vilkårItem.vilkårtype}>{vilkårItem.tekst.nb}</List.Item>
          ))}
        </List>
      </Box>
    </>
  )
}

const hGridProps: Pick<HGridProps, 'columns' | 'gap'> = {
  columns: 'minmax(min-content, 12rem) auto',
  gap: '05',
}
