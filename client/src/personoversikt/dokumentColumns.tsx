import { Button, Link, Tag, TagProps } from '@navikt/ds-react'
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
    width: 175,
    renderCell: ({ journalposttype }) => journalposttypeTag(journalposttype),
  },
  journalpostOpprettetTid: {
    field: 'journalpostOpprettetTid',
    header: 'Opprettet',
    width: 145,
    formatDateTime: true,
  },
  tittel: {
    field: 'tittel',
    header: 'Tittel',
  },
  dokumenter: {
    field: 'dokumenter',
    header: 'Dokument',
    renderCell: (journalpost) => {
      const førsteDokument = journalpost.dokumenter[0]
      if (!førsteDokument) return null
      return (
        <Link href={`/api/journalpost/${førsteDokument.journalpostId}/${førsteDokument.dokumentId}`} target="_blank">
          {førsteDokument.tittel}
        </Link>
      )
    },
  },
  sakId: {
    field: 'sakId',
    header: 'Sak',
    width: 100,
    renderCell: ({ sakId }) => (sakId ? <Link href={`/sak/${sakId}`}>Åpne sak</Link> : null),
  },
  opprettSak: {
    field: 'opprettSak',
    header: '',
    width: 135,
    renderCell: ({ journalposttype }) =>
      journalposttype === 'I' ? (
        <Button size="small" variant="secondary">
          Opprett sak
        </Button>
      ) : null,
  },
  journalstatus: {
    field: 'journalstatus',
    header: 'Status',
    width: 100,
    renderCell: ({ journalstatus }) => (journalstatus ? <Tag size="small">{journalstatus}</Tag> : null),
  },
} satisfies DokumentColumns

export function journalpostKey(journalpost: Journalpost): string {
  return journalpost.journalpostId
}

export function journalposttypeTag(type: Journalpost['journalposttype']) {
  const config: Record<typeof type, { label: string; color: TagProps['data-color'] }> = {
    I: { label: 'Inngående dokument', color: 'meta-purple' },
    U: { label: 'Utgående dokument', color: 'meta-lime' },
    N: { label: 'Notat', color: 'neutral' },
  }
  const { label, color } = config[type]
  return (
    <Tag size="small" variant="outline" data-color={color}>
      {label}
    </Tag>
  )
}

export function journalposttypeTagKort(type: Journalpost['journalposttype']) {
  const config: Record<typeof type, { label: string; color: TagProps['data-color']; tooltip: string }> = {
    I: { label: 'I', color: 'meta-purple', tooltip: 'Inngående dokument' },
    U: { label: 'U', color: 'meta-lime', tooltip: 'Utgående dokument' },
    N: { label: 'N', color: 'neutral', tooltip: 'Notat' },
  }
  const { label, color, tooltip } = config[type]
  return (
    <Tag size="small" variant="outline" data-color={color} title={tooltip}>
      {label}
    </Tag>
  )
}

export function journalpoststatusTagKort(type: Journalpost['journalstatus']) {
  const config: Record<typeof type, { label: string; color: TagProps['data-color']; tooltip: string }> = {
    MOTTATT: { label: 'M', color: 'neutral', tooltip: 'Mottatt' },
    JOURNALFØRT: { label: 'JF', color: 'neutral', tooltip: 'Journalført' },
    FERDIGSTILT: { label: 'F', color: 'neutral', tooltip: 'Ferdigstilt' },
    EKSPEDERT: { label: 'E', color: 'neutral', tooltip: 'Ekspedert' },
    'UNDER ARBEID': { label: 'UA', color: 'neutral', tooltip: 'Under arbeid' },
    FEILREGISTRERT: { label: 'FR', color: 'neutral', tooltip: 'Feilregistrert' },
    UTGÅR: { label: 'U', color: 'neutral', tooltip: 'Utgår' },
    AVBRUTT: { label: 'A', color: 'neutral', tooltip: 'Avbrutt' },
    'UKJENT BRUKER': { label: 'UB', color: 'neutral', tooltip: 'Ukjent bruker' },
    RESERVERT: { label: 'R', color: 'neutral', tooltip: 'Reservert' },
    'OPPLASTING DOKUMENT': { label: 'OD', color: 'neutral', tooltip: 'Opplasting dokument' },
    UKJENT: { label: '?', color: 'neutral', tooltip: 'Ukjent' },
  }
  const { label, color, tooltip } = config[type]
  return (
    <Tag size="small" variant="outline" data-color={color} title={tooltip}>
      {label}
    </Tag>
  )
}
