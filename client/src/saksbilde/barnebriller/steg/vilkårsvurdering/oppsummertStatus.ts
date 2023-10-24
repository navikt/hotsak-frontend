import { VilkårsResultat } from '../../../../types/types.internal'

export function alertVariant(vilkårOppfylt?: VilkårsResultat) {
  if (!vilkårOppfylt) {
    return 'error'
  }

  switch (vilkårOppfylt) {
    case VilkårsResultat.JA:
      return 'success'

    case VilkårsResultat.KANSKJE:
      return 'warning'
    case VilkårsResultat.NEI:
      return 'error'
    case VilkårsResultat.DOKUMENTASJON_MANGLER:
      return 'info'
  }
}

export function vilkårStatusTekst(vilkårOppfylt?: VilkårsResultat) {
  /*if (!vilkårOppfylt) {
    return 'Skal ikke vurderes'
  }*/

  switch (vilkårOppfylt) {
    case VilkårsResultat.JA:
      return 'Oppfylt'
    case VilkårsResultat.NEI:
      return 'Ikke oppfylt'
    case VilkårsResultat.KANSKJE:
      return 'Må vurderes'
    case VilkårsResultat.DOKUMENTASJON_MANGLER:
      return 'Mangler opplysninger'
  }
}
