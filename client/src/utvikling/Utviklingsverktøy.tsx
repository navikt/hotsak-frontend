import React, { ChangeEventHandler, useState } from 'react'
import styled from 'styled-components'
import useSwr from 'swr'

import { Button, Checkbox, CheckboxGroup, Heading, Select } from '@navikt/ds-react'

import { InnloggetSaksbehandler, useInnloggetSaksbehandler } from '../state/authentication'

const Wrapper = styled.div`
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 999999;
  padding: 20px;
  background: #ececec;
  border: 2px dashed black;
  min-width: 220px;
`

export function Utviklingsverktøy() {
  const { id: innloggetSaksbehandlerId } = useInnloggetSaksbehandler()
  const { data: saksbehandlere = [] } = useSwr<InnloggetSaksbehandler[]>('/utvikling/saksbehandlere')
  const [erSkjult, setErSkjult] = useState(false)

  const handleChange = (values: string[]) => {
    // todo
  }

  const handleSkjul = (skjult: boolean) => {
    setErSkjult(skjult)
  }

  if (!window.appSettings.USE_MSW) {
    return null
  }

  if (erSkjult) {
    return (
      <Wrapper>
        <Button
          size="small"
          variant="secondary"
          onClick={() => {
            handleSkjul(false)
          }}
          tabIndex={-1}
        >
          Vis utviklingsverktøy
        </Button>
      </Wrapper>
    )
  }

  const byttSaksbehandler: ChangeEventHandler<HTMLSelectElement> = async (event) => {
    await fetch('/utvikling/saksbehandler', {
      method: 'put',
      body: JSON.stringify({
        saksbehandlerId: event.target.value,
      }),
    })
    window.location.reload()
  }

  return (
    <Wrapper>
      <Button
        style={{ position: 'absolute', top: '7px', right: '7px' }}
        size="small"
        variant="secondary"
        onClick={() => {
          handleSkjul(true)
        }}
        tabIndex={-1}
      >
        -
      </Button>
      <Heading size="xsmall">[UTVIKLINGSVERKTØY]</Heading>
      <Select label="Innlogget saksbehandler" value={innloggetSaksbehandlerId} onChange={byttSaksbehandler}>
        {saksbehandlere.map(({ id, navn }) => (
          <option key={id} value={id}>
            {navn}
          </option>
        ))}
      </Select>
      {false && (
        <CheckboxGroup size="small" legend="Tilganger" hideLegend onChange={handleChange}>
          <Heading size="xsmall">Roller</Heading>
          <Checkbox value="foo" tabIndex={-1}>
            bar
          </Checkbox>
        </CheckboxGroup>
      )}
    </Wrapper>
  )
}
