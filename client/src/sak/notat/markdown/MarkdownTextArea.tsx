import { Box, ErrorMessage, Label, VStack } from '@navikt/ds-react'

import { MarkdownEditor } from './MarkdownEditor'
import classes from './MarkdownTextArea.module.css'

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
    <VStack gap="space-8">
      <Label size="small">{label}</Label>
      <div className={classes.markdownEditorStyling}>
        <Box
          marginBlock="space-0 space-0"
          borderRadius="8"
          borderColor="neutral"
          borderWidth="1"
          className="mdxEditorBox"
        >
          <MarkdownEditor tekst={tekst} onChange={onChange} readOnly={readOnly} />
        </Box>
      </div>
      {valideringsfeil && (
        <ErrorMessage showIcon size="small">
          {valideringsfeil}
        </ErrorMessage>
      )}
    </VStack>
  )
}
