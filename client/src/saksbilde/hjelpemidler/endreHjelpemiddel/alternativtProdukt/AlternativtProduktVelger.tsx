import { CheckboxGroup, HGrid } from '@navikt/ds-react'
import { Controller, useFormContext } from 'react-hook-form'

import type { AlternativeProduct } from '../../useAlternativeProdukter.ts'
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
          onChange={(value) => field.onChange(value.slice(-1))}
          value={field.value}
          size="small"
          error={fieldState.error?.message}
        >
          <HGrid columns="1fr 1fr 1fr" gap="3">
            {alternativeProdukter.map((produkt) => (
              <AlternativtProduktCard key={produkt.id} alternativtProdukt={produkt} endretProdukt={field.value} />
            ))}
          </HGrid>
        </CheckboxGroup>
      )}
    />
  )
}
