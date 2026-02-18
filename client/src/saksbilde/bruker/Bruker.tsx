import { Heading, HStack, List, VStack, Box } from '@navikt/ds-react'

import { Skillelinje } from '../../felleskomponenter/Strek'
import { Etikett, Tekst, TextContainer } from '../../felleskomponenter/typografi'
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
import { Leveringsmåte } from './Leveringsmåte'
import { Kontaktperson } from './Kontaktperson'
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
      <Heading level="2" size="small">
        Hjelpemiddelbruker
      </Heading>
      <VStack paddingBlock="space-16 0" gap="space-4">
        <HStack gap="space-6">
          <Etikett>Navn:</Etikett>
          <Tekst>{formatertNavn}</Tekst>
        </HStack>
        <HStack gap="space-6">
          <Etikett>Fødselsnummer:</Etikett>
          <Tekst>{formatertFnr}</Tekst>
        </HStack>
        <HStack gap="space-6">
          <Etikett> {behovsmeldingsbruker.kilde === Brukerkilde.PDL ? 'Folkeregistert adresse:' : 'Adresse:'}</Etikett>
          <Tekst>{adresseBruker}</Tekst>
        </HStack>
        <HStack gap="space-6">
          <Etikett>Telefon:</Etikett>
          <Tekst>{formatertTlf}</Tekst>
        </HStack>
        <HStack gap="space-6">
          <Etikett>Funksjonsnedsettelse:</Etikett>
          <Tekst>{storForbokstavIAlleOrd(brukerSituasjon.funksjonsnedsettelser.join(', '))}</Tekst>
        </HStack>
      </VStack>
      <Skillelinje />
      <Heading level="2" size="small" spacing={true}>
        Levering
      </Heading>
      <VStack gap="space-4">
        <Leveringsmåte levering={levering} adresseBruker={adresseBruker} />
        <Kontaktperson levering={levering} />
        {utleveringMerknad && (
          <HStack gap="space-6" paddingBlock="0 space-12" align="center">
            <Etikett>Merknad til utlevering:</Etikett>
            <Tekst>{utleveringMerknad}</Tekst>
          </HStack>
        )}
      </VStack>
      <Skillelinje />
      <Signatur signaturType={behovsmeldingsbruker.signaturtype} navn={formatertNavn} />
      <Skillelinje />
      <Heading level="2" size="small" spacing>
        Formidlers vurdering
      </Heading>
      <TextContainer>
        <Box marginBlock="space-12" asChild>
          <List data-aksel-migrated-v8 as="ul" size="small">
            {vilkår.map((vilkårItem) => (
              <List.Item key={vilkårItem.vilkårtype}>{vilkårItem.tekst.nb}</List.Item>
            ))}
          </List>
        </Box>
      </TextContainer>
      <Skillelinje />
    </>
  )
}
