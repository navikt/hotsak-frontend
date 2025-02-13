import { BodyLong, BodyShort, Box, Button, Checkbox, Heading, HStack, Loader } from '@navikt/ds-react'

import { FilePdfIcon, LightBulbIcon } from '@navikt/aksel-icons'

import {
  MDXEditor,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  BlockTypeSelect,
  UndoRedo,
  BoldItalicUnderlineToggles,
  ListsToggle,
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { useRef, useState } from 'react'

export interface MerknaderProps {}

export function Merknader({}: MerknaderProps) {
  const utkast =
    'Har mottatt en e-post fra formidler om at rullator nr. 2 skal brukes i andre etasje, og behovet for denne er kritisk da bruker ikke kan forflytte rullatoren hen allerede har mellom etasjene. Det er heller ikke noe soverom i første etasje.\n' +
    '\n' +
    'Rullator nr. 3 som ble søkt om var tiltenkt bruk på hytte. Formidler er informert om at man ikke får støtte for hjelpemidler tiltenkt hytte.'

  // Simuler lagring av utkast
  const [lagrerUtkast, setLagrerUtkast] = useState(false)
  let dedupTimeout: NodeJS.Timeout
  const markdownChanged = (markdown: string) => {
    setLagrerUtkast(false)
    if (dedupTimeout) clearTimeout(dedupTimeout)
    dedupTimeout = setTimeout(() => {
      setLagrerUtkast(true)
      console.log('Debug: Lagrer markdown', markdown)
      dedupTimeout = setTimeout(() => {
        setLagrerUtkast(false)
      }, 1000)
    }, 500)
  }

  const [klarForFerdigstilling, setKlarForFerdigstilling] = useState(false)
  const checkboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKlarForFerdigstilling(e.target.checked)
  }

  const merknader = [
    {
      saksbehandler: 'Vurderer Vilkårsen',
      dato: '13/2/2024 14:21',
      markdown: 'Bekreftelse av medlemskap gjennomført ved sjekk av andre goder i Gosys.',
    },
    {
      saksbehandler: 'Vurderer Vilkårsen',
      dato: '10/2/2024 15:02',
      markdown: 'Utredelse fra lege: Lorem ipsum dolor sit amet.',
    },
    {
      saksbehandler: 'Vurderer Vilkårsen',
      dato: '8/2/2024 10:42',
      markdown: null,
    },
  ]

  return (
    <>
      <Heading level="1" size="medium" spacing={false}>
        <HStack align="center" gap="1">
          <LightBulbIcon />
          Merknader
        </HStack>
      </Heading>
      <Heading level="2" size="small" style={{ marginTop: '1em' }}>
        Opprett en ny merknad på saken
      </Heading>
      <BodyLong size="small">
        Hvis du har mottatt saksopplysninger som er relevant for saksbehandlingen så skal disse journalføres på saken.
        Du kan her bearbeide ditt utkast, og vi lagrer det fortløpende. Men merk at det vil journalføres og bli
        tilgjengelig for bruker når du er ferdig og klikker "Ferdigstill merknad" for å journalføre.
      </BodyLong>
      <Box
        background="surface-default"
        padding="2"
        marginBlock="5 2"
        borderRadius="xlarge"
        borderColor="border-subtle"
        borderWidth="1"
      >
        <MDXEditor
          markdown={utkast}
          plugins={[
            listsPlugin(),
            quotePlugin(),
            thematicBreakPlugin(),
            toolbarPlugin({
              toolbarClassName: 'my-classname',
              toolbarContents: () => (
                <>
                  {' '}
                  <BlockTypeSelect />
                  <UndoRedo />
                  <BoldItalicUnderlineToggles />
                  <ListsToggle />
                </>
              ),
            }),
          ]}
          onChange={markdownChanged}
          translation={(key, defaultValue) => {
            switch (key) {
              case 'toolbar.blockTypes.paragraph':
                return 'Paragraf'
              case 'toolbar.blockTypes.quote':
                return 'Sitat'
              case 'toolbar.undo':
                return 'Angre'
              case 'toolbar.redo':
                return 'Gjør igjen'
              case 'toolbar.bold':
                return 'Uthevet'
              case 'toolbar.removeBold':
                return 'Fjern uthevet'
              case 'toolbar.italic':
                return 'Kursiv'
              case 'toolbar.removeItalic':
                return 'Fjern kursiv'
              case 'toolbar.underline':
                return 'Understrek'
              case 'toolbar.removeUnderline':
                return 'Fjern understrek'
              case 'toolbar.bulletedList':
                return 'Punktliste'
              case 'toolbar.numberedList':
                return 'Nummerert liste'
              case 'toolbar.checkList':
                return 'Sjekkliste'
              case 'toolbar.blockTypeSelect.selectBlockTypeTooltip':
                return 'Velg blokk type'
              case 'toolbar.blockTypeSelect.placeholder':
                return 'Blokk type'
            }
            return defaultValue
          }}
        />
        <div style={{ position: 'relative' }}>
          <div
            style={{
              color: 'gray',
              position: 'absolute',
              right: '0',
              top: '-1.5em',
              display: lagrerUtkast ? 'block' : 'none',
            }}
          >
            <HStack gap="2">
              <Loader size="small" title="Lagrer..." />
              <BodyShort size="small">Lagrer utkast</BodyShort>
            </HStack>
          </div>
        </div>
      </Box>
      <Checkbox value="klar" onChange={checkboxChange}>
        Jeg er klar over at ferdigstilte merknader er synlig for bruker på nav.no
      </Checkbox>
      <Button variant="secondary" size="medium" style={{ margin: '0.2em 0 0' }} disabled={!klarForFerdigstilling}>
        Ferdigstill merknad
      </Button>
      <Heading level="2" size="small" style={{ marginTop: '2em' }}>
        Merknader
      </Heading>
      {merknader.map((merknad) => {
        return (
          <Box
            background="surface-default"
            padding="5"
            marginBlock="5"
            borderRadius="xlarge"
            borderColor="border-subtle"
            borderWidth="1"
          >
            <HStack gap="2">
              <Heading level="3" size="xsmall">
                Merknad journalført av {merknad.saksbehandler}
              </Heading>
              <BodyShort size="small" color="#444">
                {merknad.dato}
              </BodyShort>
              <Button icon={<FilePdfIcon title="Last ned PDF" />} variant="tertiary" size="xsmall">
                Vis PDF
              </Button>
            </HStack>
            {merknad.markdown && <MDXEditor markdown={merknad.markdown} readOnly={true} />}
            {!merknad.markdown && (
              <BodyShort color="#444">
                <em>Denne merknaden ble sendt inn igjennom Gosys, les PDF filen for å se innholdet.</em>
              </BodyShort>
            )}
          </Box>
        )
      })}
    </>
  )
}
