import { Box, HStack, VStack } from '@navikt/ds-react'
import { Kopiknapp } from '../../../felleskomponenter/Kopiknapp'
import { Etikett, Tekst } from '../../../felleskomponenter/typografi'
import { Levering, Oppfølgingsansvarlig } from '../../../types/BehovsmeldingTypes'
import { formaterAdresse, formaterNavn, formaterTelefonnummer, storForbokstavIAlleOrd } from '../../../utils/formater'

interface FormidlerProps {
  levering: Levering
}

export function FormidlerV2({ levering }: FormidlerProps) {
  const { hjelpemiddelformidler: formidler } = levering

  return (
    <Box paddingInline={'space-12 space-8'} paddingBlock="space-8">
      <VStack gap="space-4">
        <HStack gap="space-6">
          <Etikett>Navn:</Etikett>
          <HStack align="center" wrap={false}>
            <Tekst>{formaterNavn(formidler.navn)}</Tekst>
            <Kopiknapp tooltip="Kopier navn" copyText={formaterNavn(formidler.navn)} placement="bottom" />
          </HStack>
        </HStack>
        <HStack gap="space-6">
          <Etikett>Arbeidssted:</Etikett>
          <Tekst>{`${storForbokstavIAlleOrd(formidler.arbeidssted)}`}</Tekst>
          <Kopiknapp
            tooltip="Kopier arbeidssted"
            copyText={`${storForbokstavIAlleOrd(formidler.arbeidssted)}`}
            placement="bottom"
          />
        </HStack>
        <HStack gap="space-6">
          <Etikett>Stilling:</Etikett>
          <Tekst>{`${storForbokstavIAlleOrd(formidler.stilling)}`}</Tekst>
        </HStack>
        <HStack gap="space-6">
          <Etikett>Postadresse:</Etikett>
          <Tekst>{`${storForbokstavIAlleOrd(formidler.adresse.poststed)}`}</Tekst>
          <Kopiknapp
            tooltip="Kopier postadresse"
            copyText={`${storForbokstavIAlleOrd(formidler.adresse.poststed)}`}
            placement="bottom"
          />
        </HStack>
        <HStack gap="space-6">
          <Etikett>Telefon:</Etikett>
          <HStack align="center" wrap={false}>
            <Tekst>{formaterTelefonnummer(formidler.telefon)}</Tekst>
            <Kopiknapp tooltip="Kopier telefon" copyText={formidler.telefon} placement="bottom" />
          </HStack>
        </HStack>
        <HStack gap="space-6">
          <Etikett>Treffest enklest:</Etikett>
          <Tekst>{storForbokstavIAlleOrd(formaterAdresse(formidler.adresse))}</Tekst>
        </HStack>
        <HStack gap="space-6">
          <Etikett>E-postadresse:</Etikett>
          <HStack align="center" wrap={false}>
            <Tekst>{formidler.epost}</Tekst>
            <Kopiknapp tooltip="Kopier e-post" copyText={formidler.epost} placement="bottom" />
          </HStack>
        </HStack>
      </VStack>
    </Box>
  )
}

export function OppfølgingsansvarligV2({ levering }: { levering: Levering }) {
  const { hjelpemiddelformidler: formidler, oppfølgingsansvarlig, annenOppfølgingsansvarlig } = levering
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
    <Box paddingInline={'space-12 space-8'} paddingBlock="space-8">
      <VStack gap="space-4">
        <HStack gap="space-6" align="center">
          <Etikett>Navn:</Etikett>
          <HStack align="center" wrap={false}>
            <Tekst>{formaterNavn(oppfølging.navn)}</Tekst>
            <Kopiknapp tooltip="Kopier navn" copyText={formaterNavn(oppfølging.navn)} placement="bottom" />
          </HStack>
        </HStack>
        <HStack gap="space-6" align="center">
          <Etikett>Arbeidssted:</Etikett>
          <Tekst>{`${storForbokstavIAlleOrd(oppfølging.arbeidssted)}`}</Tekst>
          <Kopiknapp
            tooltip="Kopier arbeidssted"
            copyText={`${storForbokstavIAlleOrd(oppfølging.arbeidssted)}`}
            placement="bottom"
          />
        </HStack>
        <HStack gap="space-6" align="center">
          <Etikett>Stilling:</Etikett>
          <Tekst>{`${storForbokstavIAlleOrd(oppfølging.stilling)}`}</Tekst>
          <Kopiknapp
            tooltip="Kopier stilling"
            copyText={`${storForbokstavIAlleOrd(oppfølging.stilling)}`}
            placement="bottom"
          />
        </HStack>
        <HStack gap="space-6" align="center">
          <Etikett>Telefon:</Etikett>
          <HStack align="center" wrap={false}>
            <Tekst>{formaterTelefonnummer(oppfølging.telefon)}</Tekst>
            <Kopiknapp tooltip="Kopier telefon" copyText={oppfølging.telefon} placement="bottom" />
          </HStack>
        </HStack>
        {oppfølging.ansvarFor && (
          <HStack gap="space-6" align="center">
            <Etikett>Ansvar:</Etikett>
            <Tekst>{storForbokstavIAlleOrd(oppfølging.ansvarFor)}</Tekst>
          </HStack>
        )}
      </VStack>
    </Box>
  )
}
