import { Tag, type TagProps } from '@navikt/ds-react'

import { Journalposttype, type Journalstatus } from './dokumentTypes'

export interface JournalstatusTagProps extends Omit<TagProps, 'children'> {
  journalstatus?: Journalstatus
  short?: boolean
}

export function JournalstatusTag(props: JournalstatusTagProps) {
  const { size = 'small', journalstatus, ...rest } = props
  if (!journalstatus) return null
  return <Tag size={size} variant="outline" {...journalstatusTagProps[journalstatus]} {...rest} />
}

const journalstatusTagProps = {
  MOTTATT: { children: 'Mottatt' },
  JOURNALFOERT: { children: 'Journalført' },
  JOURNALFØRT: { children: 'Journalført' },
  FERDIGSTILT: { children: 'Ferdigstilt' },
  EKSPEDERT: { children: 'Ekspedert' },
  UNDER_ARBEID: { children: 'Under arbeid' },
  FEILREGISTRERT: { children: 'Feilregistrert' },
  UTGAAR: { children: 'Utgår' },
  UTGÅR: { children: 'Utgår' },
  AVBRUTT: { children: 'Avbrutt' },
  UKJENT_BRUKER: { children: 'Ukjent bruker' },
  RESERVERT: { children: 'Reservert' },
  OPPLASTING_DOKUMENT: { children: 'Opplasting dokument' },
  UKJENT: { children: 'Ukjent' },
} as const satisfies Record<Journalstatus, TagProps>

export interface JournalposttypeTagProps extends Omit<TagProps, 'children'> {
  journalposttype?: Journalposttype
  short?: boolean
}

export function JournalposttypeTag(props: JournalposttypeTagProps) {
  const { size = 'small', journalposttype, short, ...rest } = props
  if (!journalposttype) return null
  const tagProps: TagProps = {
    ...journalposttypeTagProps[journalposttype],
  }
  if (short) {
    tagProps.children = journalposttypeShort[tagProps.children as string]
  }
  return <Tag size={size} variant="outline" {...tagProps} {...rest} />
}

const journalposttypeTagProps = {
  I: { children: 'Inngående', title: 'Inngående dokument', 'data-color': 'brand-beige' },
  INNGÅENDE: { children: 'Inngående', title: 'Inngående dokument', 'data-color': 'brand-beige' },
  U: { children: 'Utgående', title: 'Utgående dokument', 'data-color': 'meta-lime' },
  UTGÅENDE: { children: 'Utgående', title: 'Utgående dokument', 'data-color': 'meta-lime' },
  N: { children: 'Notat', title: 'Notat', 'data-color': 'info' },
  NOTAT: { children: 'Notat', title: 'Notat', 'data-color': 'info' },
} as const satisfies Record<Journalposttype, TagProps>

const journalposttypeShort: Record<string, string> = {
  Inngående: 'Inng.',
  Utgående: 'Utg.',
  Notat: 'Not.',
}
