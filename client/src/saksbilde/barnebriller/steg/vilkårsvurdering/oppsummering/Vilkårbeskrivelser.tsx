import styled from 'styled-components'

import { Vilkår, VilkårsResultat } from '../../../../../types/types.internal'

export const Vilkårbeskrivelser = ({ vilkår, resultat }: { vilkår?: Vilkår[]; resultat: VilkårsResultat }) => {
  if (resultat === VilkårsResultat.JA || !vilkår) {
    return <></>
  }

  return (
    <ul>
      {vilkår
        .filter((v) => {
          const vilkårresultat = v.resultatSaksbehandler ? v.resultatSaksbehandler : v.resultatAuto
          return vilkårresultat === resultat
        })
        .map((v) => (
          <ListeElement key={v.id}>{v.beskrivelse}</ListeElement>
        ))}
    </ul>
  )
}

const ListeElement = styled.li`
  list-style: disc;
`
