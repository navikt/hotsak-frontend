import { Box, Heading, Label, List, VStack } from '@navikt/ds-react'
import { ListItem } from '@navikt/ds-react/List'
import { CompactExpandableCard } from '../../../felleskomponenter/panel/CompactExpandableCard'
import { Skillelinje } from '../../../felleskomponenter/Strek'
import { BrytbarBrødtekst, Tekst, TextContainer } from '../../../felleskomponenter/typografi'
import { usePerson } from '../../../personoversikt/usePerson'
import { useBehovsmelding } from '../../../saksbilde/useBehovsmelding'
import { useSak } from '../../../saksbilde/useSak'
import { Funksjonsbeskrivelse } from '../../../types/BehovsmeldingTypes'
import { Vergemål } from '../../../types/types.internal'
import { formaterNavn, storForbokstavIOrd } from '../../../utils/formater'
import { WarningTag } from '../../felles/AlertTag'
import { tekstByFunksjonsnedsettelse } from './tilbehør/funksjonsnedsettelser'

export function FunksjonsbeskrivelseV2(props: { funksjonsbeskrivelse?: Funksjonsbeskrivelse }) {
  const { funksjonsbeskrivelse } = props
  const { harKunTilbehør } = useBehovsmelding()
  const { sak } = useSak()
  const { personInfo } = usePerson(sak?.data.bruker.fnr)
  const vergemål = personInfo?.vergemål || []

  return (
    <CompactExpandableCard tittel="Om brukeren" defaultOpen={!!funksjonsbeskrivelse}>
      <Box paddingInline={'space-12 space-8'} paddingBlock="space-8">
        <FunksjonsbeskrivelseContent funksjonsbeskrivelse={funksjonsbeskrivelse} harKunTilbehør={harKunTilbehør} />
        <VergemålInfo vergemål={vergemål} />
      </Box>
    </CompactExpandableCard>
  )
}

function FunksjonsbeskrivelseContent({
  funksjonsbeskrivelse,
  harKunTilbehør,
}: {
  funksjonsbeskrivelse?: Funksjonsbeskrivelse
  harKunTilbehør: boolean
}) {
  if (!funksjonsbeskrivelse) {
    if (harKunTilbehør) {
      return (
        <>
          <Heading size="xsmall" spacing>
            Funksjonsbeskrivelse
          </Heading>
          <TextContainer>
            <Tekst>
              Det er kun søkt om tilbehør i denne saken. Beskrivelse av brukers funksjon vil som oftest gå frem av
              søknaden om hjelpemidlet som tilbehøret skal brukes sammen med. Fordi Nav allerede har denne
              informasjonen, anses det ikke nødvendig å oppgi funksjonsbeskrivelsen en gang til.
            </Tekst>
          </TextContainer>
        </>
      )
    }

    return (
      <>
        <Heading size="xsmall" spacing>
          Funksjonsbeskrivelse
        </Heading>
        <TextContainer>
          <Tekst>
            Behovsmeldingen ble automatisk gjort om fra bestilling til søknad, da Hotsak av tekniske årsaker ikke kan
            opprette en ordre i denne saken. Søknaden oppfyller kravene til bestillingsordningen. Derfor har ikke
            søknaden en funksjonsbeskrivelse.
          </Tekst>
        </TextContainer>
      </>
    )
  }

  const { beskrivelse } = funksjonsbeskrivelse

  return (
    <VStack>
      <Label size="small" as="h2" textColor="subtle" spacing>
        Sykdom, skade, lyte
      </Label>
      <TextContainer>
        <Tekst>{tekstByFunksjonsnedsettelse(funksjonsbeskrivelse)}</Tekst>
      </TextContainer>
      {beskrivelse && (
        <>
          <Skillelinje />
          <Label size="small" as="h2" textColor="subtle" spacing>
            Funksjonsbeskrivelse
          </Label>
          <TextContainer>
            <BrytbarBrødtekst>{beskrivelse}</BrytbarBrødtekst>
          </TextContainer>
        </>
      )}
    </VStack>
  )
}

function VergemålInfo({ vergemål }: { vergemål: Vergemål[] }) {
  if (vergemål.length === 0) return null

  return (
    <>
      <Skillelinje />
      <Label size="small" as="h2" textColor="subtle" spacing>
        Vergemål
      </Label>
      <WarningTag>{vergemål.length > 1 ? 'Personen har verger' : 'Personen har verge'}</WarningTag>
      {vergemål.map((v, index) => (
        <VStack key={index} gap="space-0" marginBlock="space-4 space-0">
          {vergemål.length > 1 && <Label size="small" as="h3">{`Verge ${index + 1}`}</Label>}
          <List as="ul" size="small">
            <ListItem>
              <strong>Type: </strong>
              {v.type ? storForbokstavIOrd(v.type) : '-'}
            </ListItem>
            <ListItem>
              <strong>Tjenesteområde: </strong> Hjelpemidler (Nav)
            </ListItem>
            <ListItem>
              <strong>Vergens navn: </strong>
              {v.vergeEllerFullmektig.identifiserendeInformasjon?.navn
                ? formaterNavn(v.vergeEllerFullmektig.identifiserendeInformasjon.navn)
                : '-'}
            </ListItem>
          </List>
        </VStack>
      ))}
    </>
  )
}
