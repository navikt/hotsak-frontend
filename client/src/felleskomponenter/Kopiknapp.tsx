import { CopyButton, Tooltip, TooltipProps, CopyButtonProps, Bleed } from '@navikt/ds-react'

export interface KopiknappProps {
  tooltip: string
  copyText: CopyButtonProps['copyText']
  placement?: TooltipProps['placement']
}

export function InlineKopiknapp(props: KopiknappProps) {
  const { tooltip, copyText, placement } = props
  return (
    <Bleed marginBlock="1 0">
      <Tooltip content={tooltip} placement={placement}>
        <CopyButton size="xsmall" copyText={copyText} />
      </Tooltip>
    </Bleed>
  )
}

export function Kopiknapp(props: KopiknappProps) {
  const { tooltip, copyText, placement } = props
  return (
    <Tooltip content={tooltip} placement={placement}>
      <CopyButton size="small" copyText={copyText} />
    </Tooltip>
  )
}
