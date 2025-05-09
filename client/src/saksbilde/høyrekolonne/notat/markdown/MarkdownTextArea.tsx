import { Box, ErrorMessage, Label } from '@navikt/ds-react'
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
    <div>
      <Label size="small">{label}</Label>
      <MarkdownEditorStyling>
        <Box
          background="surface-default"
          marginBlock="0 0"
          borderRadius="medium"
          borderColor="border-default"
          borderWidth="1"
          className="mdxEditorBox"
        >
          <MarkdownEditor tekst={tekst} onChange={onChange} readOnly={readOnly} />
        </Box>
      </MarkdownEditorStyling>
      {valideringsfeil && (
        <ErrorMessage showIcon size="small">
          {valideringsfeil}
        </ErrorMessage>
      )}
    </div>
  )
}

const MarkdownEditorStyling = styled(Box)`
  margin-top: 0.5rem;
  .mdxEditorBox:has([contenteditable='true']:focus) {
    border: 4px solid rgba(0, 52, 125, 1);
    margin: -3px;
  }
`
