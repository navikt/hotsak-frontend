import { FileIcon } from '@navikt/aksel-icons'
import { Alert, Table } from '@navikt/ds-react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { IngentingFunnet } from '../felleskomponenter/IngenOppgaver'
import { Oppgaveetikett } from '../felleskomponenter/Oppgaveetikett'
import { DataCelle, EllipsisCell, TekstCell } from '../felleskomponenter/table/Celle'
import { KolonneHeader } from '../felleskomponenter/table/KolonneHeader'
import { Toast } from '../felleskomponenter/Toast'
import { Brødtekst, Skjermlesertittel } from '../felleskomponenter/typografi'
import {
  OppgaveStatusLabel,
  OppgaveStatusType,
  Saksoversikt_Barnebrille_Sak,
  Saksoversikt_Sak,
  Saksoversikt_Sak_Felles_Type,
  Sakstype,
} from '../types/types.internal'
import { formaterDato, sorterKronologiskStigende } from '../utils/dato'
import { storForbokstavIAlleOrd } from '../utils/formater'

const Container = styled.div`
  min-height: 300px;
  height: calc(100% - 50px);
  width: 100%;
  overflow: auto;
`

interface SaksoversiktProps {
  hotsakSaker: Saksoversikt_Sak[]
  barnebrilleSaker?: Saksoversikt_Barnebrille_Sak[]
  henterSaker: boolean
}

export function Saksoversikt({ hotsakSaker, barnebrilleSaker, henterSaker }: SaksoversiktProps) {
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
        <EllipsisCell value={storForbokstavIAlleOrd(sak.område.join(', '))} minLength={18} />
      ),
    },
    {
      key: 'SØKNAD_OM',
      name: 'Beskrivelse',
      width: 192,
      render: (sak: Saksoversikt_Sak) => (
        <EllipsisCell
          value={storForbokstavIAlleOrd(
            sak.søknadGjelder.replace('Søknad om:', '').replace('Bestilling av:', '').trim()
          )}
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
            type={sak.sakstype ? sak.sakstype : Sakstype.SØKNAD}
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
          <Brødtekst>
            <FileIcon title="a11y-title" fontSize="1.2rem" style={{ marginRight: '0.2rem', marginBottom: '-0.2rem' }} />
            {tittel}
          </Brødtekst>
        )
        return barnebrilleSak && !!barnebrilleSak.journalpostId && !!barnebrilleSak.dokumentId ? (
          <Link to={`/api/journalpost/${barnebrilleSak.journalpostId}/${barnebrilleSak.dokumentId}`} target={'_blank'}>
            {tittelWithIcon}
          </Link>
        ) : (
          <TekstCell value={tittel} />
        )
      },
    },
    {
      key: 'BEHANDLET_DATO',
      name: 'Behandlet dato',
      width: 130,
      render: (sak: Saksoversikt_Sak) => (
        <TekstCell
          value={
            sak.status === OppgaveStatusType.FERDIGSTILT ||
            sak.status === OppgaveStatusType.AVVIST ||
            sak.status === OppgaveStatusType.VEDTAK_FATTET ||
            sak.status === OppgaveStatusType.INNVILGET ||
            sak.status === OppgaveStatusType.HENLAGT
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
      render: (sak: Saksoversikt_Sak) => <EllipsisCell value={sak.saksbehandler || ''} minLength={20} />,
    },
    {
      key: 'FAGSYSTEM',
      name: 'Fagsystem',
      width: 120,
      render: (sak: Saksoversikt_Sak) => <TekstCell value={sak.fagsystem} />,
    },
    { key: 'SAKSID', name: 'Saksid', width: 100, render: (sak: Saksoversikt_Sak) => <TekstCell value={sak.sakId} /> },
  ]

  const saker: Saksoversikt_Sak_Felles_Type[] =
    hotsakSaker
      .map((a): Saksoversikt_Sak_Felles_Type => ({ sak: a, barnebrilleSak: undefined }))
      .concat(barnebrilleSaker?.map((a): Saksoversikt_Sak_Felles_Type => ({ sak: a.sak, barnebrilleSak: a })) || [])
      .sort((a, b) => sorterKronologiskStigende(a.sak.mottattDato, b.sak.mottattDato)) || []

  const hasData = saker && saker.length > 0

  return (
    <>
      <Skjermlesertittel level="2">Saker</Skjermlesertittel>
      {henterSaker ? (
        <Toast>Henter saksoversikt</Toast>
      ) : (
        <Container>
          {!barnebrilleSaker && (
            <Alert size="small" variant="warning" style={{ margin: '0.2rem 0 1rem 0', width: 'fit-content' }}>
              Vi kan for øyeblikket ikke vise barnebrillesaker fra direkteoppgjørsløsningen for optikere.
            </Alert>
          )}
          <div>
            <Alert size="small" variant="info" inline={true} style={{ margin: '0 0 1rem 0' }}>
              Her ser du saker for brukeren i HOTSAK. Vi kan foreløpig ikke vise saker fra Infotrygd.
            </Alert>
          </div>
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
            </>
          ) : (
            <IngentingFunnet>Fant ingen HOTSAK saker på bruker</IngentingFunnet>
          )}
        </Container>
      )}
    </>
  )
}
