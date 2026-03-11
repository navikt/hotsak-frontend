import { Box, HStack, List, ReadMore, VStack } from '@navikt/ds-react'
import { Kopiknapp } from '../../../felleskomponenter/Kopiknapp'
import { Skillelinje } from '../../../felleskomponenter/Strek'
import { Etikett, Tekst, TextContainer } from '../../../felleskomponenter/typografi'
import { Bruker as Behovsmeldingsbruker, Brukerkilde, Brukersituasjon, Vilkår } from '../../../types/BehovsmeldingTypes'
import { Bruker as Hjelpemiddelbruker } from '../../../types/types.internal'
import {
  formaterAdresse,
  formaterFødselsnummer,
  formaterNavn,
  formaterTelefonnummer,
  storForbokstavIAlleOrd,
} from '../../../utils/formater'

export interface BrukerProps {
  bruker: Hjelpemiddelbruker
  behovsmeldingsbruker: Behovsmeldingsbruker
  brukerSituasjon: Brukersituasjon
  vilkår: Vilkår[]
  skjulHeading?: boolean
}

export function BrukerV2({ bruker, behovsmeldingsbruker, brukerSituasjon, vilkår }: BrukerProps) {
  const formatertNavn = formaterNavn(bruker)
  const adresseBruker = formaterAdresse(behovsmeldingsbruker.veiadresse)
  const formatertFnr = formaterFødselsnummer(bruker.fnr)
  const formatertTlf = formaterTelefonnummer(bruker.telefon)

  return (
    <Box paddingInline={'space-12 space-8'} paddingBlock="space-8">
      <VStack gap="space-4">
        <HStack gap="space-6">
          <Etikett>Navn:</Etikett>
          <Tekst>{formatertNavn}</Tekst>
          <Kopiknapp tooltip="Kopier navn" copyText={formatertNavn} placement="bottom" />
        </HStack>
        <HStack gap="space-6">
          <Etikett>Fødselsnummer:</Etikett>
          <Tekst>{formatertFnr}</Tekst>
          <Kopiknapp tooltip="Kopier fødselsnummer" copyText={bruker.fnr} placement="bottom" />
        </HStack>
        <HStack gap="space-6">
          <Etikett> {behovsmeldingsbruker.kilde === Brukerkilde.PDL ? 'Folkeregistert adresse:' : 'Adresse:'}</Etikett>
          <Tekst>{adresseBruker}</Tekst>
          <Kopiknapp tooltip="Kopier adresse" copyText={adresseBruker} placement="bottom" />
        </HStack>
        <HStack gap="space-6">
          <Etikett>Telefon:</Etikett>
          <Tekst>{formatertTlf}</Tekst>
          <Kopiknapp tooltip="Kopier telefon" copyText={bruker.telefon || ''} placement="bottom" />
        </HStack>
        <HStack gap="space-6">
          <Etikett>Funksjonsnedsettelse:</Etikett>
          <Tekst>{storForbokstavIAlleOrd(brukerSituasjon.funksjonsnedsettelser.join(', '))}</Tekst>
        </HStack>
      </VStack>

      <Skillelinje />
      <TextContainer>
        <ReadMore size="small" header="Formidler har vurdert at disse vilkårende er oppfylt">
          <List data-aksel-migrated-v8 as="ul" size="small">
            {vilkår.map((vilkårItem) => (
              <List.Item key={vilkårItem.vilkårtype}>{vilkårItem.tekst.nb}</List.Item>
            ))}
          </List>
        </ReadMore>
      </TextContainer>
    </Box>
  )
}
