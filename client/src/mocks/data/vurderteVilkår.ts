import dayjs from 'dayjs'

import { Brilleseddel, VilkårsResultat, VurderingData } from '../../types/types.internal'
import { LagretVilkår } from './BarnebrillesakStore'

const vilkårSomTrengerBestillingsdato = [
  'UNDER_18_ÅR_PÅ_BESTILLINGSDATO',
  'MEDLEM_AV_FOLKETRYGDEN',
  'HAR_IKKE_VEDTAK_I_KALENDERÅRET',
  'BESTILLINGSDATO_TILBAKE_I_TID',
]

const vilkårSomTrengerBrilleseddel = ['BRILLESTYRKE']
const vilkårSomTrengerKomplettBrille = ['KOMPLETT_BRILLE']
const vilkårSomTrengerBestiltHosOptiker = ['BESTILT_HOS_OPTIKER']

const tomStyrke: Brilleseddel = {
  høyreSfære: '0.0',
  høyreSylinder: '0.0',
  venstreSfære: '0.0',
  venstreSylinder: '0.0',
}

export function vurderteVilkår(
  vilkårsvurderingId: string,
  brilleseddel: Brilleseddel = tomStyrke,
  komplettBrille: VurderingData,
  bestiltHosOptiker: VurderingData,
  bestillingsdato?: string
) {
  let vurderteVilkår = vurderteVilkår_JA(vilkårsvurderingId, brilleseddel, bestillingsdato)

  vurderteVilkår = oppdaterStatus(vurderteVilkår, !bestillingsdato, vilkårSomTrengerBestillingsdato)
  vurderteVilkår = oppdaterStatus(vurderteVilkår, brilleseddel === tomStyrke, vilkårSomTrengerBrilleseddel)

  vurderteVilkår = oppdaterStatus(
    vurderteVilkår,
    true,
    vilkårSomTrengerKomplettBrille,
    'SAKSBEHANDLER',
    komplettBrille.vilkårOppfylt || VilkårsResultat.JA
  )

  vurderteVilkår = oppdaterStatus(
    vurderteVilkår,
    true,
    vilkårSomTrengerBestiltHosOptiker,
    'SAKSBEHANDLER',
    bestiltHosOptiker.vilkårOppfylt || VilkårsResultat.JA
  )

  return vurderteVilkår
}

function oppdaterStatus(
  vilkår: Array<Omit<LagretVilkår, 'id'>>,
  predikatResultat: boolean,
  aktuelleVilkår: string[],
  vurdertType: 'SAKSBEHANDLER' | 'MASKINELL' = 'MASKINELL',
  nyttResultat: VilkårsResultat = VilkårsResultat.OPPLYSNINGER_MANGLER
): Array<Omit<LagretVilkår, 'id'>> {
  if (predikatResultat) {
    return vilkår.map((v) => {
      if (aktuelleVilkår.includes(v.vilkårId)) {
        if (vurdertType === 'SAKSBEHANDLER') {
          v.manuellVurdering = { vilkårOppfylt: nyttResultat }
        } else {
          v.manuellVurdering = { vilkårOppfylt: nyttResultat }
        }
        v.vilkårOppfylt = nyttResultat
      }
      return v
    })
  }
  return vilkår
}

