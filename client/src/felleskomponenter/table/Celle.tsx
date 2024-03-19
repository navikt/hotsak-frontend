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

export const DataCelle: React.FC<DataCelleProps> = ({ children, width }) => {
  return <DataCell width={width}>{children}</DataCell>
}

interface TekstCellProps {
  value: string
}

interface EllipsisCellProps {
  value: string
  minLength: number
}

interface LinkCellProps {
  to?: string
  id: string
  value: string
  minLength: number
}

interface ExternalLinkCellProps {
  to?: string
  value: string
  target: string
}

export const TekstCell = React.memo(({ value }: TekstCellProps) => {
  return <Tekst>{value}</Tekst>
})

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

export const LinkCell = React.memo(({ to, value, id, minLength }: LinkCellProps) => {
  return (
    <div data-for={id} data-tip={value}>
      {to ? (
        <Link to={to}>
          <TooltipWrapper visTooltip={!!value && value.length > minLength} content={value}>
            <TekstMedEllipsis>{value}</TekstMedEllipsis>
          </TooltipWrapper>
        </Link>
      ) : (
        <>
          <TooltipWrapper visTooltip={!!value && value.length > minLength} content={value}>
            <TekstMedEllipsis>{value}</TekstMedEllipsis>
          </TooltipWrapper>
        </>
      )}
    </div>
  )
})

export const EllipsisCell = React.memo(({ value, minLength }: EllipsisCellProps) => {
  return (
    <TooltipWrapper visTooltip={!!value && value.length > minLength} content={value}>
      <TekstMedEllipsis>{value}</TekstMedEllipsis>
    </TooltipWrapper>
  )
})
