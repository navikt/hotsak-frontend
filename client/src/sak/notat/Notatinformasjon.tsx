import { BodyLong, Box, Label, List, ReadMore } from '@navikt/ds-react'

export function Notatinformasjon() {
  return (
    <ReadMore size="small" header="Når skal du bruke de ulike notattypene">
      <Label size="small" as="div">
        Kommentarer
      </Label>
      <BodyLong size="small" spacing>
        Her kan du legge inn kommentarer til deg selv eller andre som skal behandle oppgaven. Kommentarer vises både på
        oppgaven her i Hotsak og i Gosys uavhengig av hvor kommentaren er skrevet. Vær oppmerksom på at hele eller deler
        av kommentarer kan være synlig i ulike sammenhenger, både i lister og for ulike enheter og ressurser.
        Kommentarer kan ikke endres eller slettes når de er lagret. Merk at brukere kan få innsyn i kommentarer hvis de
        ber om det.
      </BodyLong>
      <Label size="small" as="div">
        Forvaltningsnotater
      </Label>
      <BodyLong size="small">
        Her kan du dokumentere opplysninger som kan ha betydning for utfallet av en sak. Forvaltningsnotater kan ikke
        endres eller slettes når de er journalført. Vi har to typer forvaltningsnotater:
      </BodyLong>
      <Box marginBlock="space-12" asChild>
        <List data-aksel-migrated-v8 size="small" as="ul">
          <List.Item>
            <Label size="small" as="div">
              Interne saksopplysninger:
            </Label>
            <BodyLong size="small">
              Opplysninger som kan ha betydning for saken som for eksempel gjengir innholdet i en iakttakelse, et møte,
              en befaring eller en uttalelse fra intern fagperson. Forvaltningsnotatet vil ikke være synlig på brukers
              side på nav.no, men bruker vil kunne be om innsyn i det.
            </BodyLong>
          </List.Item>
          <List.Item>
            <Label size="small" as="div">
              Eksterne saksopplysninger:
            </Label>
            <BodyLong size="small">
              Opplysninger som gjengir innholdet i en henvendelse eller dialog med tredjepart. Bruker har innsyn i
              forvaltningsnotatet på innlogget side på nav.no fra første virkedag etter at det er ferdigstilt.
            </BodyLong>
          </List.Item>
        </List>
      </Box>
    </ReadMore>
  )
}
