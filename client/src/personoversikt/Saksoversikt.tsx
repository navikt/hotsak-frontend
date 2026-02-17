import { FileIcon } from '@navikt/aksel-icons'
import { Alert, Link } from '@navikt/ds-react'

import { DataGrid, type DataGridColumn } from '../felleskomponenter/data/DataGrid.tsx'
import { Oppgaveetikett } from '../felleskomponenter/Oppgaveetikett'
import { Toast } from '../felleskomponenter/toast/Toast.tsx'
import { Skjermlesertittel } from '../felleskomponenter/typografi'
import { OmrådeFilterLabel, OppgaveStatusLabel, Sakstype } from '../types/types.internal'
import { storForbokstavIOrd } from '../utils/formater.ts'
import {
  erSaksoversiktBarnebrillekrav,
  type SaksoversiktBarnebrillekrav,
  type SaksoversiktSak,
} from './saksoversiktTypes.ts'

export interface SaksoversiktProps {
  sakerOgBarnebrillekrav: Array<SaksoversiktSak | SaksoversiktBarnebrillekrav>
  barnebrillekravHentet?: boolean
  loading: boolean
}

export function Saksoversikt(props: SaksoversiktProps) {
  const { sakerOgBarnebrillekrav, barnebrillekravHentet, loading } = props
  return (
    <>
      <Skjermlesertittel level="2">Saker</Skjermlesertittel>
      {loading ? (
        <Toast>Henter saksoversikt</Toast>
      ) : (
        <>
          {barnebrillekravHentet === false && (
            <Alert size="small" variant="warning" style={{ margin: '0.2rem 0 1rem 0', width: 'fit-content' }}>
              Vi kan for øyeblikket ikke vise barnebrillesaker fra direkteoppgjørsløsningen for optikere.
            </Alert>
          )}
          <div>
            <Alert size="small" variant="info" style={{ margin: '0 0 1rem 0' }} inline>
              Her ser du saker for brukeren i HOTSAK. Vi kan foreløpig ikke vise saker fra Infotrygd.
            </Alert>
          </div>
          <DataGrid
            rows={sakerOgBarnebrillekrav}
            columns={columns}
            keyFactory={keyFactory}
            size="small"
            textSize="small"
            emptyMessage="Fant ingen Hotsak-saker for bruker"
            zebraStripes
          />
        </>
      )}
    </>
  )
}

function keyFactory(row: SaksoversiktSak): string {
  return row.sakId
}

const columns: ReadonlyArray<DataGridColumn<SaksoversiktSak | SaksoversiktBarnebrillekrav>> = [
  {
    field: 'mottattTidspunkt',
    header: 'Mottatt dato',
    width: 150,
    formatDate: true,
  },
  {
    field: 'område',
    header: 'Område',
    renderCell(row) {
      if (erSaksoversiktBarnebrillekrav(row)) {
        return 'Syn'
      }
      return row.område
        .map((it) => OmrådeFilterLabel.get(it))
        .filter((it) => Boolean(it))
        .join(', ')
    },
  },
  {
    field: 'beskrivelse',
    header: 'Beskrivelse',
    renderCell(row) {
      const beskrivelse = row.gjelder.replace('Søknad om:', '').replace('Bestilling av:', '').trim()
      return storForbokstavIOrd(beskrivelse)
    },
  },
  {
    field: 'sakstype',
    header: 'Sakstype',
    renderCell(row) {
      if (erSaksoversiktBarnebrillekrav(row)) {
        return <Oppgaveetikett type={Sakstype.TILSKUDD} showLabel />
      }
      const erBarnebriller = row.sakstype === Sakstype.BARNEBRILLER

      if ((row as SaksoversiktSak).oppgaveId) {
        return (
          <Oppgaveetikett
            type={erBarnebriller ? Sakstype.TILSKUDD : row.sakstype}
            labelLinkTo={`/oppgave/${row.oppgaveId}`}
            showLabel
          />
        )
      }

      return (
        <Oppgaveetikett
          type={erBarnebriller ? Sakstype.TILSKUDD : row.sakstype}
          labelLinkTo={erBarnebriller ? `/sak/${row.sakId}` : `/sak/${row.sakId}/hjelpemidler`}
          showLabel
        />
      )
    },
  },
  {
    field: 'saksstatus',
    header: 'Saksstatus',
    renderCell(row) {
      if (erSaksoversiktBarnebrillekrav(row)) {
        const behandlingsutfall = storForbokstavIOrd(row.behandlingsutfall)
        if (row.journalpostId && row.dokumentId) {
          return (
            <Link href={`/api/journalpost/${row.journalpostId}/${row.dokumentId}`} target={'_blank'}>
              {behandlingsutfall}
              <FileIcon title="Åpne journalpost i nye fane" />
            </Link>
          )
        }
        return behandlingsutfall
      }
      return OppgaveStatusLabel.get(row.saksstatus) || 'Ikke vurdert'
    },
  },
  {
    field: 'behandletAv',
    header: 'Saksbehandler',
  },
  {
    field: 'behandlingsutfallTidspunkt',
    header: 'Behandlet dato',
    width: 130,
    formatDate: true,
  },
  {
    field: 'fagsaksystem',
    header: 'Fagsystem',
    width: 80,
  },
  {
    field: 'sakEllerKravId',
    header: 'Saksnummer',
    width: 80,
    renderCell(row) {
      if (erSaksoversiktBarnebrillekrav(row)) return row.kravId
      return row.sakId
    },
  },
]
