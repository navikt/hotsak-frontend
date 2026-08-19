import { BodyShort, Button, DatePicker, Label, Select, useDatepicker, VStack, HStack } from '@navikt/ds-react'
import { formatISO } from 'date-fns'
import { type ReactNode, useState } from 'react'

import { formaterDato } from '../utils/dato.ts'
import classes from './JournalføringV2Skjema.module.css'

export function InlineRedigerbarSelect({
  label,
  verdi,
  tekst,
  kanRedigere,
  onLagre,
  error,
  className,
  children,
}: {
  label: string
  verdi: string
  tekst: string
  kanRedigere: boolean
  onLagre: (ny: string) => void
  error?: string
  className?: string
  children: ReactNode
}) {
  const [redigerer, setRedigerer] = useState(false)

  if (redigerer) {
    return (
      <VStack gap="space-4">
        <Label size="small">{label}</Label>
        <div className={className}>
          <Select
            label=""
            hideLabel
            size="small"
            defaultValue={verdi}
            autoFocus
            error={error ? <span className={classes.errorWrap}>{error}</span> : undefined}
            onChange={(e) => {
              onLagre(e.target.value)
            }}
          >
            {children}
          </Select>
        </div>
      </VStack>
    )
  }

  return (
    <VStack gap="space-4">
      <Label size="small">{label}</Label>
      <HStack align="center">
        <BodyShort size="small">{tekst}</BodyShort>
        {kanRedigere && (
          <Button variant="tertiary" size="xsmall" type="button" onClick={() => setRedigerer(true)}>
            Endre
          </Button>
        )}
      </HStack>
    </VStack>
  )
}

export function InlineRedigerbarDato({
  label,
  verdi,
  kanRedigere,
  onLagre,
}: {
  label: string
  verdi: Date
  kanRedigere: boolean
  onLagre: (dato: Date) => void
}) {
  const [redigerer, setRedigerer] = useState(false)

  const { datepickerProps, inputProps } = useDatepicker({
    defaultSelected: verdi,
    onDateChange: (dato) => {
      if (dato) {
        onLagre(dato)
      }
    },
  })

  if (redigerer) {
    return (
      <VStack gap="space-4">
        <Label size="small">{label}</Label>
        <DatePicker {...datepickerProps}>
          <DatePicker.Input {...inputProps} label="" hideLabel size="small" autoFocus />
        </DatePicker>
      </VStack>
    )
  }

  return (
    <VStack gap="space-4">
      <Label size="small">{label}</Label>
      <HStack align="center">
        <BodyShort size="small">{formaterDato(formatISO(verdi, { representation: 'date' }))}</BodyShort>
        {kanRedigere && (
          <Button variant="tertiary" size="xsmall" type="button" onClick={() => setRedigerer(true)}>
            Endre
          </Button>
        )}
      </HStack>
    </VStack>
  )
}
