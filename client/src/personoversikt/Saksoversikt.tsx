import React from 'react'
import { Toast } from '../felleskomponenter/Toast'
import styled from 'styled-components/macro'
import { Table } from '@navikt/ds-react'
import { OppgaveStatusLabel, Saksoversikt_Sak } from '../types/types.internal'
import { KolonneHeader } from '../felleskomponenter/table/KolonneHeader'
import { IngentingFunnet } from '../oppgaveliste/IngenOppgaver'
import { capitalize } from '../utils/stringFormating'
import { DataCelle, EllipsisCell, LinkCell, TekstCell } from '../felleskomponenter/table/Celle'
import { formaterDato } from '../utils/date'

const Container = styled.div`
  min-height: 300px;
  height: calc(100% - 50px);
  width: 100%;
`

const ScrollWrapper = styled.div`
  overflow: auto;
`

interface SaksoversiktProps {
  saker: Saksoversikt_Sak[]
  henterSaker: boolean
}

export const Saksoversikt = ({ saker, henterSaker }: SaksoversiktProps) => {
  const kolonner = [
    {
      key: 'MOTTATT',
      name: 'Mottatt dato',
      width: 110,
      render: (sak: Saksoversikt_Sak) => <TekstCell value={formaterDato(sak.mottattDato)} />,
    },
    {
      key: 'OMRÅDE',
      name: 'Område',
      width: 152,
      render: (sak: Saksoversikt_Sak) => (
        <EllipsisCell
          value={capitalize(sak.område.join(', '))}
          id={`funksjonsnedsettelse-${sak.saksid}`}
          minLength={18}
        />
      ),
    },
    {
      key: 'SØKNAD_OM',
      name: 'Kategori',
      width: 192,
      render: (sak: Saksoversikt_Sak) => (
        <EllipsisCell
          value={capitalize(sak.søknadGjelder.replace('Søknad om:', '').trim())}
          id={`kategori-${sak.saksid}`}
          minLength={20}
        />
      ),
    },
    {
        key: 'SAKSTYPE',
        name: 'Sakstype',
        width: 80,
        render: (sak: Saksoversikt_Sak) => (
          <LinkCell
          to={`/sak/${sak.saksid}`}
            value="Søknad"
            id={`sakstype-${sak.saksid}`}
            minLength={20}
          />
        ),
      },
      {
        key: 'STATUS',
        name: 'Status',
        width: 140,
        render: (sak: Saksoversikt_Sak) => (
          <TekstCell value={OppgaveStatusLabel.get(sak.status) || 'Ikke vurdert'} />
        ),
      },
    
    {
      key: 'VEDTAKSDATO',
      name: 'Vedtaksdato',
      width: 110,
      render: (sak: Saksoversikt_Sak) => <TekstCell value={formaterDato(sak.vedtak?.vedtaksDato)} />,
    },
    {
      key: 'SAKSBEHANDLER',   
      name: 'Saksbehandler',
      width: 152,
      render: (sak: Saksoversikt_Sak) => (
        <EllipsisCell value={sak.vedtak?.saksbehandlerNavn || ''} id={`tildelt-${sak.saksid}`} minLength={15} />
      ),
    },
    {
      key: 'FAGSYSTEM',
      name: 'Fagsystem',
      width: 120,
      render: (sak: Saksoversikt_Sak) => <TekstCell value={sak.fagsystem} />,
    },
    { key: 'SAKSID', name: 'Saksid', width: 100, render: (sak: Saksoversikt_Sak) => <TekstCell value={sak.saksid} /> },
  ]

  const hasData = saker && saker.length > 0

  return (
    <>
      {henterSaker ? (
        <Toast>Henter saksoversikt </Toast>
      ) : (
        <Container>
          {hasData ? (
            <ScrollWrapper>
              <Table style={{ width: 'initial' }} zebraStripes size="small">
                <Table.Header>
                  <Table.Row>
                    {kolonner.map(({ key, name, width }, idx) => (
                      <KolonneHeader key={key} sortable={false} sortKey={key} width={width}>
                        {name}
                      </KolonneHeader>
                    ))}
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {saker.map((sak) => (
                    <Table.Row key={sak.saksid}>
                      {kolonner.map(({ render, width, key }, idx) => (
                        <DataCelle key={key} width={width}>
                          {render(sak)}
                        </DataCelle>
                      ))}
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </ScrollWrapper>
          ) : (
            <IngentingFunnet>Fant ingen HOTSAK saker på bruker</IngentingFunnet>
          )}
        </Container>
      )}
    </>
  )
}

export default Saksoversikt
