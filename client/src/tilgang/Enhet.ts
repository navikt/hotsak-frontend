export const Enhet = {
  NAV_VIKAFOSSEN: '2103',
  IT_AVDELINGEN: '2970',
  NAV_HJELPEMIDDELSENTRAL_AGDER: '4710',
  NAV_HJELPEMIDDELSENTRAL_ROGALAND: '4711',
  NAV_HJELPEMIDDELSENTRAL_MØRE_OG_ROMSDAL: '4715',
  NAV_HJELPEMIDDELSENTRAL_TRØNDELAG: '4716',
} as const

export type EnhetType = typeof Enhet
export type EnhetsnummerType = EnhetType[keyof EnhetType]
