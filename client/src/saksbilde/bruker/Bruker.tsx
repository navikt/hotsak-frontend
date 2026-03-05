import { Box, Heading, HStack, List, VStack } from '@navikt/ds-react'

import { Kopiknapp } from '../../felleskomponenter/Kopiknapp'
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

export interface BrukerProps {
  bruker: Hjelpemiddelbruker
  behovsmeldingsbruker: Behovsmeldingsbruker
  brukerSituasjon: Brukersituasjon
  levering: Levering
  vilkår: Vilkår[]
  skjulHeading?: boolean
}

export function Bruker({
  bruker,
  behovsmeldingsbruker,
  brukerSituasjon,
  levering,
  vilkår,
  skjulHeading = false,
}: BrukerProps) {
  const { utleveringMerknad } = levering
  const formatertNavn = formaterNavn(bruker)
  const adresseBruker = formaterAdresse(behovsmeldingsbruker.veiadresse)
  const formatertFnr = formaterFødselsnummer(bruker.fnr)
  const formatertTlf = formaterTelefonnummer(bruker.telefon)

  return (
    <>
      {!skjulHeading && (
        <Heading level="2" size="small">
          Hjelpemiddelbruker
        </Heading>
      )}
      <VStack gap="space-4">
        <HStack gap="space-6">
          <Etikett>Navn:</Etikett>
          <Tekst>{formatertNavn}</Tekst>
          <Kopiknapp tooltip="Kopier navn" copyText={formatertNavn} placement="bottom" />
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
          <Kopiknapp tooltip="Kopier telefon" copyText={formatertTlf} placement="bottom" />
        </HStack>
        <HStack gap="space-6">
          <Etikett>Funksjonsnedsettelse:</Etikett>
          <Tekst>{storForbokstavIAlleOrd(brukerSituasjon.funksjonsnedsettelser.join(', '))}</Tekst>
        </HStack>
      </VStack>

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
