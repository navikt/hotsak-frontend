import { UNSAFE_Combobox } from '@navikt/ds-react'
import { type KeyboardEvent, useRef, useState } from 'react'

interface AnnetInnholdProps {
  alternativer: string[]
  valgteChips: string[]
  onChipsChange(chips: string[]): void
  readOnly?: boolean
}

export function AnnetInnhold({ alternativer, valgteChips, onChipsChange, readOnly = false }: AnnetInnholdProps) {
  const input = useRef<HTMLInputElement>(null)
  const valgMedEnter = useRef(false)
  const [erListeLukket, setErListeLukket] = useState(false)

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== input.current) return
    valgMedEnter.current = event.key === 'Enter'
    if (event.key !== 'Enter' && event.key !== 'Escape' && event.key !== 'Tab') {
      setErListeLukket(false)
    }
  }

  function tilbakestillEnter() {
    valgMedEnter.current = false
  }

  function handlePointerDown() {
    tilbakestillEnter()
    setErListeLukket(false)
  }

  function handleInput() {
    setErListeLukket(false)
  }

  function handleToggleSelected(option: string, isSelected: boolean) {
    onChipsChange(isSelected ? [...valgteChips, option] : valgteChips.filter((chip) => chip !== option))
    if (isSelected && valgMedEnter.current) setErListeLukket(true)
  }

  return (
    <div
      onKeyDownCapture={handleKeyDown}
      onKeyUp={tilbakestillEnter}
      onPointerDownCapture={handlePointerDown}
      onPointerUpCapture={tilbakestillEnter}
      onInputCapture={handleInput}
    >
      <UNSAFE_Combobox
        ref={input}
        allowNewValues
        label="Annet innhold"
        size="small"
        options={alternativer}
        selectedOptions={valgteChips}
        isListOpen={erListeLukket ? false : undefined}
        onToggleSelected={handleToggleSelected}
        isMultiSelect
        readOnly={readOnly}
      />
    </div>
  )
}
