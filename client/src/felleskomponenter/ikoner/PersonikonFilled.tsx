import React from 'react'

import { Ikon, IkonProps } from './Ikon'

export const PersonikonFilled: React.VFC<IkonProps> = ({ width = 28, height = 28 }) => (
  <Ikon width={width} height={height} viewBox="0 0 28 28">
    <circle fill="#ffc166" cx="14" cy="14" r="14" />
    <g transform="translate(2.000000, 1.000000)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 7a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm3-5a5 5 0 1 0 0 10 5 5 0 0 0 0-10ZM6 21a6 6 0 0 1 12 0v1h2v-1a8 8 0 1 0-16 0v1h2v-1Z"
        fill="currentColor"
      />
    </g>
  </Ikon>
)