function vurderteVilkår_JA(
  vilkårsvurderingId: string,
  brilleseddel: Brilleseddel,
  bestillingsdato: string = dayjs().toISOString()
): Array<Omit<LagretVilkår, 'id'>> {
  return [
    {
      vilkårsvurderingId,
      vilkårId: 'UNDER_18_ÅR_PÅ_BESTILLINGSDATO',
      beskrivelse: 'Barnet må være under 18 år på bestillingsdato',
      lovReferanse: '§ 2',
      lovdataLenke: 'https://lovdata.no/LTI/forskrift/2022-07-19-1364/§2',
      maskinellVurdering: {
        vilkårOppfylt: VilkårsResultat.JA,
        begrunnelse: 'Barnet var under 18 år på bestillingsdato',
      },
      vilkårOppfylt: VilkårsResultat.JA,
      begrunnelse: '',
      grunnlag: {
        barnetsAlder: '06.09 2016 (6 år)', // fixme
        bestillingsdato,
      },
    },
    {
      vilkårsvurderingId,
      vilkårId: 'MEDLEM_AV_FOLKETRYGDEN',
      beskrivelse: 'Medlem av folketrygden',
      lovReferanse: 'frtl. § 10-7 a',
      lovdataLenke: 'https://lovdata.no/LTI/forskrift/2022-07-19-1364/§2',
      maskinellVurdering: {
        vilkårOppfylt: VilkårsResultat.JA,
        begrunnelse: 'Barnet er antatt medlem i folketrygden basert på folkeregistrert adresse i Norge',
      },
      vilkårOppfylt: VilkårsResultat.JA,
      begrunnelse: '',
      grunnlag: {
        bestillingsdato,
        forenkletSjekkResultat: 'Oppfylt',
      },
    },
    {
      vilkårsvurderingId,
      vilkårId: 'BESTILT_HOS_OPTIKER',
      beskrivelse: 'Brillen må bestilles hos optiker',
      lovReferanse: '§ 2',
      lovdataLenke: 'https://lovdata.no/forskrift/2022-07-19-1364/§2',
      manuellVurdering: {
        vilkårOppfylt: VilkårsResultat.JA,
        begrunnelse: '',
      },
      vilkårOppfylt: VilkårsResultat.JA,
      begrunnelse: '',
      grunnlag: {},
    },
    {
      vilkårsvurderingId,
      vilkårId: 'KOMPLETT_BRILLE',
      beskrivelse: 'Bestillingen må inneholde brilleglass',
      lovReferanse: '§ 2',
      lovdataLenke: 'https://lovdata.no/forskrift/2022-07-19-1364/§2',
      manuellVurdering: {
        vilkårOppfylt: VilkårsResultat.JA,
        begrunnelse: '',
      },
      vilkårOppfylt: VilkårsResultat.JA,
      begrunnelse: '',
      grunnlag: {},
    },
    {
      vilkårsvurderingId,
      vilkårId: 'HAR_IKKE_VEDTAK_I_KALENDERÅRET',
      beskrivelse: 'Ikke fått støtte til barnebriller tidligere i år - manuelt Hotsak-vedtak',
      lovReferanse: '§ 3',
      lovdataLenke: 'https://lovdata.no/LTI/forskrift/2022-07-19-1364/§3',
      maskinellVurdering: {
        vilkårOppfylt: VilkårsResultat.JA,
        begrunnelse: 'Barnet har ikke vedtak om brille i kalenderåret',
      },
      vilkårOppfylt: VilkårsResultat.JA,
      begrunnelse: '',
      grunnlag: {},
    },
    {
      vilkårsvurderingId,
      vilkårId: 'BRILLESTYRKE',
      beskrivelse: 'Brillestyrken er innenfor fastsatte styrker',
      lovReferanse: '§ 2',
      lovdataLenke: 'https://lovdata.no/LTI/forskrift/2022-07-19-1364/§4',
      maskinellVurdering: {
        vilkårOppfylt: VilkårsResultat.JA,
        begrunnelse: 'Høyre sfære oppfyller vilkår om brillestyrke ≥ 1.0',
      },
      vilkårOppfylt: VilkårsResultat.JA,
      begrunnelse: '',
      grunnlag: {
        ...brilleseddel,
      },
    },
    {
      vilkårsvurderingId,
      vilkårId: 'BESTILLINGSDATO_TILBAKE_I_TID',
      beskrivelse: 'Bestillingsdato må være innenfor gyldig periode',
      lovReferanse: '§ 6',
      lovdataLenke: 'https://lovdata.no/LTI/forskrift/2022-07-19-1364/§6',
      maskinellVurdering: {
        vilkårOppfylt: VilkårsResultat.JA,
        begrunnelse: 'Bestillingsdato er innenfor gyldig periode',
      },
      vilkårOppfylt: VilkårsResultat.JA,
      begrunnelse: '',
      grunnlag: {
        bestillingsdato,
        seksMånederSiden: dayjs(bestillingsdato)?.subtract(6, 'month').toISOString(),
        førsteJournalpostOpprettet: '2023-04-18', // fixme
      },
    },
  ]
}
