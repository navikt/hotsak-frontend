import { PersonIcon } from '@navikt/aksel-icons'
import { Box, CopyButton, Heading, HGrid, HGridProps, HStack, List, Tooltip } from '@navikt/ds-react'

import { Avstand } from '../../felleskomponenter/Avstand'
import { Merknad } from '../../felleskomponenter/Merknad'
import { Strek } from '../../felleskomponenter/Strek'
import { Brødtekst, Etikett, Tekst } from '../../felleskomponenter/typografi'
import { Vilkår } from '../../types/BehovsmeldingTypes'
import {
  Bosituasjon,
  Bruksarena,
  Formidler,
  Bruker as Hjelpemiddelbruker,
  Levering,
  PersonInfoKilde,
  Personinformasjon,
} from '../../types/types.internal'
import { formaterAdresse, formaterNavn, storForbokstavIAlleOrd } from '../../utils/formater'
import { Kontaktperson } from './Kontaktperson'
import { Leveringsmåte } from './Leveringsmåte'
import { Signatur } from './Signatur'

export interface BrukerProps {
  bruker: Hjelpemiddelbruker
  person: Personinformasjon
  levering: Levering
  formidler: Formidler
  vilkår: Vilkår[]
}

export function Bruker({ bruker, person, levering, formidler, vilkår }: BrukerProps) {
  const formatertNavn = formaterNavn(bruker)
  const adresseBruker = formaterAdresse(person)
  const bosituasjon = getTextForBosituasjon(person.bosituasjon)

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
          <Tekst>{bruker.fnr}</Tekst>
          <Etikett>{person.kilde === PersonInfoKilde.PDL ? 'Folkeregistert adresse' : 'Adresse'}</Etikett>
          <Tekst>{adresseBruker}</Tekst>
          <Etikett>Telefon</Etikett>
          <Tekst>{bruker.telefon}</Tekst>
          {bosituasjon && (
            <>
              <Etikett>Boform</Etikett>
              <Tekst>{bosituasjon}</Tekst>
            </>
          )}
          {person.bruksarena && person.bruksarena !== Bruksarena.UKJENT && (
            <>
              <Etikett>Bruksarena</Etikett>
              <Tekst>{storForbokstavIAlleOrd(person.bruksarena)}</Tekst>
            </>
          )}
          <Etikett>Funksjonsnedsettelse</Etikett>
          <Tekst>{storForbokstavIAlleOrd(person.funksjonsnedsettelser.join(', '))}</Tekst>
        </HGrid>
      </Box>

      <Strek />

      <Heading level="1" size="medium" spacing={true}>
        Levering
      </Heading>
      <Box paddingBlock="4 8">
        <HGrid {...hGridProps}>
          <Etikett>Leveringsadresse</Etikett>
          <Leveringsmåte levering={levering} adresseBruker={adresseBruker} />
          <Kontaktperson formidler={formidler} kontaktperson={levering.kontaktperson} />
          {levering.merknad && (
            <>
              <Merknad>
                <Avstand paddingTop={1} />
                <Etikett>Merknad til utlevering</Etikett>
              </Merknad>
              <HStack align="center">
                <Brødtekst>{levering.merknad}</Brødtekst>
                <Tooltip content="Kopier merknad til utlevering" placement="right">
                  <CopyButton size="small" copyText={levering.merknad} />
                </Tooltip>
              </HStack>
            </>
          )}
        </HGrid>
      </Box>

      <Strek />
      <Signatur signaturType={person.signaturtype} navn={formatertNavn} />
      <Strek />

      <Box paddingBlock="4" paddingInline={{ xs: '0 4', md: '0 16' }}>
        <List as="ul" size="small" title="Vilkår for å motta hjelpemidler">
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

function getTextForBosituasjon(bosituasjon: Bosituasjon | null) {
  switch (bosituasjon) {
    case null:
      return null
    case Bosituasjon.HJEMME:
      return 'Hjemme (egen bolig, omsorgsbolig eller bofellesskap)'
    case Bosituasjon.HJEMME_EGEN_BOLIG:
      return 'Hjemme i egen bolig'
    case Bosituasjon.HJEMME_OMSORG_FELLES:
      return 'Hjemme i omsorgsbolig, bofellesskap eller servicebolig'
    case Bosituasjon.INSTITUSJON:
      return 'Institusjon'
    default:
      return 'Ukjent bosituasjon'
  }
}
