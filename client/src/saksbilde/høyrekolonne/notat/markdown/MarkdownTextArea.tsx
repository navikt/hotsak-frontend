import { Box, ErrorMessage, Label, VStack } from '@navikt/ds-react'
import styled from 'styled-components'

import { MarkdownEditor } from './MarkdownEditor'

type MarkdownTextAreaProps = {
  label: string
  tekst: string
  onChange: (tekst: string) => void
  readOnly: boolean
  valideringsfeil?: string
}

export function MarkdownTextArea(props: MarkdownTextAreaProps) {
  const { label, tekst, onChange, readOnly, valideringsfeil } = props
  return (
    <VStack gap="2">
      <Label size="small">{label}</Label>
      <MarkdownEditorStyling>
        <Box.New marginBlock="0 0" borderRadius="large" borderColor="neutral" borderWidth="1" className="mdxEditorBox">
          <MarkdownEditor tekst={tekst} onChange={onChange} readOnly={readOnly} />
        </Box.New>
      </MarkdownEditorStyling>
      {valideringsfeil && (
        <ErrorMessage showIcon size="small">
          {valideringsfeil}
        </ErrorMessage>
      )}
    </VStack>
  )
}

const MarkdownEditorStyling = styled(Box)`
  .mdxEditorBox:has([contenteditable='true']:focus) {
    border: 4px solid var(--ax-border-focus);
    margin: -3px;
  }
`
