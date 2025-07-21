import { CheckboxGroup, HGrid } from '@navikt/ds-react'
import { Controller, useFormContext } from 'react-hook-form'

import type { AlternativeProduct } from '../useAlternativeProdukter.ts'
import { AlternativtProduktCard } from './AlternativtProduktCard.tsx'

interface AlternativProduktVelgerProps {
  alternativeProdukter: AlternativeProduct[]
}

export function AlternativtProduktVelger({ alternativeProdukter }: AlternativProduktVelgerProps) {
  const { control } = useFormContext()

  return (
    <Controller
      name="endretProdukt"
      control={control}
      rules={{ required: 'Du må velge et alternativ' }}
      render={({ field, fieldState }) => (
        <CheckboxGroup
          legend="Velg alternativ"
          hideLegend
          name={field.name}
          onChange={(val) => field.onChange(val.slice(-1))}
          value={field.value}
          size="small"
          error={fieldState.error?.message}
        >
          <HGrid columns={'1fr 1fr'} gap="4" paddingBlock={'2 0'}>
            {alternativeProdukter.map((produkt) => (
              <AlternativtProduktCard key={produkt.id} alternativtProdukt={produkt} endretProdukt={field.value} />
            ))}
          </HGrid>
        </CheckboxGroup>
      )}
    />
  )
}
