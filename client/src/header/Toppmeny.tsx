import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { MenuGridIcon } from '@navikt/aksel-icons'
import { Dropdown, InternalHeader, Link } from '@navikt/ds-react'

import { usePersonContext } from '../personoversikt/PersonContext'
import { useInnloggetSaksbehandler } from '../state/authentication'
import { Søk } from './Søk'
import { EndringsloggDropdown } from './endringslogg/EndringsloggDropdown'
import { Eksperiment } from '../felleskomponenter/Eksperiment.tsx'
import { useMemo } from 'react'

const SøkeContainer = styled.div`
  padding-top: 0.5rem;
  padding-left: 1rem;
  margin-right: auto;
`

const Lenke = styled.a`
  text-decoration: none;
`

export function Toppmeny() {
  const { erInnlogget, enhetsnumre, ...rest } = useInnloggetSaksbehandler()
  const saksbehandler = erInnlogget ? rest : { id: '', navn: '', enheter: [] }
  const { setFodselsnummer } = usePersonContext()
  const navigate = useNavigate()

  const gjeldendeEnhet = useMemo(
    () => saksbehandler.enheter.find((enhet) => enhet.gjeldende) ?? saksbehandler.enheter[0],
    [saksbehandler.enheter]
  )

  return (
    <InternalHeader>
      <InternalHeader.Title href="/">HOTSAK</InternalHeader.Title>
      <SøkeContainer>
        <Søk
          onSearch={(value: string) => {
            setFodselsnummer(value)
            navigate('/personoversikt/saker')
          }}
        />
      </SøkeContainer>
      <Dropdown>
        <InternalHeader.Button as={Dropdown.Toggle} className="ml-auto">
          <MenuGridIcon style={{ fontSize: '1.5rem' }} title="Systemer og oppslagsverk" />
        </InternalHeader.Button>
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
        <EndringsloggDropdown />
      </Dropdown>
      <Dropdown>
        <InternalHeader.UserButton
          name={`${saksbehandler.id} - ${saksbehandler.navn}`}
          description={gjeldendeEnhet?.navn}
          as={Dropdown.Toggle}
          className="ml-auto"
        />
        <Dropdown.Menu>
          <Eksperiment>
            <Dropdown.Menu.GroupedList>
              <Dropdown.Menu.GroupedList.Heading>Enheter</Dropdown.Menu.GroupedList.Heading>
              {saksbehandler.enheter.map((enhet) => (
                <Dropdown.Menu.GroupedList.Item key={enhet.nummer}>
                  {enhet.nummer} - {enhet.navn}
                </Dropdown.Menu.GroupedList.Item>
              ))}
            </Dropdown.Menu.GroupedList>
            <Dropdown.Menu.Divider />
          </Eksperiment>
          <Dropdown.Menu.List>
            <Dropdown.Menu.List.Item>
              <Lenke href="/oauth2/logout">Logg ut</Lenke>
            </Dropdown.Menu.List.Item>
          </Dropdown.Menu.List>
        </Dropdown.Menu>
      </Dropdown>
    </InternalHeader>
  )
}
