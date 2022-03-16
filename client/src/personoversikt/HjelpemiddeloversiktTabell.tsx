import React from 'react'
import { Toast } from '../felleskomponenter/Toast'
import styled from 'styled-components/macro'
import { Table } from '@navikt/ds-react'
import { HjelpemiddelArtikkel } from '../types/types.internal'
import { KolonneHeader } from '../felleskomponenter/table/KolonneHeader'
import { IngentingFunnet } from '../oppgaveliste/IngenOppgaver'
import { capitalize } from '../utils/stringFormating'
import { DataCelle, EllipsisCell, ExternalLinkCell, TekstCell } from '../felleskomponenter/table/Celle'
import { formaterDato } from '../utils/date'

const Container = styled.div`
  min-height: 300px;
  height: calc(100% - 50px);
  width: 100%;
`

const ScrollWrapper = styled.div`
  overflow: auto;
`

interface HjelpemiddeloversiktProps {
  artikler: HjelpemiddelArtikkel[]
  henterHjelpemiddeloversikt: boolean
}

export const HjelpemiddeloversiktTabell = ({ artikler, henterHjelpemiddeloversikt }: HjelpemiddeloversiktProps) => {
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
        <EllipsisCell
          value={artikkel.grunndataKategoriKortnavn || ''}
          id={`kategori-${artikkel.beskrivelse}`}
          minLength={18}
        />
      ),
    },
    {
      key: 'PRODUKT',
      name: 'Produkt',
      width: 400,
      render: (artikkel: HjelpemiddelArtikkel) => (
        <EllipsisCell
          value={artikkel.grunndataProduktNavn || artikkel.beskrivelse}
          id={`beskrivelse-${artikkel.beskrivelse}`}
          minLength={25}
        />
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
      {henterHjelpemiddeloversikt ? (
        <Toast>Henter hjelpemiddeloversikt </Toast>
      ) : (
        <Container>
          {hasData ? (
            <ScrollWrapper>
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
                      {kolonner.map(({ render, width, key }, idx) => (
                        <DataCelle key={key} width={width}>
                          {render(artikkel)}
                        </DataCelle>
                      ))}
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </ScrollWrapper>
          ) : (
            <IngentingFunnet>Fant ingen Hjelpemidler utlånt til bruker</IngentingFunnet>
          )}
        </Container>
      )}
    </>
  )
}

export default HjelpemiddeloversiktTabell
