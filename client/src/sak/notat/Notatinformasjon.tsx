import { BodyLong, Box, Label, List, ReadMore } from '@navikt/ds-react'

export function Notatinformasjon() {
  return (
    <ReadMore size="small" header="Når skal du bruke de ulike notattypene">
      <Label size="small" as="div">
        Internt arbeidsnotat
      </Label>
      <BodyLong size="small" spacing>
        Brukes for egne notater, for eksempel huskelapper til deg selv. Disse journalføres ikke. Merk at brukere kan få
        innsyn i interne notater hvis de ber om det.
      </BodyLong>
      <Label size="small" as="div">
        Forvaltningsnotat
      </Label>
      <BodyLong size="small">
        Brukes hvis du skal dokumentere opplysninger som kan ha betydning for utfallet av en sak. Disse notatene blir
        journalført. Vi har to typer forvaltningsnotat:
      </BodyLong>
      <Box marginBlock="space-12" asChild>
        <List data-aksel-migrated-v8 size="small" as="ul">
          <List.Item>
            <Label size="small" as="div">
              Interne saksopplysninger:
            </Label>
            <BodyLong size="small">
              Opplysninger som kan ha betydning for saken som for eksempel gjengir innholdet i en iakttakelse, et møte,
              en befaring eller en uttalelse fra intern fagperson. Notatet vil ikke være synlig på brukers side på
              nav.no, men bruker vil kunne be om innsyn i det.
            </BodyLong>
          </List.Item>
          <List.Item>
            <Label size="small" as="div">
              Eksterne saksopplysninger:
            </Label>
            <BodyLong size="small">
              Opplysninger som gjengir innholdet i en henvendelse eller dialog med tredjepart. Bruker vil få innsyn i
              notatet på innlogget side på nav.no fra første virkedag etter at det er ferdigstilt.
            </BodyLong>
          </List.Item>
        </List>
      </Box>
    </ReadMore>
  )
}
