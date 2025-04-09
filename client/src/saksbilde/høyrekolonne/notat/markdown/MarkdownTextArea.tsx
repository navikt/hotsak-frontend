import { BodyShort, Box, ErrorMessage, HStack, Label, Loader } from '@navikt/ds-react'
import { MarkdownEditor } from './MarkdownEditor'
import styled from 'styled-components'

type MarkdownTextAreaProps = {
  label: string
  tekst: string
  onChange: (tekst: string) => void
  readOnly: boolean
  lagrer: boolean
  valideringsfeil?: string
}

export function MarkdownTextArea(props: MarkdownTextAreaProps) {
  const { label, tekst, onChange, readOnly, lagrer, valideringsfeil } = props
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
          <div style={{ position: 'relative' }}>
            <div
              style={{
                color: 'gray',
                position: 'absolute',
                right: '0.5em',
                top: '-1.5em',
                display: lagrer ? 'block' : 'none',
              }}
            >
              <HStack gap="2">
                <Loader size="small" title="Lagrer..." />
                <BodyShort size="small">Lagrer utkast</BodyShort>
              </HStack>
            </div>
          </div>
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

const MarkdownEditorStyling = styled.div`
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
  .mdxEditorBox:has([contenteditable='true']:focus) {
    border: 4px solid rgba(0, 52, 125, 1);
    margin: -3px;
  }
`
