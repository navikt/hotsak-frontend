import { Box, Button, HStack, UNSAFE_Combobox, VStack, HelpText, Link } from '@navikt/ds-react'

import { Tekst, TextContainer } from '../felleskomponenter/typografi.tsx'
import { useKodeverkDokumenttitler } from '../oppgave/useKodeverkOppgave.ts'
import { type Dokument } from '../types/types.internal.ts'
import classes from './DokumentRad.module.css'
import { validerDokumenttittel } from './dokumenttittelValidering.ts'

interface DokumentRadProps {
  dokument: Dokument
  index: number
  total: number
  valgtTittel: string
  onTittelChange(tittel: string): void
  valgteChips: string[]
  onChipsChange(chips: string[]): void
  readOnly?: boolean
  visTittelFeil: boolean
}

export function DokumentRad({
  dokument,
  index,
  total,
  valgtTittel,
  onTittelChange,
  valgteChips,
  onChipsChange,
  readOnly = false,
  visTittelFeil,
}: DokumentRadProps) {
  const dokumentTittelOptions = useKodeverkDokumenttitler()

  return (
    <TextContainer>
      <Box borderRadius="12" borderWidth="1" borderColor="neutral-subtle" padding="space-12" background="accent-soft">
        <VStack gap="space-6">
          <HStack align="end" gap="space-4" width="100%" wrap={false}>
            <UNSAFE_Combobox
              className={classes.dokumenttittel}
              label={
                <HStack gap="space-6" align="center">
                  {`Dokumenttittel (${index + 1} av ${total})`}{' '}
                  <HelpText title="right" placement="right">
                    <Tekst>
                      Gode titler som beskriver innholdet i dokumentet og riktig registrering av avsender og mottaker
                      hjelper oss å finne de riktige dokumentene raskt. Det er viktig at tittelen på dokumentet er
                      korrekt og forståelig. <br />
                      <Link
                        href="https://navno.sharepoint.com/sites/intranett-arkiv-og-dokumenthandtering/SitePages/Hvordan%20gi%20dokumentet%20du%20journalf%C3%B8rer%20et%20godt%20navn%20og%20en%20god%20beskrivelse.aspx"
                        target="_blank"
                      >
                        Veiledning på navet
                      </Link>
                    </Tekst>
                  </HelpText>
                </HStack>
              }
              error={visTittelFeil ? validerDokumenttittel(valgtTittel) : undefined}
              size="small"
              options={dokumentTittelOptions}
              selectedOptions={valgtTittel ? [valgtTittel] : []}
              onToggleSelected={(opt, isSelected) => onTittelChange(isSelected ? opt : '')}
              shouldAutocomplete
              allowNewValues={true}
              readOnly={readOnly}
            />
            <Button
              className={classes.apneLenke}
              as="a"
              href={`/api/journalpost/${dokument.journalpostId}/${dokument.dokumentId}`}
              target="_blank"
              rel="noreferrer"
              variant="tertiary"
              size="small"
              type="button"
            >
              Åpne
            </Button>
          </HStack>
          <UNSAFE_Combobox
            allowNewValues
            label="Annet innhold"
            size="small"
            options={dokumentTittelOptions}
            selectedOptions={valgteChips}
            onToggleSelected={(option, isSelected) => {
              onChipsChange(isSelected ? [...valgteChips, option] : valgteChips.filter((c) => c !== option))
            }}
            isMultiSelect
            readOnly={readOnly}
          />
        </VStack>
      </Box>
    </TextContainer>
  )
}
