import dayjs from 'dayjs'

import { Brilleseddel, VilkårsResultat } from '../../types/types.internal'
import { LagretVilkår } from './BarnebrillesakStore'

const vilkårSomTrengerBestillingsdato = [
  'UNDER_18_ÅR_PÅ_BESTILLINGSDATO',
  'MEDLEM_AV_FOLKETRYGDEN',
  'HAR_IKKE_VEDTAK_I_KALENDERÅRET',
  'BESTILLINGSDATO_TILBAKE_I_TID',
]

export function vurderteVilkår_ManglerBestillingsdato(
  vilkårsvurderingId: string,
  bestillingsdato: string,
  brilleseddel: Brilleseddel
) {
  const vilkår = vurderteVilkår_JA(vilkårsvurderingId, bestillingsdato, brilleseddel)

  return vilkår.map((v) => {
    if (vilkårSomTrengerBestillingsdato.includes(v.vilkårId)) {
      v.resultatAuto = VilkårsResultat.DOKUMENTASJON_MANGLER
    }
    return v
  })
}

export function vurderteVilkår_JA(
  vilkårsvurderingId: string,
  bestillingsdato: string,
  brilleseddel: Brilleseddel
): Array<Omit<LagretVilkår, 'id'>> {
  return [
    /*{
      vilkårsvurderingId,
      vilkårId: 'MEDLEMMETS_OPPLYSNINGSPLIKT',
      beskrivelse: 'Opplysningsplikten',
      lovReferanse: 'ftrl. § 21-3',
      lovdataLenke: 'https://lovdata.no/dokument/NL/lov/1997-02-28-19/KAPITTEL_8-1#%C2%A721-3',
      resultatAuto: undefined,
      begrunnelseAuto: undefined,
      resultatSaksbehandler: VilkårsResultat.JA,
      begrunnelseSaksbehandler: undefined,
      grunnlag: {},
    },*/
    {
      vilkårsvurderingId,
      vilkårId: 'UNDER_18_ÅR_PÅ_BESTILLINGSDATO',
      beskrivelse: 'Barnet må være under 18 år på bestillingsdato',
      lovReferanse: '§ 2',
      lovdataLenke: 'https://lovdata.no/LTI/forskrift/2022-07-19-1364/§2',
      resultatAuto: VilkårsResultat.JA,
      begrunnelseAuto: 'Barnet var under 18 år på bestillingsdato',
      resultatSaksbehandler: undefined,
      begrunnelseSaksbehandler: undefined,
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
      resultatAuto: VilkårsResultat.JA,
      begrunnelseAuto: 'Barnet er antatt medlem i folketrygden basert på folkeregistrert adresse i Norge',
      resultatSaksbehandler: undefined,
      begrunnelseSaksbehandler: undefined,
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
      resultatAuto: undefined,
      begrunnelseAuto: undefined,
      resultatSaksbehandler: VilkårsResultat.JA,
      grunnlag: {},
    },
    {
      vilkårsvurderingId,
      vilkårId: 'KOMPLETT_BRILLE',
      beskrivelse: 'Bestillingen inneholder brilleglass',
      lovReferanse: '§ 2',
      lovdataLenke: 'https://lovdata.no/forskrift/2022-07-19-1364/§2',
      resultatAuto: undefined,
      begrunnelseAuto: undefined,
      resultatSaksbehandler: VilkårsResultat.JA,
      grunnlag: {},
    },
    {
      vilkårsvurderingId,
      vilkårId: 'HAR_IKKE_VEDTAK_I_KALENDERÅRET',
      beskrivelse: 'Ikke fått støtte til barnebriller tidligere i år - manuelt Hotsak-vedtak',
      lovReferanse: '§ 3',
      lovdataLenke: 'https://lovdata.no/LTI/forskrift/2022-07-19-1364/§3',
      resultatAuto: VilkårsResultat.JA,
      begrunnelseAuto: 'Barnet har ikke vedtak om brille i kalenderåret',
      resultatSaksbehandler: undefined,
      begrunnelseSaksbehandler: undefined,
      grunnlag: {},
    },
    {
      vilkårsvurderingId,
      vilkårId: 'BRILLESTYRKE',
      beskrivelse: 'Brillestyrken er innenfor fastsatte styrker',
      lovReferanse: '§ 2, 2. ledd',
      lovdataLenke: 'https://lovdata.no/LTI/forskrift/2022-07-19-1364/§4',
      resultatAuto: VilkårsResultat.JA,
      begrunnelseAuto: 'Høyre sfære oppfyller vilkår om brillestyrke ≥ 1.0',
      resultatSaksbehandler: undefined,
      begrunnelseSaksbehandler: undefined,
      grunnlag: {
        ...brilleseddel,
      },
    },
    {
      vilkårsvurderingId,
      vilkårId: 'BESTILLINGSDATO_TILBAKE_I_TID',
      beskrivelse: 'Bestillingsdato innenfor gyldig periode',
      lovReferanse: '§ 6',
      lovdataLenke: 'https://lovdata.no/LTI/forskrift/2022-07-19-1364/§6',
      resultatAuto: VilkårsResultat.JA,
      begrunnelseAuto: 'Bestillingsdato er innenfor gyldig periode',
      resultatSaksbehandler: undefined,
      begrunnelseSaksbehandler: undefined,
      grunnlag: {
        bestillingsdato,
        seksMånederSiden: dayjs(bestillingsdato).subtract(6, 'month').toISOString(),
        førsteJournalpostOpprettet: '2023-04-18', // fixme
      },
    },
  ]
}

