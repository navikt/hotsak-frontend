import { MenuGridIcon, ThemeIcon } from '@navikt/aksel-icons'
import { ActionMenu, InternalHeader } from '@navikt/ds-react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { Eksperiment } from '../felleskomponenter/Eksperiment.tsx'
import { Pilot } from '../felleskomponenter/Pilot.tsx'
import { useNyOppgaveliste } from '../oppgaveliste/useNyOppgaveliste.ts'
import { usePersonContext } from '../personoversikt/PersonContext'
import { useUmami } from '../sporing/useUmami.ts'
import { useTilgangContext } from '../tilgang/useTilgang.ts'
import { fjernMellomrom } from '../utils/formater.ts'
import { EndringsloggMenu } from './endringslogg/EndringsloggMenu.tsx'
import { Søk } from './Søk'
import { useDarkmode } from './useDarkmode.ts'
import { useNyttSaksbilde } from '../sak/v2/useNyttSaksbilde.ts'

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
  const [nyttSaksbilde, setNyttSaksbilde] = useNyttSaksbilde()
  const { logTemaByttet } = useUmami()

  return (
    <InternalHeader>
      <InternalHeader.Title as="a" href="/">
        {nyttSaksbilde ? 'Hotsak 1.5' : 'Hotsak'}
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
          <Pilot name="oppgaveintegrasjon">
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
          </Pilot>
          <ActionMenu.Divider />
          <ActionMenu.Group label="Utseende">
            <ActionMenu.Item
              icon={<ThemeIcon />}
              as="a"
              href="/"
              onClick={async (e) => {
                e.preventDefault()
                logTemaByttet({
                  tekst: 'toppmeny-tema-bytte',
                  temaByttetTil: darkmodeLabel(!darkmode),
                })

                setDarkmode(!darkmode)
                //gi umami litt tid til å sende før reload
                await new Promise((resolve) => setTimeout(resolve, 150))
                window.location.href = '/'
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
                  setNyttSaksbilde(!nyttSaksbilde)
                }}
              >
                {nyttSaksbilde ? 'Gammelt saksbilde' : 'Hotsak 1.5 - saksbehandling'}
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
