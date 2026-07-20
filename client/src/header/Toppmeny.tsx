import { MenuGridIcon, ThemeIcon } from '@navikt/aksel-icons'
import { ActionMenu, HStack, InternalHeader } from '@navikt/ds-react'
import { type ReactNode } from 'react'
import { useLocation } from 'react-router'
import { Link, type To, useNavigate } from 'react-router-dom'

import { HurtigtasterModal } from '../hotkeys/HurtigtasterModal.tsx'
import { useGlobaleHotkeys } from '../hotkeys/useGlobaleHotkeys.ts'
import { useHurtigtasterModal } from '../hotkeys/useHurtigtasterModal.tsx'
import { usePersonContext } from '../personoversikt/PersonContext'
import { useUmami } from '../sporing/useUmami.ts'
import { useInnloggetAnsatt, useTilgangContext } from '../tilgang/useTilgang.ts'
import { AnsattGruppe } from '../tilgang/Ansatt.ts'
import { useMiljø } from '../utils/useMiljø.ts'
import { fjernMellomrom } from '../utils/formater.ts'
import { useIsLargeScreen } from '../utils/useViewportSize.ts'
import { EndringsloggMenu } from './endringslogg/EndringsloggMenu.tsx'
import { Søk } from './Søk'
import classes from './Toppmeny.module.css'
import { useDarkMode } from './useDarkMode.ts'
import { useModia } from './useModia.ts'

export function Toppmeny() {
  const { innloggetAnsatt, setValgtEnhet } = useTilgangContext()
  const { erMedlemAvEnAvGrupper } = useInnloggetAnsatt()
  const valgtEnhet = innloggetAnsatt.gjeldendeEnhet
  const erTeamdigihot = erMedlemAvEnAvGrupper(AnsattGruppe.TEAMDIGIHOT)
  const { erIkkeProd } = useMiljø()
  const { setFodselsnummer } = usePersonContext()
  const navigate = useNavigate()
  const [darkMode, setDarkMode] = useDarkMode()
  const { logTemaByttet } = useUmami()
  const { åpneModia } = useModia()
  const hurtigtaster = useHurtigtasterModal()
  const isLargeScreen = useIsLargeScreen(1280)
  useGlobaleHotkeys({ visHurtigtaster: hurtigtaster.åpne })

  const handleSearch = (value: string) => {
    const fnrEllerSakId = fjernMellomrom(value)
    if (fnrEllerSakId.length === 11) {
      setFodselsnummer(fnrEllerSakId)
      navigate('/personoversikt/saker')
    } else {
      navigate(`/sak/${fnrEllerSakId}`)
    }
  }

  return (
    <>
      <InternalHeader className={classes.root}>
        <InternalHeader.Title as="a" href="/" className={classes.title}>
          Hotsak 1.5
        </InternalHeader.Title>
        <HStack justify="space-between" wrap={false} className={classes.navFlex}>
          <nav aria-label="Hovedmeny" className={classes.nav}>
            <HStack wrap={false}>
              <ToppmenyLinkButton to="/oppgaver/mine">Mine oppgaver</ToppmenyLinkButton>
              <ToppmenyLinkButton to="/oppgaver/enhetens">Enhetens oppgaver</ToppmenyLinkButton>
              <ToppmenyLinkButton to="/oppgaver/medarbeiders">Medarbeiders oppgaver</ToppmenyLinkButton>
            </HStack>
          </nav>
          <HStack wrap={false} gap="space-4">
            <Søk onSearch={handleSearch} />
            {isLargeScreen && (
              <InternalHeader.Button
                as="a"
                href={window.appSettings.SPORREUNDERSOKELSE_URL}
                target="_blank"
                rel="noreferrer"
                className={classes.feedbackButton}
              >
                Gi tilbakemelding
              </InternalHeader.Button>
            )}
          </HStack>
        </HStack>
        <ActionMenu>
          <ActionMenu.Trigger>
            <InternalHeader.Button>
              <MenuGridIcon className={classes.menuIcon} title="Systemer og oppslagsverk" />
            </InternalHeader.Button>
          </ActionMenu.Trigger>
          <ActionMenu.Content>
            <ActionMenu.Group label="Systemer og oppslagsverk">
              <ActionMenu.Item
                as="a"
                href={window.appSettings.GOSYS_OPPGAVEBEHANDLING_URL}
                target="gosys"
                shortcut="Alt + P"
              >
                Gosys
              </ActionMenu.Item>
              <ActionMenu.Item
                shortcut="Alt + M"
                onSelect={async () => {
                  await åpneModia()
                }}
              >
                Modia
              </ActionMenu.Item>
            </ActionMenu.Group>
            {(erIkkeProd || erTeamdigihot) && (
              <>
                <ActionMenu.Divider />
                <ActionMenu.Group label="Administrasjon">
                  <ActionMenu.Item as="a" href="/db-scheduler" target="_blank" rel="noreferrer">
                    DB Scheduler UI
                  </ActionMenu.Item>
                </ActionMenu.Group>
              </>
            )}
            <ActionMenu.Divider />
            <ActionMenu.Group label="Utseende">
              <ActionMenu.Item
                icon={<ThemeIcon />}
                as="a"
                href="/"
                onClick={async (event) => {
                  event.preventDefault()
                  logTemaByttet({
                    tekst: 'toppmeny-tema-bytte',
                    temaByttetTil: darkModeLabel(!darkMode),
                  })

                  setDarkMode(!darkMode)
                  // gi umami litt tid til å sende før reload
                  await new Promise((resolve) => setTimeout(resolve, 150))
                  window.location.href = '/'
                }}
              >
                {`Endre til ${darkModeLabel(!darkMode)}`}
              </ActionMenu.Item>
            </ActionMenu.Group>
            {!isLargeScreen && (
              <ActionMenu.Group label="Tilbakemelding">
                <ActionMenu.Item
                  as="a"
                  href={window.appSettings.SPORREUNDERSOKELSE_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Gi tilbakemelding
                </ActionMenu.Item>
              </ActionMenu.Group>
            )}
            <ActionMenu.Divider />
            <ActionMenu.Group label="Hjelp">
              <ActionMenu.Item onSelect={hurtigtaster.åpne} shortcut="Alt + H">
                Hurtigtaster
              </ActionMenu.Item>
            </ActionMenu.Group>
          </ActionMenu.Content>
          <EndringsloggMenu />
        </ActionMenu>
        <ActionMenu>
          <ActionMenu.Trigger>
            <InternalHeader.UserButton
              name={innloggetAnsatt.navn}
              description={valgtEnhet?.navn}
              className={classes.userButton}
            />
          </ActionMenu.Trigger>
          <ActionMenu.Content>
            <ActionMenu.Group label="Andre enheter">
              {innloggetAnsatt.enheter
                ?.filter(({ nummer }) => valgtEnhet?.nummer !== nummer)
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
      <HurtigtasterModal open={hurtigtaster.open} onClose={hurtigtaster.lukk} />
    </>
  )
}

function ToppmenyLinkButton({ to, children }: { to: To; children: ReactNode }) {
  const location = useLocation()
  const pathname = location.pathname
  const valgt = pathname === to || (pathname === '/' && to === '/oppgaver/mine')
  return (
    <InternalHeader.Button as={Link} to={to} isActive={valgt}>
      {children}
    </InternalHeader.Button>
  )
}

function darkModeLabel(darkMode: boolean) {
  return darkMode ? 'mørkt tema' : 'lyst tema'
}
