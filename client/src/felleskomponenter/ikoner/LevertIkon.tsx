import { Ikon, IkonProps } from './Ikon'

export const LevertIkon = ({ width = 20, height = 20, className }: IkonProps) => (
  <Ikon width={width} height={height} viewBox="0 0 24 24" className={className}>
    <g fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M14 5H2v11h1.764c.55-.614 1.348-1 2.236-1 .888 0 1.687.386 2.236 1H14V5zM1 18h2a3 3 0 106 0h7a3 3 0 106 0h1a1 1 0 001-1v-4.83a4 4 0 00-.556-2.034L21.58 6.982A2 2 0 0019.859 6H16V4a1 1 0 00-1-1H1a1 1 0 00-1 1v13a1 1 0 001 1zm19 0a1 1 0 10-2 0 1 1 0 002 0zm1.236-2H22v-3.83a2 2 0 00-.278-1.017L19.859 8H16v8h.764c.55-.614 1.348-1 2.236-1 .889 0 1.687.386 2.236 1zM6 17a1 1 0 110 2 1 1 0 010-2z" fill="currentColor"></path>
    </g>
  </Ikon>
)
