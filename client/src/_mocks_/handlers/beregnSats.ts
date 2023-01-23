import { rest } from 'msw'

import { apiUrl } from '../../io/usePost'

import { BeregnSatsRequest, BeregnSatsResponse, Brilleseddel, SatsType } from '../../types/types.internal'

const brillekalkulatorHandlers = [
  rest.post<BeregnSatsRequest, any, BeregnSatsResponse>(apiUrl('/brillesedler'), (req, res, ctx) => {
    return res(
      ctx.delay(700),
      ctx.json(
        beregnSats({
          høyreSfære: req.body.høyreSfære,
          høyreSylinder: req.body.høyreSylinder,
          venstreSfære: req.body.venstreSfære,
          venstreSylinder: req.body.venstreSylinder,
        })
      )
    )
  }),
]

const satser: Record<SatsType, BeregnSatsResponse> = {
  [SatsType.SATS_1]: {
    sats: SatsType.SATS_1,
    satsBeskrivelse:
      'Briller med sfærisk styrke på minst ett glass ≥ 1,00D ≤ 4,00D og/eller cylinderstyrke ≥ 1,00D ≤ 4,00D',
    satsBeløp: 750,
  },
  [SatsType.SATS_2]: {
    sats: SatsType.SATS_2,
    satsBeskrivelse: 'Briller med sfærisk styrke på minst ett glass ≥ 4,25D ≤ 6,00D og cylinderstyrke ≤ 4,00D',
    satsBeløp: 1950,
  },
  [SatsType.SATS_3]: {
    sats: SatsType.SATS_3,
    satsBeskrivelse:
      'Briller med sfærisk styrke på minst ett glass ≥ 6,25D ≤ 8,00D og/eller cylinderstyrke ≥ 4,25D ≤ 6,00D',
    satsBeløp: 2650,
  },
  [SatsType.SATS_4]: {
    sats: SatsType.SATS_4,
    satsBeskrivelse: 'Briller med sfærisk styrke på minst ett glass ≥ 8,25D ≤ 10,00D og cylinderstyrke ≤ 6,00D',
    satsBeløp: 3150,
  },
  [SatsType.SATS_5]: {
    sats: SatsType.SATS_5,
    satsBeskrivelse: 'Briller med sfærisk styrke på minst ett glass ≥ 10,25D og/eller cylinderstyrke ≥ 6,25D',
    satsBeløp: 4850,
  },
  [SatsType.INGEN]: {
    sats: SatsType.INGEN,
    satsBeskrivelse: 'N/A',
    satsBeløp: 0,
  },
}

export function beregnSats(brilleseddel: Brilleseddel, brillepris?: string): BeregnSatsResponse & { beløp: string } {
  const høyreSfære = Number(brilleseddel.høyreSfære)
  const høyreSylinder = Number(brilleseddel.høyreSylinder)
  const venstreSfære = Number(brilleseddel.venstreSfære)
  const venstreSylinder = Number(brilleseddel.venstreSylinder)

  const sfære = Math.max(høyreSfære, venstreSfære)
  const sylinder = Math.max(høyreSylinder, venstreSylinder)

  let satsType: SatsType = SatsType.INGEN
  if (sfære >= 10.25 || sylinder >= 6.25) {
    satsType = SatsType.SATS_5
  } else if (sfære >= 8.25 && sfære <= 10 && sylinder <= 6) {
    satsType = SatsType.SATS_4
  } else if ((sfære >= 6.25 && sfære <= 8) || (sylinder >= 4.25 && sylinder <= 6)) {
    satsType = SatsType.SATS_3
  } else if (sfære >= 4.25 && sfære <= 6 && sylinder <= 4) {
    satsType = SatsType.SATS_2
  } else if ((sfære >= 1 && sfære <= 4) || (sylinder >= 1 && sylinder <= 4)) {
    satsType = SatsType.SATS_1
  }

  const sats = satser[satsType]
  return {
    ...sats,
    beløp: (brillepris ? Math.min(Number(brillepris), sats.satsBeløp) : sats.satsBeløp).toString(),
  }
}

export default brillekalkulatorHandlers
