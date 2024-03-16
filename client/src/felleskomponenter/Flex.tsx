import type { Property } from 'csstype'
import styled from 'styled-components'

interface RadProps {
  $paddingTop?: Property.PaddingTop
}

export const Rad = styled('div')<RadProps>`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  padding-top: ${(props) => props.$paddingTop || '0.1rem'};
  padding-bottom: 0.2rem;
`

interface KolonneProps {
  $marginLeft?: Property.MarginLeft
  $textAlign?: Property.TextAlign
  $width?: Property.Width
}

export const Kolonne = styled('div')<KolonneProps>`
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  flex: 1;
  text-align: ${({ $textAlign }) => $textAlign || 'left'};
  max-width: ${({ $width }) => $width || 'auto'};
  ${({ $marginLeft }) => $marginLeft && `margin-left: ${$marginLeft};`}
`
