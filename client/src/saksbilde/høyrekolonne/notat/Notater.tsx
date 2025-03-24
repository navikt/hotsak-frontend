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
import { BrytbarBrødtekst, Brødtekst, Mellomtittel, Tekst, Undertittel } from '../../../felleskomponenter/typografi.tsx'
import { NotatType } from '../../../types/types.internal.ts'
import { formaterTidsstempelLesevennlig } from '../../../utils/dato.ts'
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
  const [notatType, setNotatType] = useState<string>(NotatType.JOURNALFØRT.toString())
  const [visFeilregistrerInfoModal, setVisFeilregistrerInfoModal] = useState(false)

  return (
    <>
      <VStack gap="2">
        <Brødtekst>
          Opplysninger som er relevante for saksbehandlingen skal journalføres og knyttes til saken.
        </Brødtekst>
        <ReadMore size="small" header="Når må du journalføre notat i saken">
          <BrytbarBrødtekst>
            Når du mottar saksopplysninger utenfra som er med på å avgjøre utfallet av en sak, skal opplysningene
            journalføres. Når du skriver notatet nedenfor vil vi lagre utkastet fortløpende. Når du journalfører
            notatet, blir det synlig for innbygger neste virkedag på innlogget side på nav.no
          </BrytbarBrødtekst>
        </ReadMore>
        <Box paddingBlock="6 0">
          <ToggleGroup
            size="small"
            value={notatType}
            label="Opprett nytt notat"
            onChange={(notatType) => setNotatType(notatType)}
          >
            <ToggleGroup.Item value={NotatType.INTERNT.toString()} label={`Internt notat`} />
            <ToggleGroup.Item value={NotatType.JOURNALFØRT.toString()} label={`Skal journalføres`} />
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
            {notater.map((notat) => {
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
                            <ActionMenu.Item
                              disabled={!notat.journalpostId || !notat.dokumentId}
                              onClick={() => setVisFeilregistrerInfoModal(true)}
                            >
                              Feilregistrer
                            </ActionMenu.Item>
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
        heading="Ingen utkast"
        open={visFeilregistrerInfoModal}
        onClose={() => setVisFeilregistrerInfoModal(false)}
      >
        <Brødtekst>
          Journalførte notater kan ikke feilregistreres i Hotsak enda. Dette må foreløpig gjøres fra Gosys.
        </Brødtekst>
      </InfoModal>
    </>
  )
}
