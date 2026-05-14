import { Tag, type TagProps } from '@navikt/ds-react'

import { NotatType } from './notatTyper'

export function NotatTag({ type }: { type: NotatType }) {
  const tagProps: Omit<TagProps, 'children'> = {
    size: 'small',
    variant: type === NotatType.JOURNALFØRT ? 'alt3-filled' : 'neutral-moderate',
  }
  switch (type) {
    case NotatType.KOMMENTAR:
      return <Tag {...tagProps}>Kommentar</Tag>
    case NotatType.INTERNT:
      return <Tag {...tagProps}>Internt arbeidsnotat</Tag>
    case NotatType.JOURNALFØRT:
      return <Tag {...tagProps}>Forvaltningsnotat</Tag>
    default:
      return null
  }
}
