import { Box, CheckboxGroup, HGrid } from '@navikt/ds-react'
import { Controller, useFormContext } from 'react-hook-form'

import type { AlternativeProduct } from '../../useAlternativeProdukter.ts'
import { AlternativtProduktCard } from './AlternativtProduktCard.tsx'
import { Brødtekst } from '../../../../felleskomponenter/typografi.tsx'
import { formaterRelativTid } from '../../../../utils/dato.ts'

interface AlternativProduktVelgerProps {
  alternativeProdukter: AlternativeProduct[]
}

export function AlternativtProduktVelger({ alternativeProdukter }: AlternativProduktVelgerProps) {
  const { control } = useFormContext()

  const lagerStatusOppdatert = alternativeProdukter.at(0)?.wareHouseStock?.at(0)?.updated || null

  return (
    <>
      <Box.New paddingBlock={'0 space-16'}>
        {lagerStatusOppdatert && (
          <Brødtekst>{`Lagerstatus oppdatert: ${formaterRelativTid(lagerStatusOppdatert)}`}</Brødtekst>
        )}
      </Box.New>
      <Controller
        name="endretProdukt"
        control={control}
        rules={{ required: 'Du må velge et alternativ' }}
        render={({ field, fieldState }) => (
          <CheckboxGroup
            legend="Velg alternativ"
            hideLegend
            name={field.name}
            onChange={(value) => {
              field.onChange(value.at(-1))
            }}
            value={[field.value]}
            size="small"
            error={fieldState.error?.message}
          >
            <HGrid columns="1fr 1fr 1fr" gap="3" height="100%">
              {alternativeProdukter.map((produkt) => (
                <AlternativtProduktCard key={produkt.id} alternativtProdukt={produkt} endretProdukt={field.value} />
              ))}
            </HGrid>
          </CheckboxGroup>
        )}
      />
    </>
  )
}
