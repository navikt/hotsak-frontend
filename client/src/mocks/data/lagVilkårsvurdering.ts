import {
  type Vilkår,
  type Vilkårsgrunnlag,
  VilkårsResultat,
  type Vilkårsvurdering,
  type VurderVilkårRequest,
} from '../../types/types.internal.ts'
import { beregnSats } from './beregnSats.ts'
import { nåIso } from './felles.ts'
import { vurderteVilkår } from './vurderteVilkår.ts'

export type LagretVilkårsgrunnlag = Vilkårsgrunnlag

export function lagVilkårsgrunnlag(sakId: string, vurderVilkårRequest: VurderVilkårRequest): LagretVilkårsgrunnlag {
  return {
    data: { ...vurderVilkårRequest.data },
    sakId,
    sakstype: vurderVilkårRequest.sakstype,
    målform: vurderVilkårRequest.målform,
  }
}

export type LagretVilkårsvurdering = Omit<Vilkårsvurdering, 'vilkår'>

export function lagVilkårsvurdering(sakId: string, vurderVilkårRequest: VurderVilkårRequest): LagretVilkårsvurdering {
  if (vurderVilkårRequest.data) {
    const { brillepris, brilleseddel } = vurderVilkårRequest.data
    const { sats, satsBeløp, satsBeskrivelse, beløp } = beregnSats(brilleseddel, brillepris)

    return {
      id: sakId,
      sakId,
      resultat: VilkårsResultat.JA,
      data: {
        sats,
        satsBeløp,
        satsBeskrivelse,
        beløp,
      },
      opprettet: nåIso(),
    }
  } else {
    throw new Error('Noe er feil med VurderVilkårRequest-payload i lagVilkårsvurdering()')
  }
}

export interface LagretVilkår extends Vilkår {
  vilkårsvurderingId: string
}
export type InsertVilkår = Omit<LagretVilkår, 'id'>

export function lagVilkår(vilkårsvurderingId: string, vurderVilkårRequest: VurderVilkårRequest): InsertVilkår[] {
  const { bestillingsdato, brilleseddel, bestiltHosOptiker, komplettBrille, kjøptBrille } = vurderVilkårRequest.data!

  return vurderteVilkår(
    vilkårsvurderingId,
    brilleseddel!,
    komplettBrille!,
    bestiltHosOptiker,
    kjøptBrille,
    bestillingsdato
  )
}
