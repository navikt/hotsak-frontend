import { CopyButton, Tooltip } from '@navikt/ds-react'

export interface KopiknappProps {
  tooltip: string
  copyText: string
}

export function Kopiknapp(props: KopiknappProps) {
  const { tooltip, copyText } = props
  return (
    <Tooltip content={tooltip}>
      <CopyButton size="small" copyText={copyText} />
    </Tooltip>
  )
}
