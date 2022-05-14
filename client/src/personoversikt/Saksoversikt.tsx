import React from 'react'
import styled from 'styled-components'

import { Table } from '@navikt/ds-react'

import { DataCelle, EllipsisCell, TekstCell } from '../felleskomponenter/table/Celle'
import { KolonneHeader } from '../felleskomponenter/table/KolonneHeader'
import { IngentingFunnet } from '../oppgaveliste/IngenOppgaver'
import { formaterDato } from '../utils/date'
import { capitalize } from '../utils/stringFormating'

import { Oppgaveetikett } from '../felleskomponenter/Oppgaveetikett'
import { Toast } from '../felleskomponenter/Toast'
import { Skjermlesertittel } from '../felleskomponenter/typografi'
import { OppgaveStatusLabel, Oppgavetype, Saksoversikt_Sak } from '../types/types.internal'

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

export const Saksoversikt: React.VFC<SaksoversiktProps> = ({ saker, henterSaker }) => {
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
      width: 100,
      render: (sak: Saksoversikt_Sak) => (
        <div style={{ display: 'flex' }}>
          <Oppgaveetikett
            type={sak.sakstype ? sak.sakstype : Oppgavetype.SØKNAD}
            showLabel={true}
            labelLinkTo={`/sak/${sak.saksid}/hjelpemidler`}
          />
        </div>
      ),
    },
    {
      key: 'STATUS',
      name: 'Status',
      width: 140,
      render: (sak: Saksoversikt_Sak) => <TekstCell value={OppgaveStatusLabel.get(sak.status) || 'Ikke vurdert'} />,
    },
    {
      key: 'VEDTAKSDATO',
      name: 'Vedtaksdato',
      width: 110,
      render: (sak: Saksoversikt_Sak) => <TekstCell value={formaterDato(sak.vedtak?.vedtaksdato)} />,
    },
    {
      key: 'SAKSBEHANDLER',
      name: 'Saksbehandler',
      width: 160,
      render: (sak: Saksoversikt_Sak) => (
        <EllipsisCell value={sak.saksbehandler || ''} id={`tildelt-${sak.saksid}`} minLength={20} />
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
      <Skjermlesertittel level="2">Saker</Skjermlesertittel>
      {henterSaker ? (
        <Toast>Henter saksoversikt</Toast>
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
                  {saker.map((sak) => (
                    <Table.Row key={sak.saksid}>
                      {kolonner.map(({ render, width, key }) => (
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
