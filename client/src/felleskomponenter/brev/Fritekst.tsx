import { ChangeEvent, useState } from 'react'
import styled from 'styled-components'

import { Detail, Loader, Textarea } from '@navikt/ds-react'

export const Bakgrunnslagring = styled.div`
  display: flex;

  justify-content: right;
  vertical-align: baseline;
  gap: 0.4rem;
  padding-top: 0.5rem;
  padding-right: 0.6rem;
  height: var(--a-spacing-4);
  margin-left: auto;
`

export const Fritekst = ({
  label,
  fritekst,
  beskrivelse,
  valideringsfeil,
  onLagre,
  lagrer,
  onTextChange,
}: {
  label: string
  fritekst: string
  beskrivelse: string
  valideringsfeil?: string
  onLagre: /*TODO*/ any
  lagrer: boolean
  onTextChange: any
}) => {
  const [timer, setTimer] = useState<NodeJS.Timeout | undefined>(undefined)
  const debounceVentetid = 1000

  const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onTextChange(event.target.value)
    clearTimeout(timer)

    const newTimer = setTimeout(() => {
      onLagre(event.target.value)
    }, debounceVentetid)

    setTimer(newTimer)
  }

  return (
    <>
      <Textarea
        minRows={5}
        maxRows={20}
        label={label}
        error={valideringsfeil}
        description={beskrivelse}
        size="small"
        value={fritekst}
        onChange={(event) => onChange(event)}
      />
      <Bakgrunnslagring>
        {lagrer && (
          <>
            <span>
              <Loader size="xsmall" />
            </span>
            <span>
              <Detail>Lagrer</Detail>
            </span>
          </>
        )}
      </Bakgrunnslagring>
    </>
  )
}
