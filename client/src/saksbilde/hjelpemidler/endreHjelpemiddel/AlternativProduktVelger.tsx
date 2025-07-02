import { CheckboxGroup, HGrid } from '@navikt/ds-react'
import { Controller, useFormContext } from 'react-hook-form'
import { AlternativeProduct } from '../../../generated/finnAlternativprodukt'
import { AlternativProduktCard } from './AlternativProduktCard'

interface AlternativProduktVelgerProps {
  onMutate: () => void
  alternativer: AlternativeProduct[]
  henterLagerstatus: boolean
  harOppdatertLagerstatus: boolean
}

export function AlternativProduktVelger({
  alternativer,
  onMutate,
  henterLagerstatus,
  harOppdatertLagerstatus,
}: AlternativProduktVelgerProps) {
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
            {alternativer.map((alternativ) => (
              <AlternativProduktCard
                key={alternativ.id}
                alternativ={alternativ}
                onMutate={onMutate}
                endretProdukt={field.value}
                lagerstatusLoading={henterLagerstatus}
                skjulLagerstatusKnapp={harOppdatertLagerstatus}
              />
            ))}
          </HGrid>
        </CheckboxGroup>
      )}
    />
  )
}
