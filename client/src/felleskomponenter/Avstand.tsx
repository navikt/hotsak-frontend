import type { ReactNode } from 'react'
import styled from 'styled-components'

export interface AvstandProps {
  children?: ReactNode | undefined
  margin?: string
  marginTop?: number
  marginRight?: number
  marginBottom?: number
  marginLeft?: number
  padding?: string
  paddingTop?: number
  paddingRight?: number
  paddingBottom?: number
  paddingLeft?: number
  centered?: boolean
}

export function Avstand(props: AvstandProps) {
  const { children, centered, ...rest } = props
  return (
    <Box aria-hidden={!children} $centered={centered} {...rest}>
      {children}
    </Box>
  )
}

type MarginPadding = Omit<AvstandProps, 'centered' | 'children'> & {
  $centered?: boolean
}

const Box = styled.div<MarginPadding>`
  ${spacer}
  ${(props) => ({ textAlign: props.$centered ? 'center' : 'unset' })}
`

export function spacer(props: MarginPadding) {
  return {
    margin: props.margin,
    'margin-top': spacingVar(props.marginTop),
    'margin-right': spacingVar(props.marginRight),
    'margin-bottom': spacingVar(props.marginBottom),
    'margin-left': spacingVar(props.marginLeft),
    padding: props.padding,
    'padding-top': spacingVar(props.paddingTop),
    'padding-right': spacingVar(props.paddingRight),
    'padding-bottom': spacingVar(props.paddingBottom),
    'padding-left': spacingVar(props.paddingLeft),
  }
}

export function spacingVar(space?: number): string | undefined {
  return typeof space === 'number' ? `var(--a-spacing-${space})` : undefined
}
