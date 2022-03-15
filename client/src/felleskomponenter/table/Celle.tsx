import { Tekst } from '../typografi'
import React from 'react'
import { TekstMedEllipsis } from '../TekstMedEllipsis'
import { Tooltip } from '../Tooltip'
import { Link } from 'react-router-dom'
import { DataCell } from './KolonneHeader'
import {Link  as ExternalLink } from '@navikt/ds-react'

interface DataCelleProps {
  width: number
}

export const DataCelle: React.FC<DataCelleProps> = ({ children, width }) => {
  return (
    <DataCell
      width={width}
    >
      {children}
    </DataCell>
  )
}

interface TekstCellProps {
  value: string
}

interface EllipsisCellProps {
  value: string
  minLength: number
  id: string
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
  return (
    <div>
      <Tekst>{value}</Tekst>
    </div>
  )
})

export const ExternalLinkCell = React.memo(({ to, value , target }: ExternalLinkCellProps) => {
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
            <TekstMedEllipsis>{value}</TekstMedEllipsis>
            {value.length > minLength && <Tooltip id={id} />}
          </Link>
        ) : (
          <>
            <TekstMedEllipsis>{value}</TekstMedEllipsis>
            {value.length > minLength && <Tooltip id={id} />}
          </>
        )}
      </div>
    )
})

export const EllipsisCell = React.memo(({ value, minLength, id }: EllipsisCellProps) => {
  return (
    <div data-for={id} data-tip={value}>
      <TekstMedEllipsis>{value}</TekstMedEllipsis>
      {value.length > minLength && <Tooltip id={id} />}
    </div>
  )
})
