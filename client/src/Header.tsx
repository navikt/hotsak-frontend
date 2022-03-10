import { useHistory } from 'react-router-dom'
import { Header, Dropdown } from '@navikt/ds-react-internal'
import { System } from '@navikt/ds-icons'
import { authState } from './state/authentication'
import { useRecoilValue } from 'recoil'
import { Link, Search } from '@navikt/ds-react'
import styled from 'styled-components/macro'
import { usePersonContext } from './personoversikt/PersonContext'
import React from 'react'

const Søk = styled(Search)`
  padding-top: 0.5rem;
  padding-left: 1rem;
`

export const Toppmeny = () => {
  const { name, ident, isLoggedIn } = useRecoilValue(authState)
  const brukerinfo = isLoggedIn ? { navn: name, ident: ident ?? '' } : { navn: 'Ikke pålogget', ident: '' }
  const history = useHistory()
  const { setFodselsnummer } = usePersonContext()
  const [søketekst, setSøketekst] = React.useState<string>('')

  return (
    <Header>
      <Header.Title href="/">HOTSAK</Header.Title>
      {window.appSettings.MILJO !== 'prod-gcp' && window.appSettings.MILJO !== 'dev-gcp' && (
        <Søk
          label="Finn bruker basert på fødselsnummer"
          size="small"
          variant="primary"
          hideLabel={true}
          onChange={(value) => {
            setSøketekst(value)
          }}
          onClear={() => setSøketekst('')}
          value={søketekst}
          onSearch={() => {
            setFodselsnummer(søketekst)
            setSøketekst('')
            history.push('/personoversikt/saker')
          }}
        />
      )}
      <Dropdown>
        <Header.Button as={Dropdown.Toggle} style={{ marginLeft: 'auto' }}>
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
            <Dropdown.Menu.List.Item onClick={() => history.go('/logout')}>Logg ut</Dropdown.Menu.List.Item>
          </Dropdown.Menu.List>
        </Dropdown.Menu>
      </Dropdown>
    </Header>
  )
}
