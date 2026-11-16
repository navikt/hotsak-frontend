import { UNSAFE_Combobox } from '@navikt/ds-react'
import { type Ref, useMemo, useState } from 'react'

import { type GjelderOption, useGjelderOptions } from '../../oppgave/useKodeverkOppgave.ts'

export interface GjelderVerdi {
  behandlingstema: string
  behandlingstype: string
}

export interface GjelderComboboxProps {
  value: GjelderVerdi
  onChange(verdi: GjelderVerdi): void
  label?: string
  size?: 'medium' | 'small'
  readOnly?: boolean
  className?: string
  error?: string
  name?: string
  ref?: Ref<HTMLInputElement>
  onBlur?(): void
}

export function GjelderCombobox({
  value,
  onChange,
  label = 'Gjelder',
  size = 'small',
  readOnly,
  className,
  error,
  name,
  ref,
  onBlur,
}: GjelderComboboxProps) {
  const [søk, setSøk] = useState('')
  const gjelderOptions = useGjelderOptions()

  const options = useMemo(() => gjelderOptions.map(({ label, value }) => ({ label, value })), [gjelderOptions])

  const filteredOptions = useMemo(
    () => filtrertePåSøk(gjelderOptions, søk).map(({ label, value }) => ({ label, value })),
    [gjelderOptions, søk]
  )

  const valgtVerdi = `${value.behandlingstema}|${value.behandlingstype}`
  const selectedOptions = useMemo(
    () => gjelderOptions.filter((o) => o.value === valgtVerdi).map(({ label, value }) => ({ label, value })),
    [gjelderOptions, valgtVerdi]
  )

  return (
    <UNSAFE_Combobox
      ref={ref}
      name={name}
      label={label}
      size={size}
      shouldAutocomplete
      allowNewValues={false}
      readOnly={readOnly}
      className={className}
      options={options}
      filteredOptions={filteredOptions}
      selectedOptions={selectedOptions}
      value={søk}
      error={error}
      onBlur={onBlur}
      onChange={(verdi) => setSøk(verdi)}
      onToggleSelected={(verdi, isSelected) => {
        if (isSelected) {
          const [behandlingstema, behandlingstype] = verdi.split('|')
          onChange({ behandlingstema: behandlingstema ?? '', behandlingstype: behandlingstype ?? '' })
        } else {
          onChange({ behandlingstema: '', behandlingstype: '' })
        }
        setSøk('')
      }}
    />
  )
}

function filtrertePåSøk(options: GjelderOption[], søk: string): GjelderOption[] {
  if (!søk) return options
  const ord = søk.toLowerCase().split(' ').filter(Boolean)
  return options.filter((o) => ord.every((ord) => o.searchTerms.includes(ord)))
}
