import { Link, Tag, TagProps } from '@navikt/ds-react'
import { Link as ReactRouterLink } from 'react-router'

import { DataGridColumn } from '../felleskomponenter/data/DataGrid'
import { Journalpost } from '../types/types.internal'

type DokumentColumns = {
  [K in string]: DataGridColumn<Journalpost> & { field: K }
}

export const dokumentColumns = {
  journalpostId: {
    field: 'journalpostId',
    header: 'Journalpost-ID',
    width: 110,
  },
  journalposttype: {
    field: 'journalposttype',
    header: 'Type',
    width: 100,
    filter: {
      options: new Map([
        ['I', 'Inngående'],
        ['U', 'Utgående'],
        ['N', 'Notat'],
      ]),
    },
    renderCell({ journalposttype }) {
      return journalposttypeTag(journalposttype)
    },
  },
  journalpostOpprettetTid: {
    field: 'journalpostOpprettetTid',
    header: 'Opprettet',
    width: 145,
    formatDateTime: true,
  },
  fagsakId: {
    field: 'fagsakId',
    header: 'Saksnr.',
    width: 100,
    renderCell({ sak, sakId }) {
      if (sakId) return sakId
      if (sak) return sak.fagsakId
      return null
    },
  },
  sakIdLink: {
    field: 'sakIdLink',
    width: 100,
    renderCell({ sak, sakId }) {
      if (sakId)
        return (
          <Link as={ReactRouterLink} to={`/sak/${sakId}`}>
            Gå til saken
          </Link>
        )
      if (sak) return sak.fagsakId
      return null
    },
  },
  tittel: {
    field: 'tittel',
    header: 'Tittel',
    width: 180,
    renderCell(journalpost) {
      const førsteDokument = journalpost.dokumenter[0]
      if (!førsteDokument) return null
      return (
        <Link href={`/api/journalpost/${førsteDokument.journalpostId}/${førsteDokument.dokumentId}`} target="_blank">
          {journalpost.tittel}
        </Link>
      )
    },
  },
  journalstatus: {
    field: 'journalstatus',
    header: 'Status',
    width: 100,
    renderCell({ journalstatus }) {
      return journalstatus ? <Tag size="small">{journalstatus}</Tag> : null
    },
  },
} satisfies DokumentColumns

export type DokumentColumnField = keyof typeof dokumentColumns

export function journalpostKey(journalpost: Journalpost): string {
  return journalpost.journalpostId
}

export function journalposttypeTag(type: Journalpost['journalposttype']) {
  const config: Record<typeof type, { label: string; color: TagProps['data-color'] }> = {
    I: { label: 'Inngående', color: 'brand-beige' },
    U: { label: 'Utgående', color: 'meta-lime' },
    N: { label: 'Notat', color: 'info' },
  }
  const { label, color } = config[type]
  return (
    <Tag size="small" variant="outline" data-color={color}>
      {label}
    </Tag>
  )
}

export function journalposttypeTagKort(type: Journalpost['journalposttype']) {
  const config: Record<typeof type, { label: string }> = {
    I: { label: 'Inngående' },
    U: { label: 'Utgående' },
    N: { label: 'Notat' },
  }
  const { label } = config[type]
  return (
    <Tag size="small" variant="outline">
      {label}
    </Tag>
  )
}

export function journalposttypeTagKortere(type: Journalpost['journalposttype']) {
  const config: Record<typeof type, { label: string; tooltip: string }> = {
    I: { label: 'I', tooltip: 'Inngående dokument' },
    U: { label: 'U', tooltip: 'Utgående dokument' },
    N: { label: 'N', tooltip: 'Notat' },
  }
  const { label, tooltip } = config[type]
  return (
    <Tag size="small" variant="outline" title={tooltip}>
      {label}
    </Tag>
  )
}

export function journalpoststatusTagKort(type: Journalpost['journalstatus']) {
  const config: Record<typeof type, { label: string; color: TagProps['data-color']; tooltip: string }> = {
    MOTTATT: { label: 'M', color: 'neutral', tooltip: 'Mottatt' },
    JOURNALFOERT: { label: 'JF', color: 'neutral', tooltip: 'Journalført' },
    FERDIGSTILT: { label: 'F', color: 'neutral', tooltip: 'Ferdigstilt' },
    EKSPEDERT: { label: 'E', color: 'neutral', tooltip: 'Ekspedert' },
    UNDER_ARBEID: { label: 'UA', color: 'neutral', tooltip: 'Under arbeid' },
    FEILREGISTRERT: { label: 'FR', color: 'neutral', tooltip: 'Feilregistrert' },
    UTGAAR: { label: 'U', color: 'neutral', tooltip: 'Utgår' },
    AVBRUTT: { label: 'A', color: 'neutral', tooltip: 'Avbrutt' },
    UKJENT_BRUKER: { label: 'UB', color: 'neutral', tooltip: 'Ukjent bruker' },
    RESERVERT: { label: 'R', color: 'neutral', tooltip: 'Reservert' },
    OPPLASTING_DOKUMENT: { label: 'OD', color: 'neutral', tooltip: 'Opplasting dokument' },
    UKJENT: { label: '?', color: 'neutral', tooltip: 'Ukjent' },
  }
  const { label, color, tooltip } = config[type]
  return (
    <Tag size="small" variant="outline" data-color={color} title={tooltip}>
      {label}
    </Tag>
  )
}
