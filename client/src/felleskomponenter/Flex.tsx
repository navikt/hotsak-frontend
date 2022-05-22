import styled from 'styled-components'

type BasicValue = 'normal' | 'stretch'

type GlobalValue = 'inherit' | 'initial' | 'unset'

type PositionalValue =
  | 'center'
  | 'start'
  | 'end'
  | 'flex-end'
  | 'flex-start'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'

type BaselineValue = 'baseline' | 'first baseline' | 'last baseline' | 'safe center' | 'unsafe center'

type AlignValue = BasicValue | GlobalValue | PositionalValue | BaselineValue

interface FlexProps {
  alignItems?: AlignValue
  alignContent?: AlignValue
  justifyItems?: AlignValue
  justifyContent?: AlignValue
  flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse' | GlobalValue
  flex?: number
}

export const Flex = styled.div<FlexProps>`
  display: flex;
  ${({ alignItems }) => alignItems && `align-items: ${alignItems};`}
  ${({ alignContent }) => alignContent && `align-content: ${alignContent};`}
    ${({ justifyItems }) => justifyItems && `justify-items: ${justifyItems};`}
    ${({ justifyContent }) => justifyContent && `justify-content: ${justifyContent};`}
    ${({ flexDirection }) => flexDirection && `flex-direction: ${flexDirection};`}
    ${({ flex }) => flex !== undefined && `flex: ${flex};`}
`

export const FlexColumn = styled(Flex)`
  flex-direction: column;
`

type KolonneProps = {
  width?: string
  textAlign?: string
  marginLeft?: string
}

type RadProps = {
  paddingTop?: string
}

export const Rad = styled('div')<RadProps>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  padding-top: ${(props) => props.paddingTop || '0.1rem'};
  padding-bottom: 0.2rem;
`

export const Kolonne = styled('div')<KolonneProps>`
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  flex: 1;
  text-align: ${(props) => props.textAlign || 'left'};
  max-width: ${(props) => props.width || 'auto'};
  ${(props) => props.marginLeft && `margin-left: ${props.marginLeft};`}
`
