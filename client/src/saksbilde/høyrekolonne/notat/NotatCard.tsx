import { listsPlugin, MDXEditor, quotePlugin, thematicBreakPlugin } from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons'
import { Box, Button, Heading, HStack, Spacer, Tag, VStack } from '@navikt/ds-react'
import { useRef, useState } from 'react'
import { Brødtekst, Undertittel } from '../../../felleskomponenter/typografi.tsx'
import { Notat, NotatType } from '../../../types/types.internal.ts'
import { formaterTidsstempelLesevennlig } from '../../../utils/dato.ts'
import { storForbokstavIOrd } from '../../../utils/formater.ts'
import { useIsClamped } from '../../../utils/useIsClamped.ts'
import { MardownEditorPreviewStyling } from './markdown/MarkdownEditor.tsx'
import { NotatActions } from './NotatActions.tsx'

export interface NotaterProps {
  notat: Notat
  mutate: () => void
}

export function NotatCard({ notat, mutate: mutateNotater }: NotaterProps) {
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
            <Spacer />
            <NotatActions notat={notat} mutate={mutateNotater} />
          </HStack>
          <HStack gap="2">
            <Heading level="3" size="xsmall" style={{ fontSize: '1em' }}>
              {notat.tittel}
            </Heading>
          </HStack>
          <VStack>
            <Brødtekst>{formaterTidsstempelLesevennlig(notat.ferdigstilt)}</Brødtekst>
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
    </>
  )
}
