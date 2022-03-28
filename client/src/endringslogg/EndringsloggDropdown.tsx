import { Information } from '@navikt/ds-icons'
import { Dropdown, Header } from '@navikt/ds-react-internal'
import React from 'react'
import styled from 'styled-components/macro'
import { Endringslogg } from './Endringslogg'
import { useEndringslogg } from './endringsloggHooks'

export const EndringsloggDropdown: React.VFC = () => {
  const endringslogg = useEndringslogg()
  return (
    <Dropdown>
      <Header.Button as={Dropdown.Toggle} style={{ position: 'relative' }}>
        {!endringslogg.loading && <Uleste fading={endringslogg.fading} />}
        <Information title="Endringslogg" width={20} height={20} />
      </Header.Button>
      <EndringsloggDropdownMenu>
        <Endringslogg endringslogginnslag={endringslogg.innslag} merkSomLest={endringslogg.merkSomLest} />
      </EndringsloggDropdownMenu>
    </Dropdown>
  )
}

const Uleste = styled.div<{ fading: boolean }>`
  position: absolute;
  top: 7px;
  right: 7px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: #ff9100;
  visibility: ${(props) => (props.fading ? 'hidden' : undefined)};
  opacity: ${(props) => (props.fading ? 0 : undefined)};
  transition: ${(props) => (props.fading ? 'visibility 0s 2s, opacity 2s linear' : undefined)};
`

const EndringsloggDropdownMenu = styled(Dropdown.Menu)`
  margin: 0;
  padding: 0;
  width: 64ch;
`
