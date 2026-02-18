import { Fragment } from 'react'
import { HelpText, HGrid } from '@navikt/ds-react'
import { Etikett } from '../../../../felleskomponenter/typografi'
import { AlternativeProduct } from '../../useAlternativeProdukter'

type WareHouseStock = NonNullable<NonNullable<AlternativeProduct['wareHouseStock']>[number]>

export function LagerstatusUtregning(props: { lagerstatus: WareHouseStock }) {
  const { lagerstatus } = props

  const utregninger: Array<{ operator: string; label: string; key: keyof WareHouseStock }> = [
    { operator: '', label: 'Fysisk', key: 'physical' },
    { operator: '+', label: 'Bestilt', key: 'orders' },
    { operator: '+', label: 'Anmodet eksternt', key: 'request' },
    { operator: '+', label: 'Anmodet internt', key: 'intRequest' },
    { operator: '-', label: 'Behovsmeldt', key: 'needNotified' },
    { operator: '-', label: 'Reservert', key: 'reserved' },
    { operator: '-', label: 'Restordre', key: 'backOrders' },
  ]

  return (
    <HelpText title="Forklaring på utregning av lagerstatus">
      <Etikett>Lagerstatus er regnet ut slik:</Etikett>
      <HGrid columns="auto auto 1fr" gap="space-0 space-8" paddingBlock={'space-12 space-0'}>
        {utregninger.map(({ operator, label, key }) => {
          return (
            <Fragment key={key}>
              <div>{operator}</div>
              <div>{label}</div>
              <div style={{ justifySelf: 'end' }}>{lagerstatus[key]}</div>
            </Fragment>
          )
        })}
      </HGrid>
      <HGrid
        columns="auto auto 1fr"
        gap="space-0 space-8"
        style={{
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'var(--ax-border-subtle)',
          borderBottomStyle: 'double',
          borderBottomColor: 'var(--ax-border-subtle)',
        }}
      >
        <div>
          <Etikett>=</Etikett>
        </div>
        <div>
          <Etikett>På lager</Etikett>
        </div>
        <div style={{ justifySelf: 'end' }}>
          <Etikett>{lagerstatus.amountInStock}</Etikett>
        </div>
      </HGrid>
    </HelpText>
  )
}
