import { Box, Heading, HStack, List, VStack } from '@navikt/ds-react'
import { Skillelinje } from '../../../../../felleskomponenter/Strek'
import { Etikett, Tekst, TextContainer } from '../../../../../felleskomponenter/typografi'
import { BrukerProps } from '../../../../../saksbilde/bruker/Bruker'
import { Brukerkilde } from '../../../../../types/BehovsmeldingTypes'
import {
  formaterAdresse,
  formaterFødselsnummer,
  formaterNavn,
  formaterTelefonnummer,
  storForbokstavIAlleOrd,
} from '../../../../../utils/formater'
import { KontaktpersonEksperiment } from './KontaktpersonEksperiment'
import { LeveringsmåteEksperiment } from './LeveringsmåteEksperiment'
import { SignaturEksperiment } from './signatur/Signatur'

export function BrukerEksperiment({ bruker, behovsmeldingsbruker, brukerSituasjon, levering, vilkår }: BrukerProps) {
  const { utleveringMerknad } = levering
  const formatertNavn = formaterNavn(bruker)
  const adresseBruker = formaterAdresse(behovsmeldingsbruker.veiadresse)
  const formatertFnr = formaterFødselsnummer(bruker.fnr)
  const formatertTlf = formaterTelefonnummer(bruker.telefon)

  return (
    <Box.New paddingBlock="space-24 0" paddingInline="space-32 0">
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
        <LeveringsmåteEksperiment levering={levering} adresseBruker={adresseBruker} />
        <KontaktpersonEksperiment levering={levering} />
        {utleveringMerknad && (
          <HStack gap="space-6" paddingBlock="0 space-12" align="center">
            <Etikett>Merknad til utlevering:</Etikett>
            <Tekst>{utleveringMerknad}</Tekst>
          </HStack>
        )}
      </VStack>

      <Skillelinje />
      <SignaturEksperiment signaturType={behovsmeldingsbruker.signaturtype} navn={formatertNavn} />
      <Skillelinje />
      <Heading level="2" size="small" spacing>
        Formidlers vurdering
      </Heading>
      <TextContainer>
        <List as="ul" size="small">
          {vilkår.map((vilkårItem) => (
            <List.Item key={vilkårItem.vilkårtype}>{vilkårItem.tekst.nb}</List.Item>
          ))}
        </List>
      </TextContainer>
      <Skillelinje />
    </Box.New>
  )
}
