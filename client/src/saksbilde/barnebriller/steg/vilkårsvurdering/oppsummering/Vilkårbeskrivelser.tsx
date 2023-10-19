import styled from 'styled-components'

import { Avstand } from '../../../../../felleskomponenter/Avstand'
import { Vilkår, VilkårsResultat } from '../../../../../types/types.internal'

export const Vilkårbeskrivelser = ({ vilkår, resultat }: { vilkår?: Vilkår[]; resultat: VilkårsResultat }) => {
  if (resultat === VilkårsResultat.JA || !vilkår) {
    return <></>
  }

  return (
    <Avstand paddingTop={3}>
      <ul>
        {vilkår
          .filter((v) => {
            return v.vilkårOppfylt === resultat || v.vilkårOppfylt === VilkårsResultat.DOKUMENTASJON_MANGLER
          })
          .map((v) => (
            <ListeElement key={v.id}>{v.beskrivelse}</ListeElement>
          ))}
      </ul>
    </Avstand>
  )
}

const ListeElement = styled.li`
  list-style: disc;
`
