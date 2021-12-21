import { SVGProps } from 'react'
import { SortOrder } from '../../types/types.internal'

export interface SorteringsIkonProps extends SVGProps<any> {
  sortOrder: SortOrder
  active: boolean
}

export const SorteringsIkon = ({ sortOrder, active }: SorteringsIkonProps) => {
  let topArrowColor = 'var(--navds-semantic-color-text)'
  let bottomArrowColor = 'var(--navds-semantic-color-text)'
  if (active) {
    topArrowColor =
      sortOrder === SortOrder.ASCENDING
        ? 'var(--navds-semantic-color-interaction-primary)'
        : 'var(--navds-semantic-color-text-muted)'
    bottomArrowColor =
      sortOrder === SortOrder.DESCENDING
        ? 'var(--navds-semantic-color-interaction-primary)'
        : 'var(--navds-semantic-color-text-muted)'
  }

  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 16L3 11.4286L4.5 10L8 13.1429L11.5 10L13 11.4286L8 16Z"
        fill={bottomArrowColor}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.99999 -4.37114e-07L13 4.57143L11.5 6L7.99999 2.85714L4.49998 6L2.99998 4.57143L7.99999 -4.37114e-07Z"
        fill={topArrowColor}
      />
    </svg>
  )
}
