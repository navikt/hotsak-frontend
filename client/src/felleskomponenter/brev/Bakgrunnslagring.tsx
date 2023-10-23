import { ChangeEvent, useState } from 'react'
import styled from 'styled-components'

import { Detail, Loader, Textarea } from '@navikt/ds-react'

import { MålformType } from '../../types/types.internal'

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
  sakId,
  tekst,
  målform,
  onLagre,
}: {
  sakId: string
  målform: MålformType
  tekst?: string
  onLagre: /*TODO*/ any
}) => {
  const [fritekst, setFritekst] = useState(tekst || '')
  const [valideringsFeil, setValideringsfeil] = useState<string | undefined>(undefined)
  const [lagrer, setLagrer] = useState(false)
  const [timer, setTimer] = useState<NodeJS.Timeout | undefined>(undefined)
  const debounceVentetid = 1000

  const onTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setFritekst(event.target.value)
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
        label="Fritekst"
        error={valideringsFeil}
        description="Beskriv hva som mangler av opplysninger"
        size="small"
        value={fritekst}
        onChange={(event) => onTextChange(event)}
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
