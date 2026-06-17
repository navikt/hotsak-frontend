import { Button, HStack, Select, UNSAFE_Combobox, VStack } from '@navikt/ds-react'

import { type Dokument } from '../types/types.internal.ts'
import { AvrundetPanel } from '../sak/v2/paneler/AvrundetPanel.tsx'

interface DokumentRadProps {
  dokument: Dokument
  index: number
  total: number
  valgtTittel: string
  onTittelChange(tittel: string): void
  valgteChips: string[]
  onChipsChange(chips: string[]): void
}

export function DokumentRad({
  dokument,
  index,
  total,
  valgtTittel,
  onTittelChange,
  valgteChips,
  onChipsChange,
}: DokumentRadProps) {
  const dokumentTittelOptions = ['Søknad om hjelpemidler', 'Legeerklæring', 'Vedlegg', 'Fullmakt', 'Kvittering']

  const annetInnholdOptions = ['Fullmakt', 'Legeerklæring', 'Kvittering', 'Annet vedlegg']

  return (
    <AvrundetPanel>
      <VStack gap="space-6">
        <HStack align="end" gap="space-4">
          <Select
            label={`Dokumenttittel (${index + 1} av ${total})`}
            size="small"
            value={valgtTittel}
            onChange={(e) => onTittelChange(e.target.value)}
            style={{ flex: 1 }}
          >
            {dokumentTittelOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
          <Button
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
          label="Annet innhold"
          size="small"
          options={annetInnholdOptions}
          selectedOptions={valgteChips}
          onToggleSelected={(option, isSelected) => {
            onChipsChange(isSelected ? [...valgteChips, option] : valgteChips.filter((c) => c !== option))
          }}
          isMultiSelect
        />
      </VStack>
    </AvrundetPanel>
  )
}
