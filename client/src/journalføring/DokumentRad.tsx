import { Box, Button, HStack, UNSAFE_Combobox, VStack } from '@navikt/ds-react'

import { TextContainer } from '../felleskomponenter/typografi.tsx'
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
              label={`Dokumenttittel (${index + 1} av ${total})`}
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
