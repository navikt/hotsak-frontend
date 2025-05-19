import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { MenuGridIcon } from '@navikt/aksel-icons'
import { ActionMenu, InternalHeader } from '@navikt/ds-react'

import { usePersonContext } from '../personoversikt/PersonContext'
import { useTilgangContext } from '../tilgang/useTilgang.ts'
import { Søk } from './Søk'
import { EndringsloggMenu } from './endringslogg/EndringsloggMenu.tsx'

const SøkeContainer = styled.div`
  padding-top: 0.5rem;
  padding-left: 1rem;
  margin-right: auto;
`

const Lenke = styled.a`
  text-decoration: none;
`

export function Toppmeny() {
  const { innloggetAnsatt, setValgtEnhet } = useTilgangContext()
  const valgtEnhet = innloggetAnsatt.gjeldendeEnhet
  const { setFodselsnummer } = usePersonContext()
  const navigate = useNavigate()

  return (
    <InternalHeader>
      <InternalHeader.Title as="h1" href="/">
        HOTSAK
      </InternalHeader.Title>
      <SøkeContainer>
        <Søk
          onSearch={(value: string) => {
            setFodselsnummer(value)
            navigate('/personoversikt/saker')
          }}
        />
      </SøkeContainer>
      <ActionMenu>
        <ActionMenu.Trigger>
          <InternalHeader.Button>
            <MenuGridIcon style={{ fontSize: '1.5rem' }} title="Systemer og oppslagsverk" />
          </InternalHeader.Button>
        </ActionMenu.Trigger>
        <ActionMenu.Content>
          <ActionMenu.Group label="Systemer og oppslagsverk">
            <ActionMenu.Item as="a" href="https://gosys.intern.nav.no/gosys/" target="_new">
              Gosys
            </ActionMenu.Item>
            <ActionMenu.Item as="a" href="https://app.adeo.no/modiapersonoversikt" target="_new">
              Modia
            </ActionMenu.Item>
          </ActionMenu.Group>
        </ActionMenu.Content>
        <EndringsloggMenu />
      </ActionMenu>
      <ActionMenu>
        <ActionMenu.Trigger>
          <InternalHeader.UserButton name={innloggetAnsatt.navn} description={valgtEnhet?.navn} />
        </ActionMenu.Trigger>
        <ActionMenu.Content>
          <ActionMenu.Group label="Andre enheter">
            {innloggetAnsatt.enheter
              .filter(({ nummer }) => valgtEnhet?.nummer !== nummer)
              .map((enhet) => (
                <ActionMenu.Item
                  key={enhet.nummer}
                  onSelect={() => {
                    return setValgtEnhet(enhet.nummer)
                  }}
                >
                  {enhet.nummer} - {enhet.navn}
                </ActionMenu.Item>
              ))}
          </ActionMenu.Group>
          <ActionMenu.Divider />
          <ActionMenu.Item>
            <Lenke href="/oauth2/logout">Logg ut</Lenke>
          </ActionMenu.Item>
        </ActionMenu.Content>
      </ActionMenu>
    </InternalHeader>
  )
}
