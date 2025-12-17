import { Link } from '@navikt/ds-react'

import { DataGrid, type DataGridColumn } from '../felleskomponenter/data/DataGrid.tsx'
import { Skjermlesertittel } from '../felleskomponenter/typografi'
import { type HjelpemiddelArtikkel } from '../types/types.internal'

export interface HjelpemiddeloversiktTableProps {
  artikler: HjelpemiddelArtikkel[]
  loading: boolean
}

export function HjelpemiddeloversiktTable({ artikler, loading }: HjelpemiddeloversiktTableProps) {
  return (
    <>
      <Skjermlesertittel level="2">Utlånsoversikt</Skjermlesertittel>
      <DataGrid
        rows={artikler}
        columns={columns}
        keyFactory={(artikkel) => artikkel.hmsnr + artikkel.datoUtsendelse}
        size="small"
        textSize="small"
        emptyMessage="Fant ingen hjelpemidler utlånt til bruker"
        loading={loading}
        zebraStripes
      />
    </>
  )
}

const columns: ReadonlyArray<DataGridColumn<HjelpemiddelArtikkel>> = [
  {
    field: 'datoUtsendelse',
    header: 'Utlånsdato',
    width: 110,
    formatDate: true,
  },
  {
    field: 'grunndataKategoriKortnavn',
    header: 'Kategori',
    width: 200,
  },
  {
    field: 'produkt',
    header: 'Produkt',
    renderCell(row) {
      return row.grunndataProduktNavn || row.beskrivelse
    },
  },
  {
    field: 'antall',
    header: 'Antall',
    width: 90,
    renderCell(row) {
      return `${row.antall} ${row.antallEnhet.toLowerCase()}`
    },
  },
  {
    field: 'hmsnr',
    header: 'HMS-nummer',
    width: 150,
    renderCell(row) {
      return row.hjelpemiddeldatabasenURL ? (
        <Link href={row.hjelpemiddeldatabasenURL} target="_blank">
          {row.hmsnr}
        </Link>
      ) : (
        row.hmsnr
      )
    },
  },
]
