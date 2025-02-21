import {
  BodyLong,
  BodyShort,
  Box,
  Button,
  Checkbox,
  Heading,
  HStack,
  Label,
  Link,
  Loader,
  ReadMore,
  Tooltip,
} from '@navikt/ds-react'

import { ExternalLinkIcon, FolderFileIcon } from '@navikt/aksel-icons'

import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  listsPlugin,
  ListsToggle,
  MDXEditor,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { useState } from 'react'
import { Brevtype, MålformType, Sak, SaksdokumentType } from '../../types/types.internal.ts'
import { postBrevutkast } from '../../io/http.ts'
import { useBrevtekst } from '../barnebriller/brevutkast/useBrevtekst.ts'
import { useSaksdokumenter } from '../barnebriller/useSaksdokumenter.ts'
import styled from 'styled-components'

export interface MerknaderProps {
  sak: Sak
  høyreVariant?: boolean
}

export function Merknader({ sak, høyreVariant }: MerknaderProps) {
  /*
    const utkast =
      'Har mottatt en e-post fra formidler om at rullator nr. 2 skal brukes i andre etasje, og behovet for denne er kritisk da bruker ikke kan forflytte rullatoren hen allerede har mellom etasjene. Det er heller ikke noe soverom i første etasje.\n' +
      '\n' +
      'Rullator nr. 3 som ble søkt om var tiltenkt bruk på hytte. Formidler er informert om at man ikke får støtte for hjelpemidler tiltenkt hytte.'
  */

  const [lagrerUtkast, setLagrerUtkast] = useState(false)
  const [klarForFerdigstilling, setKlarForFerdigstilling] = useState(false)
  const {
    data: utkast,
    isLoading: utkastLasterInn,
    mutate: utkastMutert,
  } = useBrevtekst(sak.sakId, Brevtype.JOURNALFØRT_NOTAT)

  // Vent på at bruker endrer på utkastet, debounce repeterte endringer i 500ms, lagre utkastet og muter swr state, vis melding
  // om at vi lagrer utkastet i minimum 1s slik at bruker rekker å lese det.
  let debounceTimeout: NodeJS.Timeout
  const markdownChanged = (markdown: string) => {
    if (debounceTimeout) clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(async () => {
      setLagrerUtkast(true)
      const payload = {
        sakId: sak.sakId,
        målform: MålformType.BOKMÅL,
        brevtype: Brevtype.JOURNALFØRT_NOTAT,
        data: {
          brevtekst: markdown,
        },
      }
      const minimumPeriodeVisLagrerUtkast = new Promise((r) => setTimeout(r, 1000))
      await postBrevutkast(payload)
      await utkastMutert(payload)
      await minimumPeriodeVisLagrerUtkast
      setLagrerUtkast(false)
    }, 500)
  }

  const { data: merknader2 } = useSaksdokumenter(sak.sakId, true, SaksdokumentType.NOTAT)

  console.log('here', merknader2)

  const merknader = [
    {
      saksbehandler: 'Vurderer Vilkårsen',
      dato: '13.02.2024 14:21',
      markdown: 'Bekreftelse av medlemskap gjennomført ved sjekk av andre goder i Gosys.',
      journalpostId: 'b934c778-77e7-4eaf-810d-e871b76ca6a1',
      dokumentId: '6',
    },
    {
      saksbehandler: 'Vurderer Vilkårsen',
      dato: '10.02.2024 15:02',
      markdown: '**Utredelse fra lege:**\nLorem ipsum dolor sit amet.\n\n**Noe annet:**\nLorem ipsum dolor sit amet.',
      journalpostId: 'ec93204e-3fa4-409a-8414-ee53f485c320',
      dokumentId: '6',
    },
    {
      saksbehandler: 'Vurderer Vilkårsen',
      dato: '08.02.2024 10:42',
      markdown: null,
      journalpostId: '75d8d6b7-1ff9-4b2c-bd6f-c33caac79d3f',
      dokumentId: '6',
    },
  ]

  return (
    <>
      {!høyreVariant && (
        <Heading level="1" size="medium" spacing={false}>
          <HStack align="center" gap="1">
            <FolderFileIcon />
            Journalføringsnotat
          </HStack>
        </Heading>
      )}
      {!høyreVariant && (
        <>
          <Heading level="2" size="small" style={{ marginTop: '1em' }}>
            Opprett en ny merknad på saken
          </Heading>
          <BodyLong size="small">
            Hvis du har mottatt saksopplysninger som er relevant for saksbehandlingen så skal disse journalføres på
            saken. Du kan her bearbeide ditt utkast, og vi lagrer det fortløpende. Men merk at det vil journalføres og
            bli tilgjengelig for bruker når du er ferdig og klikker "Ferdigstill merknad" for å journalføre.
          </BodyLong>
        </>
      )}
      {høyreVariant && (
        <>
          <Label size="small">Opprett en ny merknad på saken</Label>
          <BodyLong size="small">
            Hvis du har mottatt saksopplysninger som er relevant for saksbehandlingen så skal disse journalføres!
          </BodyLong>
          <ReadMore size="small" header="Mer om journalføringsnotat" style={{ marginTop: '0.5em' }}>
            Hvis du har mottatt saksopplysninger som er relevant for saksbehandlingen så skal disse journalføres på
            saken. Du kan her bearbeide ditt utkast, og vi lagrer det fortløpende. Men merk at det vil journalføres og
            bli tilgjengelig for bruker når du er ferdig og klikker "Ferdigstill merknad" for å journalføre.
          </ReadMore>
        </>
      )}
      <Box
        background="surface-default"
        padding="2"
        marginBlock="5 2"
        borderRadius="xlarge"
        borderColor="border-subtle"
        borderWidth="1"
      >
        {utkastLasterInn && (
          <div>
            <Loader size="large" style={{ margin: '2em auto', display: 'block' }} />
          </div>
        )}
        {!utkastLasterInn && utkast && (
          <>
            {/*<TextField placeholder="Tittel" style={{ margin: '0 0 1em' }} />*/}
            <MDXEditor
              markdown={utkast.data.brevtekst}
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
          </>
        )}
      </Box>
      <Checkbox
        value="klar"
        size={høyreVariant ? 'small' : 'medium'}
        onChange={(e) => setKlarForFerdigstilling(e.target.checked)}
      >
        Jeg er klar over at ferdigstilte merknader er synlig for bruker på nav.no
      </Checkbox>
      <Button
        variant="secondary"
        size={høyreVariant ? 'small' : 'medium'}
        style={{ margin: '0.2em 0 0' }}
        disabled={!klarForFerdigstilling}
      >
        Journalfør notat
      </Button>
      {!høyreVariant && (
        <Heading level="2" size="small" style={{ marginTop: '2em' }}>
          Journalførte notater
        </Heading>
      )}
      {høyreVariant && (
        <div style={{ marginTop: '2em' }}>
          <Label size="small">Journalførte notater</Label>
        </div>
      )}
      {merknader.map((merknad, idx) => {
        return (
          <Box
            key={idx}
            background="surface-default"
            padding="5"
            marginBlock="5"
            borderRadius="xlarge"
            borderColor="border-subtle"
            borderWidth="1"
          >
            <HStack gap="2">
              {!høyreVariant && (
                <Heading level="3" size="xsmall">
                  {merknad.saksbehandler}
                </Heading>
              )}
              {høyreVariant && (
                <Heading level="3" size="xsmall" style={{ fontSize: '1em' }}>
                  {merknad.saksbehandler}
                </Heading>
              )}

              <BodyShort size="small" color="#444">
                {merknad.dato}
              </BodyShort>
              <Tooltip content="Åpne i ny fane">
                <Link href={`/api/journalpost/${merknad.journalpostId}/${merknad.dokumentId}`} target="_blank">
                  <ExternalLinkIcon />
                </Link>
              </Tooltip>
            </HStack>
            <MdxEditorStyling>
              {merknad.markdown && (
                <MDXEditor
                  markdown={merknad.markdown}
                  readOnly={true}
                  contentEditableClassName="mdxEditorRemoveMargin"
                />
              )}
            </MdxEditorStyling>
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

const MdxEditorStyling = styled.div`
  .mdxEditorRemoveMargin {
    padding: 0;
  }
`
