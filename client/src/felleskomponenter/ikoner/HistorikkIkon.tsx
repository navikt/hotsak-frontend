import React from 'react'

import { IkonProps } from './Ikon'

export const HistorikkIkon: React.FC<IkonProps> = ({ width = 14, height = 14, className }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Historikk</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0zm0 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1 4v7H6v-2h5V6h2z"
      fill="var(--navds-semantic-color-text)"
    />
  </svg>
)
