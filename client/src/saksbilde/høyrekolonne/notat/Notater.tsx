import { listsPlugin, MDXEditor, quotePlugin, thematicBreakPlugin } from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { ExternalLinkIcon, MenuElipsisHorizontalCircleIcon } from '@navikt/aksel-icons'
import {
  ActionMenu,
  Box,
  Button,
  Heading,
  HStack,
  Loader,
  ReadMore,
  Spacer,
  Tag,
  ToggleGroup,
  Tooltip,
  VStack,
} from '@navikt/ds-react'
import { useState } from 'react'
import { Brødtekst, Mellomtittel, Tekst, Undertittel } from '../../../felleskomponenter/typografi.tsx'
import { FilterChips } from '../../../oppgaveliste/filter/filter.tsx'
import { NotatType } from '../../../types/types.internal.ts'
import { formaterTidsstempelLesevennlig, sorterKronologiskSynkende } from '../../../utils/dato.ts'
import { storForbokstavIOrd } from '../../../utils/formater.ts'
import { MardownEditorPreviewStyling } from '../../journalførteNotater/MarkdownEditor.tsx'
import { InfoModal } from '../../komponenter/InfoModal.tsx'
import { InterntNotatForm } from './InterntNotatForm.tsx'
import { JournalførtNotatForm } from './JournalførtNotatForm.tsx'
import { useNotater } from './useNotater.tsx'

export interface NotaterProps {
  sakId: string
  lesevisning: boolean
}

