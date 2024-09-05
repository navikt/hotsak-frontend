import { CopyButton, Tooltip, TooltipProps, CopyButtonProps } from '@navikt/ds-react'

export interface KopiknappProps {
  tooltip: string
  copyText: CopyButtonProps['copyText']
  placement?: TooltipProps['placement']
}

export function Kopiknapp(props: KopiknappProps) {
  const { tooltip, copyText, placement } = props
  return (
    <Tooltip content={tooltip} placement={placement}>
      <CopyButton size="small" copyText={copyText} title="" />
    </Tooltip>
  )
}
