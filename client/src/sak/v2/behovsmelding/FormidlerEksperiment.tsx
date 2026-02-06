import { Box, Heading, HStack, VStack } from '@navikt/ds-react'
import { Skillelinje } from '../../../felleskomponenter/Strek'
import { Brødtekst, Etikett, Tekst } from '../../../felleskomponenter/typografi'
import { FormidlerProps } from '../../../saksbilde/formidler/Formidler'
import { Oppfølgingsansvarlig } from '../../../types/BehovsmeldingTypes'
import { formaterAdresse, formaterNavn, formaterTelefonnummer, storForbokstavIAlleOrd } from '../../../utils/formater'

export function FormidlerEksperiment({ levering }: FormidlerProps) {
  const { hjelpemiddelformidler: formidler, oppfølgingsansvarlig, annenOppfølgingsansvarlig } = levering

  const InfoFormidler = () => {
    return (
      <VStack gap="space-4">
        <HStack gap="space-6">
          <Etikett>Navn:</Etikett>
          <Tekst>{formaterNavn(formidler.navn)}</Tekst>
        </HStack>
        <HStack gap="space-6">
          <Etikett>Arbeidssted:</Etikett>
          <Tekst>{`${storForbokstavIAlleOrd(formidler.arbeidssted)}`}</Tekst>
        </HStack>
        <HStack gap="space-6">
          <Etikett>Stilling:</Etikett>
          <Tekst>{`${storForbokstavIAlleOrd(formidler.stilling)}`}</Tekst>
        </HStack>
        <HStack gap="space-6">
          <Etikett>Postadresse:</Etikett>
          <Tekst>{`${storForbokstavIAlleOrd(formidler.adresse.poststed)}`}</Tekst>
        </HStack>
        <HStack gap="space-6">
          <Etikett>Telefon:</Etikett>
          <Tekst>{formaterTelefonnummer(formidler.telefon)}</Tekst>
        </HStack>
        <HStack gap="space-6">
          <Etikett>Treffest enklest:</Etikett>
          <Tekst>{storForbokstavIAlleOrd(formaterAdresse(formidler.adresse))}</Tekst>
        </HStack>
        <HStack gap="space-6">
          <Etikett>E-postadresse:</Etikett>
          <Tekst>{formidler.epost}</Tekst>
        </HStack>
      </VStack>
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
      <VStack gap="space-4">
        <HStack gap="space-6">
          <Etikett>Navn</Etikett>
          <Brødtekst>{formaterNavn(oppfølging.navn)}</Brødtekst>
        </HStack>
        <HStack gap="space-6">
          <Etikett>Arbeidssted</Etikett>
          <Brødtekst>{`${storForbokstavIAlleOrd(oppfølging.arbeidssted)}`}</Brødtekst>
        </HStack>
        <HStack gap="space-6">
          <Etikett>Stilling</Etikett>
          <Brødtekst>{`${storForbokstavIAlleOrd(oppfølging.stilling)}`}</Brødtekst>
        </HStack>
        <HStack gap="space-6">
          <Etikett>Telefon</Etikett>
          <Brødtekst>{formaterTelefonnummer(oppfølging.telefon)}</Brødtekst>
        </HStack>
        <HStack gap="space-6">
          <Etikett>Ansvar</Etikett>
          <Brødtekst>{storForbokstavIAlleOrd(oppfølging.ansvarFor)}</Brødtekst>
        </HStack>
      </VStack>
    )
  }

  return (
    <>
      <Box.New paddingBlock="space-12 0" paddingInline="space-32 0">
        <Heading level="2" size="small" spacing={false}>
          Hjelpemiddelformidler
        </Heading>
        <Box paddingBlock="space-16 0">
          <InfoFormidler />
        </Box>
      </Box.New>
      <Box.New paddingBlock="space-12 0" paddingInline="space-32 0">
        {oppfølgingsansvarlig && (
          <>
            <Skillelinje />
            <Heading level="2" size="small" spacing={false}>
              Oppfølgings- og opplæringsansvarlig
            </Heading>
            <InfoOppfølgingsansvarlig />
          </>
        )}
      </Box.New>
    </>
  )
}
