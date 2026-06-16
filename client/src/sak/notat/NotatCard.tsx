import { listsPlugin, MDXEditor, quotePlugin, thematicBreakPlugin } from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons'
import { Box, Button, Heading, HStack, Spacer, Tag, VStack } from '@navikt/ds-react'
import { useRef, useState } from 'react'

import { FormatDateTime } from '../../felleskomponenter/format/FormatDateTime.tsx'
import { Tekst, Undertittel } from '../../felleskomponenter/typografi.tsx'
import { useIsClamped } from '../../utils/useIsClamped.ts'
import { MardownEditorPreviewStyling } from './markdown/MarkdownEditor.tsx'
import { NotatActions } from './NotatActions.tsx'
import classes from './NotatCard.module.css'
import { NotatTag } from './NotatTag.tsx'
import { type Notat, NotatKlassifisering, NotatType } from './notatTyper.ts'

export interface NotatCardProps {
  notat: Notat
}

export function NotatCard({ notat }: NotatCardProps) {
  const [visFulltNotat, setVisFulltNotat] = useState(false)
  const textRef = useRef<HTMLDivElement>(null)
  const isClamped = useIsClamped(notat.tekst, textRef)

  return (
    <Box background="neutral-soft" padding="space-12" borderRadius="12" data-testid="notat-card">
      <VStack gap="space-12">
        <HStack gap="space-8" align="center" wrap={false}>
          <NotatTag type={notat.type} />
          {notat.klassifisering === NotatKlassifisering.EKSTERNE_SAKSOPPLYSNINGER && (
            <Tag data-color="success" variant="moderate" size="small">
              Synlig for bruker
            </Tag>
          )}
          <Spacer />
          {notat.type !== NotatType.KOMMENTAR && <NotatActions notat={notat} />}
        </HStack>
        {notat.tittel && (
          <Heading level="3" size="xsmall" className={classes.heading}>
            {notat.tittel}
          </Heading>
        )}
        <VStack gap="space-2">
          <Tekst>
            <FormatDateTime dateTime={notat.ferdigstilt} />
          </Tekst>
          <Undertittel>{notat.saksbehandler.navn}</Undertittel>
        </VStack>
      </VStack>
      {notat.tekst && (
        <VStack gap="space-12">
          <MardownEditorPreviewStyling ref={textRef} truncate={!visFulltNotat}>
            <MDXEditor
              markdown={notat.tekst}
              readOnly={true}
              contentEditableClassName="mdxEditorRemoveMargin"
              plugins={[listsPlugin(), quotePlugin(), thematicBreakPlugin()]}
            />
          </MardownEditorPreviewStyling>
          {isClamped && (
            <div>
              <Button
                variant="tertiary"
                size="small"
                icon={visFulltNotat ? <ChevronUpIcon /> : <ChevronDownIcon />}
                iconPosition="right"
                onClick={() => setVisFulltNotat((state) => !state)}
              >
                {visFulltNotat ? 'Vis mindre' : 'Vis mer'}
              </Button>
            </div>
          )}
        </VStack>
      )}
      {!notat.tekst && (
        <Box paddingBlock="space-12 space-0">
          <Tekst>Dette notatet ble opprettet i Gosys, les PDF-filen for å se innholdet.</Tekst>
        </Box>
      )}
    </Box>
  )
}
