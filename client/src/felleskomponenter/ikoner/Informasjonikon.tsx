import React from 'react'

import { Ikon, IkonProps } from './Ikon'

export const Informasjonikon = ({ height = 16, width = 16, viewBox, className }: IkonProps) => (
  <Ikon height={height} width={width} viewBox={viewBox} className={className}>
    <g fill="none" fillRule="evenodd">
      <path
        d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0zM9 19v-2h2v-5H9v-2h4v7h2v2H9zm3-14a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"
        fill="var(--navds-semantic-color-feedback-info-icon)"
        fillRule="evenodd"
      />
    </g>
  </Ikon>
)

