import { Ikon, IkonProps } from './Ikon'

export const RullestolIkon = ({ width = 14, height = 14, className }: IkonProps) => (
  <Ikon width={width} height={height} viewBox="0 0 24 24" className={className}>
    <g fill="none">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M1 1a1 1 0 011-1h2a3 3 0 013 3v4h9a3 3 0 013 3v5h3a1 1 0 110 2h-5v-7a1 1 0 00-1-1H5V3a1 1 0 00-1-1H2a1 1 0 01-1-1zm7 21a5 5 0 100-10 5 5 0 000 10zm0 2a7 7 0 100-14 7 7 0 000 14zm12-3a1 1 0 11-2 0 1 1 0 012 0zm2 0a3 3 0 11-6 0 3 3 0 016 0z"
        fill="var(--navds-color-text-primary)"
      />
    </g>
  </Ikon>
)
