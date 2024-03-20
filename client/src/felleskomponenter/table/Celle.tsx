import React from 'react'
import { Link } from 'react-router-dom'

import { Link as ExternalLink } from '@navikt/ds-react'

import { TooltipWrapper } from '../TooltipWrapper'
import { Tekst, TekstMedEllipsis } from '../typografi'
import { DataCell } from './KolonneHeader'

interface DataCelleProps {
  children: React.ReactNode
  width: number
}

export function DataCelle({ children, width }: DataCelleProps) {
  return <DataCell width={width}>{children}</DataCell>
}

interface TekstCellProps {
  value?: string
}

export const TekstCell = React.memo(({ value }: TekstCellProps) => {
  return <Tekst>{value}</Tekst>
})

interface ExternalLinkCellProps {
  to?: string
  value?: string
  target?: string
}

export const ExternalLinkCell = React.memo(({ to, value, target }: ExternalLinkCellProps) => {
  return (
    <div>
      {to ? (
        <ExternalLink href={to} target={`${target}`}>
          {value}
        </ExternalLink>
      ) : (
        <Tekst>{value}</Tekst>
      )}
    </div>
  )
})

interface LinkCellProps {
  to?: string
  id: string
  value?: string
  minLength: number
}

export const LinkCell = React.memo(({ to, id, minLength, ...rest }: LinkCellProps) => {
  const value = rest.value ?? ''
  return (
    <div data-for={id} data-tip={value}>
      {to ? (
        <Link to={to}>
          <TooltipWrapper visTooltip={value.length > minLength} content={value}>
            <TekstMedEllipsis>{value}</TekstMedEllipsis>
          </TooltipWrapper>
        </Link>
      ) : (
        <>
          <TooltipWrapper visTooltip={value.length > minLength} content={value}>
            <TekstMedEllipsis>{value}</TekstMedEllipsis>
          </TooltipWrapper>
        </>
      )}
    </div>
  )
})

interface EllipsisCellProps {
  value?: string
  minLength: number
}

export const EllipsisCell = React.memo(({ minLength, ...rest }: EllipsisCellProps) => {
  const value = rest.value ?? ''
  return (
    <TooltipWrapper visTooltip={value.length > minLength} content={value}>
      <TekstMedEllipsis>{value}</TekstMedEllipsis>
    </TooltipWrapper>
  )
})
