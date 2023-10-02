import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { FileIcon } from '@navikt/aksel-icons'
import { Table } from '@navikt/ds-react'

import { DataCelle, EllipsisCell, TekstCell } from '../felleskomponenter/table/Celle'
import { KolonneHeader } from '../felleskomponenter/table/KolonneHeader'
import { formaterDato, sorterKronologisk } from '../utils/date'
import { capitalize } from '../utils/stringFormating'

import { IngentingFunnet } from '../felleskomponenter/IngenOppgaver'
import { Oppgaveetikett } from '../felleskomponenter/Oppgaveetikett'
import { Toast } from '../felleskomponenter/Toast'
import { Skjermlesertittel } from '../felleskomponenter/typografi'
import ByggDummyDataUrl from '../mocks/mockDokument'
import {
  OppgaveStatusLabel,
  OppgaveStatusType,
  Oppgavetype,
  Saksoversikt_Barnebrille_Sak,
  Saksoversikt_Sak,
  Saksoversikt_Sak_Felles_Type,
} from '../types/types.internal'

const erLokaltEllerLabs = window.appSettings.USE_MSW === true

const Container = styled.div`
  min-height: 300px;
  height: calc(100% - 50px);
  width: 100%;
`

const ScrollWrapper = styled.div`
  overflow: auto;
`

interface SaksoversiktProps {
  hotsakSaker: Saksoversikt_Sak[]
  barnebrilleSaker: Saksoversikt_Barnebrille_Sak[]
  henterSaker: boolean
}

export const Saksoversikt: React.FC<SaksoversiktProps> = ({ hotsakSaker, barnebrilleSaker, henterSaker }) => {
  const kolonner = [
    {
      key: 'MOTTATT',
      name: 'Mottatt dato',
      width: 110,
      render: (sak: Saksoversikt_Sak, barnebrilleSak?: Saksoversikt_Barnebrille_Sak) => (
        <TekstCell value={formaterDato(sak.mottattDato)} />
      ),
    },
    {
      key: 'OMRÅDE',
      name: 'Område',
      width: 152,
      render: (sak: Saksoversikt_Sak, barnebrilleSak?: Saksoversikt_Barnebrille_Sak) => (
        <EllipsisCell
          value={capitalize(sak.område.join(', '))}
          id={`funksjonsnedsettelse-${sak.sakId}`}
          minLength={18}
        />
      ),
    },
    {
      key: 'SØKNAD_OM',
      name: 'Beskrivelse',
      width: 192,
      render: (sak: Saksoversikt_Sak, barnebrilleSak?: Saksoversikt_Barnebrille_Sak) => (
        <EllipsisCell
          value={capitalize(sak.søknadGjelder.replace('Søknad om:', '').replace('Bestilling av:', '').trim())}
          id={`kategori-${sak.sakId}`}
          minLength={20}
        />
      ),
    },
    {
      key: 'SAKSTYPE',
      name: 'Sakstype',
      width: 100,
      render: (sak: Saksoversikt_Sak, barnebrilleSak?: Saksoversikt_Barnebrille_Sak) => (
        <div style={{ display: 'flex' }}>
          <Oppgaveetikett
            type={sak.sakstype ? sak.sakstype : Oppgavetype.SØKNAD}
            showLabel={true}
            labelLinkTo={barnebrilleSak ? undefined : `/sak/${sak.sakId}/hjelpemidler`}
          />
        </div>
      ),
    },
    {
      key: 'STATUS',
      name: 'Status',
      width: 140,
      render: (sak: Saksoversikt_Sak, barnebrilleSak?: Saksoversikt_Barnebrille_Sak) => {
        const tittel = OppgaveStatusLabel.get(sak.status) || 'Ikke vurdert'
        const tittelWithIcon = (
          <>
            <FileIcon title="a11y-title" fontSize="1rem" style={{ marginRight: '0.2rem' }} />
            {tittel}
          </>
        )
        return barnebrilleSak && !!barnebrilleSak.journalpostId && !!barnebrilleSak.dokumentId ? (
          erLokaltEllerLabs ? (
            <ByggDummyDataUrl tittel={tittelWithIcon} type={'barnebrilleSak'} />
          ) : (
            <Link
              to={`/api/journalpost/${barnebrilleSak.journalpostId}/${barnebrilleSak.dokumentId}`}
              target={'_blank'}
            >
              {tittelWithIcon}
            </Link>
          )
        ) : (
          <TekstCell value={tittel} />
        )
      },
    },
    {
      key: 'BEHANDLET_DATO',
      name: 'Behandlet dato',
      width: 130,
      render: (sak: Saksoversikt_Sak, barnebrilleSak?: Saksoversikt_Barnebrille_Sak) => (
        <TekstCell
          value={
            sak.status === OppgaveStatusType.FERDIGSTILT ||
            sak.status === OppgaveStatusType.AVVIST ||
            sak.status === OppgaveStatusType.VEDTAK_FATTET ||
            sak.status === OppgaveStatusType.INNVILGET
              ? formaterDato(sak.statusEndretDato)
              : ''
          }
        />
      ),
    },
    {
      key: 'SAKSBEHANDLER',
      name: 'Saksbehandler',
      width: 170,
      render: (sak: Saksoversikt_Sak, barnebrilleSak?: Saksoversikt_Barnebrille_Sak) => (
        <EllipsisCell value={sak.saksbehandler || ''} id={`tildelt-${sak.sakId}`} minLength={20} />
      ),
    },
    {
      key: 'FAGSYSTEM',
      name: 'Fagsystem',
      width: 120,
      render: (sak: Saksoversikt_Sak, barnebrilleSak?: Saksoversikt_Barnebrille_Sak) => (
        <TekstCell value={sak.fagsystem} />
      ),
    },
    { key: 'SAKSID', name: 'Saksid', width: 100, render: (sak: Saksoversikt_Sak) => <TekstCell value={sak.sakId} /> },
  ]

  const saker: Saksoversikt_Sak_Felles_Type[] =
    hotsakSaker
      .map((a): Saksoversikt_Sak_Felles_Type => ({ sak: a, barnebrilleSak: undefined }))
      .concat(barnebrilleSaker.map((a): Saksoversikt_Sak_Felles_Type => ({ sak: a.sak, barnebrilleSak: a })))
      .sort((a, b) => sorterKronologisk(a.sak.mottattDato, b.sak.mottattDato)) || []

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
                  {saker.map((sak) => {
                    return (
                      <Table.Row key={sak.sak.sakId}>
                        {kolonner.map(({ render, width, key }) => (
                          <DataCelle key={key} width={width}>
                            {render(sak.sak, sak.barnebrilleSak)}
                          </DataCelle>
                        ))}
                      </Table.Row>
                    )
                  })}
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
