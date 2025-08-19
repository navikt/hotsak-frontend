import { listsPlugin, MDXEditor, quotePlugin, thematicBreakPlugin } from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons'
import { Box, Button, Heading, HStack, Spacer, Tag, VStack } from '@navikt/ds-react'
import { useRef, useState } from 'react'
import { Brødtekst, Undertittel } from '../../../felleskomponenter/typografi.tsx'
import { Notat, NotatKlassifisering, NotatType } from '../../../types/types.internal.ts'
import { formaterTidsstempelLesevennlig } from '../../../utils/dato.ts'
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
      <Box.New key={notat.id} background="neutral-soft" padding="3" borderRadius="xlarge" data-testid="notat-card">
        <VStack gap="3">
          <HStack gap="2" wrap={false} align="center">
            <Tag variant={notat.type === NotatType.JOURNALFØRT ? 'alt3-filled' : 'neutral-moderate'} size="small">
              {notat.type === NotatType.INTERNT ? 'Internt arbeidsnotat' : 'Forvaltningsnotat'}
            </Tag>

            {notat.klassifisering === NotatKlassifisering.EKSTERNE_SAKSOPPLYSNINGER && (
              <Tag variant="success-moderate" size="small">
                Synlig for bruker
              </Tag>
            )}
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
      </Box.New>
    </>
  )
}
