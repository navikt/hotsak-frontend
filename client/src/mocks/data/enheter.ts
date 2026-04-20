import type { Enhet } from '../../types/hotlibs.ts'

export const enheter = {
  itAvdelingen: {
    nummer: '2970',
    navn: 'IT-avdelingen',
  },
  vikafossen: {
    nummer: '2103',
    navn: 'Nav Vikafossen',
  },
  oslo: {
    nummer: '4703',
    navn: 'Nav hjelpemiddelsentral Oslo',
  },
  agder: {
    nummer: '4710',
    navn: 'Nav hjelpemiddelsentral Agder',
  },
} satisfies Record<string, Enhet>
