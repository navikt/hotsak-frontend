import type { Enhet } from '../../types/types.internal'

export const enheter = {
  itAvdelingen: {
    enhetsnummer: '2970',
    enhetsnavn: 'IT-avdelingen',
  },
  vikafossen: {
    enhetsnummer: '2103',
    enhetsnavn: 'Nav Vikafossen',
  },
  oslo: {
    enhetsnummer: '4703',
    enhetsnavn: 'Nav hjelpemiddelsentral Oslo',
  },
  agder: {
    enhetsnummer: '4710',
    enhetsnavn: 'Nav hjelpemiddelsentral Agder',
  },
} satisfies Record<string, Enhet>
