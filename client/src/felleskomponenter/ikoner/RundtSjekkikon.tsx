import React from 'react'

import { Ikon, IkonProps } from './Ikon'

export const RundtSjekkikon: React.VFC<IkonProps> = ({ height = 16, width = 16, viewBox, className }) => (
  <Ikon height={height} width={width} viewBox={viewBox} className={className}>
    <g fill="none" fillRule="evenodd">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0zm5.047 7.671l1.399 1.43-8.728 8.398L6 14.02l1.395-1.434 2.319 2.118 7.333-7.032z"
        fill="var(--navds-global-color-green-600)"
      />
    </g>
  </Ikon>
)
