import { Barnebrillesak, VilkårsResultat } from '../../types/types.internal'

export function useSamletVurdering(sak?: Barnebrillesak): VilkårsResultat | undefined {
  if (!sak || !sak.vilkårsvurdering) {
    return undefined
  }

  return sak.vilkårsvurdering.vilkår
    .map((vilkår) => vilkår.vilkårOppfylt)
    .reduce((samletStatus, vilkårOppfylt) => {
      if (samletStatus === VilkårsResultat.NEI) {
        return samletStatus
      } else if (vilkårOppfylt === VilkårsResultat.NEI || vilkårOppfylt === VilkårsResultat.DOKUMENTASJON_MANGLER) {
        return vilkårOppfylt
      } else {
        return samletStatus
      }
    }, VilkårsResultat.JA)
}
