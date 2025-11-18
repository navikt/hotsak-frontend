import { MenuGridIcon, ThemeIcon } from '@navikt/aksel-icons'
import { ActionMenu, HStack, InternalHeader } from '@navikt/ds-react'
import { useNavigate } from 'react-router-dom'
import { Eksperiment } from '../../felleskomponenter/Eksperiment'
import { EndringsloggMenu } from '../../header/endringslogg/EndringsloggMenu'
import { Søk } from '../../header/Søk'
import { useDarkmode } from '../../header/useDarkmode'
import { useNyOppgaveliste } from '../../oppgaveliste/useNyOppgaveliste'
import { usePersonContext } from '../../personoversikt/PersonContext'
import { useTilgangContext } from '../../tilgang/useTilgang'
import { pushLog } from '../../utils/faro'
import { fjernMellomrom } from '../../utils/formater'
import { useEksperimenter } from '../useEksperimenter'
import styles from './ToppmenyEksperiment.module.css'

export function ToppmenyEksperiment() {
  const { innloggetAnsatt, setValgtEnhet } = useTilgangContext()
  const valgtEnhet = innloggetAnsatt.gjeldendeEnhet
  const { setFodselsnummer } = usePersonContext()
  const [nyOppgaveliste, setNyOppgaveliste] = useNyOppgaveliste()
  const [darkmode, setDarkmode] = useDarkmode()
  const [, setEksperimentell] = useEksperimenter()
  const navigate = useNavigate()

  return (
    <InternalHeader>
      <InternalHeader.Title as="a" href="/" className={styles.eksperimentHeader}>
        HOTSAK LABBEN
      </InternalHeader.Title>

      <HStack as="nav" wrap={false} flexGrow="1" overflow="auto">
        <HStack as="ol" gap="space-16" wrap={false} paddingInline="space-16" marginBlock="0">
          {/*<NavItem to="/">Oppgaver</NavItem>

          <NavItem to="/mine-oppgaver">Mine oppgaver</NavItem>*/}
        </HStack>
        <div className={styles.søkeContainer}>
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
        </div>
      </HStack>

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
              {darkmode ? 'Endre til lyst tema' : 'Endre til mørkt tema'}
            </ActionMenu.Item>
          </ActionMenu.Group>
          <Eksperiment>
            <ActionMenu.Divider />
            <ActionMenu.Group label="Eksperimenter">
              <ActionMenu.Item
                as="a"
                href="/"
                onClick={() => {
                  setNyOppgaveliste(false)
                  setEksperimentell(false)
                }}
              >
                Hotsak classic
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

/* const NavItem = ({ children, ...props }: NavLinkProps) => {
  return (
    <HStack as="li" align="center" wrap={false}>
      <NavLink {...props} className={({ isActive }) => `${styles.nav} ${isActive ? styles.navActive : ''}`}>
        {children}
      </NavLink>
    </HStack>
  )
} */

function darkmodeLabel(darkmode: boolean) {
  return darkmode ? 'mørkt tema' : 'lyst tema'
}
