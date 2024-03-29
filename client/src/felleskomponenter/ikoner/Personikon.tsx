import React from 'react'

import { Ikon, IkonProps } from './Ikon'

export const Personikon: React.FC<IkonProps> = ({ width = 14, height = 14, className }) => (
  <Ikon width={width} height={height} viewBox="0 0 24 24" className={className}>
    <g fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17 7A5 5 0 117 7a5 5 0 0110 0zm2 0A7 7 0 115 7a7 7 0 0114 0zm-7 10c4.355 0 8 2.992 8.924 7H23c-.956-5.12-5.517-9-11-9S1.956 18.88 1 24h2.076C4 19.992 7.645 17 12 17z"
        fill="currentColor"
      />
    </g>
  </Ikon>
)
