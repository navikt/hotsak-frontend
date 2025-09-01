import { Table } from '@navikt/ds-react'
import styled from 'styled-components'

import { IngentingFunnet } from '../felleskomponenter/IngentingFunnet.tsx'
import { DataCelle, EllipsisCell, ExternalLinkCell, TekstCell } from '../felleskomponenter/table/Celle'
import { KolonneHeader } from '../felleskomponenter/table/KolonneHeader'
import { Toast } from '../felleskomponenter/toast/Toast.tsx'
import { Skjermlesertittel } from '../felleskomponenter/typografi'
import { HjelpemiddelArtikkel } from '../types/types.internal'
import { formaterDato } from '../utils/dato'

const Container = styled.div`
  min-height: 300px;
  height: calc(100% - 50px);
  width: 100%;
  overflow: auto;
`

interface HjelpemiddeloversiktTabellProps {
  artikler: HjelpemiddelArtikkel[]
  henterHjelpemiddeloversikt: boolean
}

export function HjelpemiddeloversiktTabell({ artikler, henterHjelpemiddeloversikt }: HjelpemiddeloversiktTabellProps) {
  const kolonner = [
    {
      key: 'UTLÅNSDATO',
      name: 'Utlånsdato',
      width: 110,
      render: (artikkel: HjelpemiddelArtikkel) => <TekstCell value={formaterDato(artikkel.datoUtsendelse)} />,
    },
    {
      key: 'KATEGORI',
      name: 'Kategori',
      width: 152,
      render: (artikkel: HjelpemiddelArtikkel) => (
        <EllipsisCell value={artikkel.grunndataKategoriKortnavn || ''} minLength={18} />
      ),
    },
    {
      key: 'PRODUKT',
      name: 'Produkt',
      width: 400,
      render: (artikkel: HjelpemiddelArtikkel) => (
        <EllipsisCell value={artikkel.grunndataProduktNavn || artikkel.beskrivelse} minLength={25} />
      ),
    },
    {
      key: 'ANTALL',
      name: 'Antall',
      width: 90,
      render: (artikkel: HjelpemiddelArtikkel) => (
        <TekstCell value={`${artikkel.antall} ${artikkel.antallEnhet.toLowerCase()}`} />
      ),
    },
    {
      key: 'HMSNR',
      name: 'Hmsnr.',
      width: 80,
      render: (artikkel: HjelpemiddelArtikkel) => (
        <ExternalLinkCell to={artikkel.hjelpemiddeldatabasenURL} target="_blank" value={artikkel.hmsnr} />
      ),
    },
  ]

  const hasData = artikler && artikler.length > 0

  return (
    <>
      <Skjermlesertittel level="2">Utlånsoversikt</Skjermlesertittel>
      {henterHjelpemiddeloversikt ? (
        <Toast>Henter utlånsoversikt</Toast>
      ) : (
        <Container>
          {hasData ? (
            <>
              <Table style={{ width: 'initial' }} zebraStripes size="small">
                <Table.Header>
                  <Table.Row>
                    {kolonner.map(({ key, name, width }) => (
                      <KolonneHeader key={key} sortable={false} sortKey={key} width={width}>
                        {name}
                      </KolonneHeader>
                    ))}
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {artikler.map((artikkel) => (
                    <Table.Row key={`${artikkel.hmsnr}${artikkel.datoUtsendelse}`}>
                      {kolonner.map(({ render, width, key }) => (
                        <DataCelle key={key} width={width}>
                          {render(artikkel)}
                        </DataCelle>
                      ))}
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </>
          ) : (
            <IngentingFunnet>Fant ingen hjelpemidler utlånt til bruker</IngentingFunnet>
          )}
        </Container>
      )}
    </>
  )
}
