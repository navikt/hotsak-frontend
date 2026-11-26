import { Tag, type TagProps } from '@navikt/ds-react'

import { Journalposttype } from './dokumentTypes'

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

/*
export function journalpoststatusTagKort(type: Journalpost['journalstatus']) {
  const types: Record<typeof type, TagProps> = {
    MOTTATT: { children: 'M', 'data-color': 'neutral', title: 'Mottatt' },
    JOURNALFOERT: { children: 'JF', 'data-color': 'neutral', title: 'Journalført' },
    FERDIGSTILT: { children: 'F', 'data-color': 'neutral', title: 'Ferdigstilt' },
    EKSPEDERT: { children: 'E', 'data-color': 'neutral', title: 'Ekspedert' },
    UNDER_ARBEID: { children: 'UA', 'data-color': 'neutral', title: 'Under arbeid' },
    FEILREGISTRERT: { children: 'FR', 'data-color': 'neutral', title: 'Feilregistrert' },
    UTGAAR: { children: 'U', 'data-color': 'neutral', title: 'Utgår' },
    AVBRUTT: { children: 'A', 'data-color': 'neutral', title: 'Avbrutt' },
    UKJENT_BRUKER: { children: 'UB', 'data-color': 'neutral', title: 'Ukjent bruker' },
    RESERVERT: { children: 'R', 'data-color': 'neutral', title: 'Reservert' },
    OPPLASTING_DOKUMENT: { children: 'OD', 'data-color': 'neutral', title: 'Opplasting dokument' },
    UKJENT: { children: '?', 'data-color': 'neutral', title: 'Ukjent' },
  }
  return <Tag size="small" variant="outline" {...types[type]} />
}
  */