export function vurderteVilkår_IKKE_VURDERT(vilkårsvurderingId: string): Array<Omit<LagretVilkår, 'id'>> {
  return [
    {
      vilkårsvurderingId,
      vilkårId: 'UNDER_18_ÅR_PÅ_BESTILLINGSDATO',
      beskrivelse: 'Barnet må være under 18 år på bestillingsdato',
      lovReferanse: '§ 2',
      lovdataLenke: 'https://lovdata.no/LTI/forskrift/2022-07-19-1364/§2',
      resultatAuto: undefined,
      begrunnelseAuto: 'Barnet var under 18 år på bestillingsdato',
      resultatSaksbehandler: undefined,
      begrunnelseSaksbehandler: undefined,
      grunnlag: {},
    },
    {
      vilkårsvurderingId,
      vilkårId: 'BRILLESTYRKE',
      beskrivelse: 'Brillestyrken er innenfor fastsatte styrker',
      lovReferanse: '§ 2',
      lovdataLenke: 'https://lovdata.no/LTI/forskrift/2022-07-19-1364/§4',
      resultatAuto: undefined,
      begrunnelseAuto: 'Høyre sfære oppfyller vilkår om brillestyrke ≥ 1.0',
      resultatSaksbehandler: undefined,
      begrunnelseSaksbehandler: undefined,
      grunnlag: {},
    },
    {
      vilkårsvurderingId,
      vilkårId: 'HAR_IKKE_VEDTAK_I_KALENDERÅRET',
      beskrivelse: 'Ikke fått støtte til barnebriller tidligere i år - manuelt Hotsak-vedtak',
      lovReferanse: '§ 3',
      lovdataLenke: 'https://lovdata.no/LTI/forskrift/2022-07-19-1364/§3',
      resultatAuto: undefined,
      begrunnelseAuto: 'Barnet har ikke vedtak om brille i kalenderåret',
      resultatSaksbehandler: undefined,
      begrunnelseSaksbehandler: undefined,
      grunnlag: {},
    },
    {
      vilkårsvurderingId,
      vilkårId: 'BESTILLINGSDATO_TILBAKE_I_TID',
      beskrivelse: 'Bestillingsdato innenfor gyldig periode',
      lovReferanse: '§ 6',
      lovdataLenke: 'https://lovdata.no/LTI/forskrift/2022-07-19-1364/§6',
      resultatAuto: undefined,
      begrunnelseAuto: 'Bestillingsdato er innenfor gyldig periode',
      resultatSaksbehandler: undefined,
      begrunnelseSaksbehandler: undefined,
      grunnlag: {},
    },
    {
      vilkårsvurderingId,
      vilkårId: 'MEDLEM_AV_FOLKETRYGDEN',
      beskrivelse: 'Medlem av folketrygden',
      lovReferanse: 'frtl. § 10-7a',
      lovdataLenke: 'https://lovdata.no/LTI/forskrift/2022-07-19-1364/§2',
      resultatAuto: undefined,
      begrunnelseAuto: 'Barnet er antatt medlem i folketrygden basert på folkeregistrert adresse i Norge',
      resultatSaksbehandler: undefined,
      begrunnelseSaksbehandler: undefined,
      grunnlag: {},
    },
    /* {
      vilkårsvurderingId,
      vilkårId: 'MEDLEMMETS_OPPLYSNINGSPLIKT',
      beskrivelse: 'Opplysningsplikten',
      lovReferanse: 'frtl. § 21-3',
      lovdataLenke: 'https://lovdata.no/dokument/NL/lov/1997-02-28-19/KAPITTEL_8-1#%C2%A721-3',
      resultatAuto: undefined,
      begrunnelseAuto: undefined,
      resultatSaksbehandler: VilkårsResultat.NEI,
      begrunnelseSaksbehandler: undefined,
      grunnlag: {},
    },*/

    {
      vilkårsvurderingId,
      vilkårId: 'BESTILT_HOS_OPTIKER',
      beskrivelse: 'Brillen må bestilles hos optiker',
      lovReferanse: '§ 2',
      lovdataLenke: 'https://lovdata.no/forskrift/2022-07-19-1364/§2',
      resultatAuto: undefined,
      begrunnelseAuto: undefined,
      resultatSaksbehandler: undefined,
      grunnlag: {},
    },
    {
      vilkårsvurderingId,
      vilkårId: 'KOMPLETT_BRILLE',
      beskrivelse: 'Bestillingen inneholder brilleglass',
      lovReferanse: '§ 2',
      lovdataLenke: 'https://lovdata.no/forskrift/2022-07-19-1364/§2',
      resultatAuto: undefined,
      begrunnelseAuto: undefined,
      resultatSaksbehandler: undefined,
      grunnlag: {},
    },
  ]
}
