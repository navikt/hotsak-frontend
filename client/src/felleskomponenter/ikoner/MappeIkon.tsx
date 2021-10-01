import { Ikon, IkonProps } from './Ikon'

export const MappeIkon = ({ width = 14, height = 14, className }: IkonProps) => (
  <Ikon width={width} height={height} viewBox="0 0 24 24" className={className}>
    <g fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 8V4H2v16h20V8H9zM0 4v16a2 2 0 002 2h20a2 2 0 002-2V8a2 2 0 00-2-2H11V4a2 2 0 00-2-2H2a2 2 0 00-2 2z"
        fill="var(--navds-color-text-primary)"
      ></path>
    </g>
  </Ikon>
)
