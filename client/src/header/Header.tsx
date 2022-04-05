import React from 'react'
import { useHistory } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components/macro'

import { System } from '@navikt/ds-icons'
import { Link } from '@navikt/ds-react'
import { Dropdown, Header } from '@navikt/ds-react-internal'

import { EndringsloggDropdown } from './endringslogg/EndringsloggDropdown'
import { usePersonContext } from '../personoversikt/PersonContext'
import { authState } from '../state/authentication'
import { Søk } from './Søk'

const SøkeContainer = styled.div`
  padding-top: 0.5rem;
  padding-left: 1rem;
  margin-right: auto;
`

const Lenke = styled.a`
  text-decoration: none;
`

export const Toppmeny: React.VFC = () => {
  const { name, ident, isLoggedIn } = useRecoilValue(authState)
  const brukerinfo = isLoggedIn ? { navn: name, ident: ident ?? '' } : { navn: 'Ikke pålogget', ident: '' }
  const { setFodselsnummer } = usePersonContext()
  const history = useHistory()

  return (
    <Header style={{ display: 'flex', justifyContent: 'flex-end' }}>
      {window.appSettings.MILJO !== 'prod-gcp' ? (
        <>
          <Header.Title href="/">HOTSAK</Header.Title>
          <SøkeContainer>
            <Søk
              onSearch={(value: string) => {
                setFodselsnummer(value)
                history.push('/personoversikt/saker')
              }}
            />
          </SøkeContainer>
        </>
      ) : (
        <Header.Title href="/" style={{ marginRight: 'auto' }}>
          HOTSAK
        </Header.Title>
      )}
      <EndringsloggDropdown />
      <Dropdown>
        <Header.Button as={Dropdown.Toggle}>
          <System title="Systemer og oppslagsverk" />
        </Header.Button>
        <Dropdown.Menu>
          <Dropdown.Menu.GroupedList>
            <Dropdown.Menu.GroupedList.Heading>Systemer og oppslagsverk</Dropdown.Menu.GroupedList.Heading>
            <Dropdown.Menu.GroupedList.Item>
              <Link href="https://gosys.intern.nav.no/gosys/" target="_new">
                Gosys
              </Link>
            </Dropdown.Menu.GroupedList.Item>
            <Dropdown.Menu.GroupedList.Item>
              <Link href="https://app.adeo.no/modiapersonoversikt" target="_new">
                Modia
              </Link>
            </Dropdown.Menu.GroupedList.Item>
          </Dropdown.Menu.GroupedList>
        </Dropdown.Menu>
      </Dropdown>
      <Dropdown>
        <Header.UserButton as={Dropdown.Toggle} name={brukerinfo.navn} description={brukerinfo.ident} />
        <Dropdown.Menu>
          <Dropdown.Menu.List>
            <Lenke href="/logout">
              <Dropdown.Menu.List.Item>Logg ut</Dropdown.Menu.List.Item>
            </Lenke>
          </Dropdown.Menu.List>
        </Dropdown.Menu>
      </Dropdown>
    </Header>
  )
}
