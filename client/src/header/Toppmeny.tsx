import { MenuGridIcon, ThemeIcon } from '@navikt/aksel-icons'
import { ActionMenu, InternalHeader } from '@navikt/ds-react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { useEksperimenter } from '../eksperimentelt/useEksperimenter.ts'
import { Eksperiment } from '../felleskomponenter/Eksperiment.tsx'
import { useNyOppgaveliste } from '../oppgaveliste/useNyOppgaveliste.ts'
import { usePersonContext } from '../personoversikt/PersonContext'
import { useTilgangContext } from '../tilgang/useTilgang.ts'
import { pushLog } from '../utils/faro.ts'
import { fjernMellomrom } from '../utils/formater.ts'
import { EndringsloggMenu } from './endringslogg/EndringsloggMenu.tsx'
import { Søk } from './Søk'
import { useDarkmode } from './useDarkmode.ts'

const SøkeContainer = styled.div`
  padding-top: 0.5rem;
  padding-left: 1rem;
  margin-right: auto;
`
export function Toppmeny() {
  const { innloggetAnsatt, setValgtEnhet } = useTilgangContext()
  const valgtEnhet = innloggetAnsatt.gjeldendeEnhet
  const { setFodselsnummer } = usePersonContext()
  const navigate = useNavigate()
  const [nyOppgaveliste, setNyOppgaveliste] = useNyOppgaveliste()
  const [darkmode, setDarkmode] = useDarkmode()
  const [, setEksperimentell] = useEksperimenter()

  return (
    <InternalHeader>
      <InternalHeader.Title as="a" href="/">
        HOTSAK
      </InternalHeader.Title>

      <SøkeContainer>
        <Søk
          onSearch={(value: string) => {
            const fnrEllerSakId = fjernMellomrom(value)
            if (fnrEllerSakId.length === 11) {
              setFodselsnummer(fnrEllerSakId)
              navigate('/personoversikt/saker')
            } else {
              navigate(`/sak/${fnrEllerSakId}`)
            }
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
          <Eksperiment>
            <ActionMenu.Divider />
            <ActionMenu.Group label="Oppgaveintegrasjon">
              <ActionMenu.Item
                as="a"
                href="/"
                onClick={() => {
                  setNyOppgaveliste(!nyOppgaveliste)
                }}
              >
                {nyOppgaveliste ? 'Bruk gammel oppgaveliste' : 'Bruk ny oppgaveliste'}
              </ActionMenu.Item>
            </ActionMenu.Group>
          </Eksperiment>
          <ActionMenu.Divider />
          <ActionMenu.Group label="Utseende">
            <ActionMenu.Item
              icon={<ThemeIcon />}
              as="a"
              href="/"
              onClick={() => {
                pushLog(`Dark mode toggle fra ${darkmodeLabel(darkmode)} til ${darkmodeLabel(!darkmode)}`)
                setDarkmode(!darkmode)
              }}
            >
              {`Endre til ${darkmodeLabel(!darkmode)}`}
            </ActionMenu.Item>
          </ActionMenu.Group>

          <Eksperiment>
            <ActionMenu.Divider />
            <ActionMenu.Group label="Eksperimenter">
              <ActionMenu.Item
                as="a"
                href="/"
                onClick={() => {
                  setEksperimentell(true)
                  setNyOppgaveliste(true)
                }}
              >
                Hotsak 1.5
              </ActionMenu.Item>
            </ActionMenu.Group>
          </Eksperiment>
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
          <ActionMenu.Item as="a" href="/oauth2/logout">
            Logg ut
          </ActionMenu.Item>
        </ActionMenu.Content>
      </ActionMenu>
    </InternalHeader>
  )
}

function darkmodeLabel(darkmode: boolean) {
  return darkmode ? 'mørkt tema' : 'lyst tema'
}
