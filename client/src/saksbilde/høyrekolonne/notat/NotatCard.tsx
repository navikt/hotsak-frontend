import { listsPlugin, MDXEditor, quotePlugin, thematicBreakPlugin } from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { ChevronDownIcon, ChevronUpIcon, ExternalLinkIcon, MenuElipsisHorizontalCircleIcon } from '@navikt/aksel-icons'
import { ActionMenu, Box, Button, Heading, HStack, Spacer, Tag, Tooltip, VStack } from '@navikt/ds-react'
import { useRef, useState } from 'react'
import { Brødtekst, Undertittel } from '../../../felleskomponenter/typografi.tsx'
import { Notat, NotatType } from '../../../types/types.internal.ts'
import { formaterTidsstempelLesevennlig } from '../../../utils/dato.ts'
import { storForbokstavIOrd } from '../../../utils/formater.ts'
import { MardownEditorPreviewStyling } from '../../journalførteNotater/MarkdownEditor.tsx'
import { InfoModal } from '../../komponenter/InfoModal.tsx'
import { useIsClamped } from '../../../utils/useIsClamped.ts'

export interface NotaterProps {
  notat: Notat
}

export function NotatCard({ notat }: NotaterProps) {
  const [visFeilregistrerInfoModal, setVisFeilregistrerInfoModal] = useState(false)
  const [visFeilregistrerInterntInfoModal, setVisFeilregistrerInterntInfoModal] = useState(false)
  const [visFulltNotat, setVisFulltNotat] = useState(false)
  const textRef = useRef<HTMLDivElement>(null)
  const isClamped = useIsClamped(notat.tekst, textRef)

  return (
    <>
      <Box key={notat.id} background="surface-subtle" padding="3" borderRadius="xlarge">
        <VStack gap="3">
          <HStack gap="2" wrap={false} align="center">
            <Tag variant={notat.type === NotatType.JOURNALFØRT ? 'alt3-filled' : 'neutral-moderate'} size="small">
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
          <VStack gap="3">
            <MardownEditorPreviewStyling ref={textRef} truncate={!visFulltNotat}>
              <MDXEditor
                markdown={notat.tekst}
                readOnly={true}
                contentEditableClassName="mdxEditorRemoveMargin"
                plugins={[listsPlugin(), quotePlugin(), thematicBreakPlugin()]}
              />
            </MardownEditorPreviewStyling>
            {isClamped && !visFulltNotat && (
              <div>
                <Button
                  variant="tertiary"
                  size="small"
                  icon={<ChevronDownIcon />}
                  iconPosition="right"
                  onClick={() => setVisFulltNotat(true)}
                >
                  Vis mer
                </Button>
              </div>
            )}
            {visFulltNotat && (
              <div>
                <Button
                  variant="tertiary"
                  size="small"
                  icon={<ChevronUpIcon />}
                  iconPosition="right"
                  onClick={() => setVisFulltNotat(false)}
                >
                  Vis mindre
                </Button>
              </div>
            )}
          </VStack>
        )}

        {!notat.tekst && (
          <Box paddingBlock={'3 0'}>
            <Brødtekst>Dette notatet ble sendt inn igjennom Gosys, les PDF filen for å se innholdet.</Brødtekst>
          </Box>
        )}
      </Box>

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
