import { Box, Heading, HStack, VStack } from '@navikt/ds-react'
import { Levering, Oppfølgingsansvarlig } from '../../types/BehovsmeldingTypes'
import { Etikett, Tekst } from '../../felleskomponenter/typografi'
import { Kopiknapp } from '../../felleskomponenter/Kopiknapp'
import { formaterAdresse, formaterNavn, formaterTelefonnummer, storForbokstavIAlleOrd } from '../../utils/formater'
import { Skillelinje } from '../../felleskomponenter/Strek'
import { useNyttSaksbilde } from '../../sak/v2/useNyttSaksbilde'

interface FormidlerProps {
  levering: Levering
}

export function Formidler({ levering }: FormidlerProps) {
  const { hjelpemiddelformidler: formidler, oppfølgingsansvarlig, annenOppfølgingsansvarlig } = levering
  const nyttSaksbilde = useNyttSaksbilde()

  const InfoFormidler = () => {
    return (
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
        <HStack gap="space-6" align="center">
          <Etikett>Navn</Etikett>
          <HStack align="center" wrap={false}>
            <Tekst>{formaterNavn(oppfølging.navn)}</Tekst>
            <Kopiknapp tooltip="Kopier navn" copyText={formaterNavn(oppfølging.navn)} placement="bottom" />
          </HStack>
        </HStack>
        <HStack gap="space-6">
          <Etikett>Arbeidssted</Etikett>
          <Tekst>{`${storForbokstavIAlleOrd(oppfølging.arbeidssted)}`}</Tekst>
        </HStack>
        <HStack gap="space-6">
          <Etikett>Stilling</Etikett>
          <Tekst>{`${storForbokstavIAlleOrd(oppfølging.stilling)}`}</Tekst>
        </HStack>
        <HStack gap="space-6">
          <Etikett>Telefon</Etikett>
          <HStack align="center" wrap={false}>
            <Tekst>{formaterTelefonnummer(oppfølging.telefon)}</Tekst>
            <Kopiknapp tooltip="Kopier telefon" copyText={oppfølging.telefon} placement="bottom" />
          </HStack>
        </HStack>
        <HStack gap="space-6">
          <Etikett>Ansvar</Etikett>
          <Tekst>{storForbokstavIAlleOrd(oppfølging.ansvarFor)}</Tekst>
        </HStack>
      </VStack>
    )
  }

  return (
    <div style={{ paddingBlock: '0 var(--ax-space-64)' }}>
      <Box.New paddingBlock="space-12 0" paddingInline="space-32 0">
        <Heading level="2" size="small" spacing={!nyttSaksbilde}>
          Hjelpemiddelformidler
        </Heading>
        <Box paddingBlock="space-16 0">
          <InfoFormidler />
        </Box>
      </Box.New>
      {oppfølgingsansvarlig && (
        <Box.New paddingBlock="space-12 0" paddingInline="space-32 0">
          <>
            <Skillelinje />
            <Heading level="2" size="small" spacing={!nyttSaksbilde}>
              Oppfølgings- og opplæringsansvarlig
            </Heading>
            <Box paddingBlock="space-16 0">
              <InfoOppfølgingsansvarlig />
            </Box>
          </>
        </Box.New>
      )}
    </div>
  )
}
