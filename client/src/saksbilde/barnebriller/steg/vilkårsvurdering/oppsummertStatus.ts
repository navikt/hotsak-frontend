import { Vilkår, VilkårsResultat } from '../../../../types/types.internal'

export function oppsummertStatus(vilkår: Vilkår[]): VilkårsResultat {
  const vilkårsResultat = vilkår
    .map((v) => (v.resultatSaksbehandler ? v.resultatSaksbehandler : v.resultatAuto))
    .reduce((samletStatus, vilkårStatus) => {
      if (samletStatus === VilkårsResultat.KANSKJE || samletStatus === VilkårsResultat.NEI) {
        return samletStatus
      } else if (vilkårStatus === VilkårsResultat.NEI || vilkårStatus === VilkårsResultat.KANSKJE) {
        return vilkårStatus
      } else {
        return samletStatus
      }
    }, VilkårsResultat.JA)
  return vilkårsResultat!
}

export function alertVariant(vilkårOppfylt: VilkårsResultat) {
  switch (vilkårOppfylt) {
    case VilkårsResultat.JA:
      return 'success'
    case VilkårsResultat.NEI:
      return 'error'
    case VilkårsResultat.KANSKJE:
      return 'warning'
  }
}

export function vilkårStatusTekst(vilkårOppfylt: VilkårsResultat) {
  switch (vilkårOppfylt) {
    case VilkårsResultat.JA:
      return 'Oppfylt'
    case VilkårsResultat.NEI:
      return 'Ikke oppfylt'
    case VilkårsResultat.KANSKJE:
      return 'Må vurderes'
  }
}
