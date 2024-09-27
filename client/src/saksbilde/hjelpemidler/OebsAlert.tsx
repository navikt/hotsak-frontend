import { List } from '@navikt/ds-react'
import { SystemAlert } from '../../felleskomponenter/SystemAlert.tsx'
import { Artikkel } from '../../types/types.internal.ts'

export function OebsAlert(props: { artikler: Artikkel[] }) {
  const { artikler } = props

  return (
    <SystemAlert>
      <List
        as="ul"
        size="small"
        title={`${artikler.length > 1 ? 'Artiklene' : 'Artikkelen'} under finnes ikke i OEBS og blir derfor ikke 
            automatisk overført til SF:`}
      >
        {artikler.map((artikkel) => {
          return <List.Item key={artikkel.hmsnr}>{`${artikkel.hmsnr}: ${artikkel.navn}`}</List.Item>
        })}
      </List>
    </SystemAlert>
  )
}
