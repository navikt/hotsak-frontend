import { Tag } from '@navikt/ds-react'

export function MappeTag({ mappenavn }: { mappenavn: string }) {
  return (
    <Tag size="small" variant="alt1">
      {mappenavn}
    </Tag>
  )
}