export function Notater({ sakId, lesevisning }: NotaterProps) {
  const { notater, isLoading: notaterLaster } = useNotater(sakId)
  const [notatType, setNotatType] = useState<string>(NotatType.INTERNT.toString())
  const [visFeilregistrerInfoModal, setVisFeilregistrerInfoModal] = useState(false)
  const [visFeilregistrerInterntInfoModal, setVisFeilregistrerInterntInfoModal] = useState(false)

  const filterOptions = [
    { key: 'ALLE', label: 'Alle' },
    { key: NotatType.INTERNT.toString(), label: 'Interne' },
    { key: NotatType.JOURNALFØRT.toString(), label: 'Journalførte' },
  ]
  const [filter, setFilter] = useState(['ALLE'])

  return (
    <>
      <VStack gap="2">
        <ReadMore size="small" header="Når skal du bruke de ulike notattypene">
          <Brødtekst spacing>
            Journalføringsnotat skal brukes hvis du har mottatt saksopplysninger utenfra som er med på å avgjøre
            utfallet av en sak. Når du ferdigstiller journalføringsnotatet, blir det tilgjengelig for innbygger neste
            virkedag på innlogget side på nav.no.
          </Brødtekst>
          <Brødtekst>
            Internt notat brukes for egne notater i arbeidsprosessen og drøftinger mellom kolleger. Disse journalføres
            ikke. Merk at brukeren kan få innsyn i interne notater hvis de ber om det.
          </Brødtekst>
        </ReadMore>
        <Box paddingBlock="6 0">
          <ToggleGroup
            size="small"
            value={notatType}
            label="Opprett nytt notat"
            onChange={(notatType) => setNotatType(notatType)}
          >
            <ToggleGroup.Item value={NotatType.INTERNT.toString()} label={`Internt notat`} />
            <ToggleGroup.Item value={NotatType.JOURNALFØRT.toString()} label={`Journalføringsnotat`} />
          </ToggleGroup>
        </Box>
      </VStack>
      {notaterLaster && (
        <div>
          <Loader size="large" style={{ margin: '2em auto', display: 'block' }} />
        </div>
      )}

      {notatType === NotatType.JOURNALFØRT ? (
        <JournalførtNotatForm sakId={sakId} lesevisning={lesevisning} />
      ) : (
        <InterntNotatForm sakId={sakId} lesevisning={lesevisning} />
      )}
      <VStack gap="4" paddingBlock="8 0">
        <Mellomtittel spacing={false}>Notater knyttet til saken</Mellomtittel>
        {notaterLaster && (
          <div>
            <Loader size="large" style={{ margin: '2em auto', display: 'block' }} />
          </div>
        )}
        {!notaterLaster && notater && (
          <>
            {notater.length === 0 && <Tekst>Ingen notater er knyttet til saken</Tekst>}
            {notater.length > 0 && (
              <FilterChips
                selected={filter}
                options={filterOptions}
                handleChange={(filterValue) => {
                  setFilter(filterValue)
                }}
              />
            )}
            {notater
              .filter((notat) => filter[0] === 'ALLE' || notat.type === filter[0])
              .sort((a, b) => sorterKronologiskSynkende(a.opprettet, b.opprettet))
              .map((notat) => {
                return (
                  <Box key={notat.id} background="surface-subtle" padding="3" borderRadius="xlarge">
                    <VStack gap="2">
                      <HStack gap="2" wrap={false} align="center">
                        <Tag
                          variant={notat.type === NotatType.JOURNALFØRT ? 'alt3-filled' : 'neutral-moderate'}
                          size="small"
                        >
                          {storForbokstavIOrd(notat.type)}
                        </Tag>

                        <>
                          <Spacer />
                          <ActionMenu>
                            <ActionMenu.Trigger>
                              <Button
                                variant="tertiary-neutral"
                                icon={<MenuElipsisHorizontalCircleIcon title="Notatmeny" />}
                                size="small"
                              />
                            </ActionMenu.Trigger>

                            <ActionMenu.Content>
                              {notat.type === NotatType.JOURNALFØRT && (
                                <Tooltip content="Åpne i ny fane">
                                  <ActionMenu.Item
                                    disabled={!notat.journalpostId || !notat.dokumentId}
                                    as="a"
                                    href={`/api/journalpost/${notat.journalpostId}/${notat.dokumentId}`}
                                    target="_blank"
                                  >
                                    Åpne som dokument <ExternalLinkIcon />
                                  </ActionMenu.Item>
                                </Tooltip>
                              )}
                              {notat.type === NotatType.JOURNALFØRT ? (
                                <ActionMenu.Item
                                  disabled={!notat.journalpostId || !notat.dokumentId}
                                  onClick={() => setVisFeilregistrerInfoModal(true)}
                                >
                                  Feilregistrer
                                </ActionMenu.Item>
                              ) : (
                                <ActionMenu.Item onClick={() => setVisFeilregistrerInterntInfoModal(true)}>
                                  Feilregistrer
                                </ActionMenu.Item>
                              )}
                            </ActionMenu.Content>
                          </ActionMenu>
                        </>
                      </HStack>
                      <HStack gap="2">
                        <Heading level="3" size="xsmall" style={{ fontSize: '1em' }}>
                          {notat.tittel}
                        </Heading>
                      </HStack>
                      <VStack>
                        <Brødtekst>{formaterTidsstempelLesevennlig(notat.opprettet)}</Brødtekst>
                        <Undertittel>{notat.saksbehandler.navn}</Undertittel>
                      </VStack>
                    </VStack>

                    {notat.tekst && (
                      <MardownEditorPreviewStyling>
                        <MDXEditor
                          markdown={notat.tekst}
                          readOnly={true}
                          contentEditableClassName="mdxEditorRemoveMargin"
                          plugins={[listsPlugin(), quotePlugin(), thematicBreakPlugin()]}
                        />
                      </MardownEditorPreviewStyling>
                    )}

                    {!notat.tekst && (
                      <Box paddingBlock={'2 0'}>
                        <Brødtekst>
                          Dette notatet ble sendt inn igjennom Gosys, les PDF filen for å se innholdet.
                        </Brødtekst>
                      </Box>
                    )}
                  </Box>
                )
              })}
          </>
        )}
      </VStack>

      <InfoModal
        heading="Feilregistrering ikke mulig enda"
        open={visFeilregistrerInfoModal}
        onClose={() => setVisFeilregistrerInfoModal(false)}
      >
        <Brødtekst>
          Journalførte notater kan ikke feilregistreres i Hotsak enda. Dette må foreløpig gjøres fra Gosys.
        </Brødtekst>
      </InfoModal>

      <InfoModal
        heading="Feilregistrering ikke mulig enda"
        open={visFeilregistrerInterntInfoModal}
        onClose={() => setVisFeilregistrerInterntInfoModal(false)}
      >
        <Brødtekst>
          Interne notater kan ikke feilregistreres enda. Støtte for dette kommer i en senere versjon av Hotsak.
        </Brødtekst>
      </InfoModal>
    </>
  )
}
