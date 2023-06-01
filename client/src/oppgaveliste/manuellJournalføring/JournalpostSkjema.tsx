import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import styled from 'styled-components'

import { Applicant } from '@navikt/ds-icons'
import { Alert, Button, ExpansionCard, Heading, Radio, RadioGroup, Table, TextField } from '@navikt/ds-react'

import { postJournalføring } from '../../io/http'
import { formaterDato } from '../../utils/date'

import { Avstand } from '../../felleskomponenter/Avstand'
import { Knappepanel } from '../../felleskomponenter/Button'
import { Kolonner } from '../../felleskomponenter/Kolonner'
import { Toast } from '../../felleskomponenter/Toast'
import { IconContainer } from '../../felleskomponenter/ikoner/Ikon'
import { Brødtekst } from '../../felleskomponenter/typografi'
import { usePersonContext } from '../../personoversikt/PersonContext'
import { usePersonInfo } from '../../personoversikt/personInfoHook'
import { useSaksoversikt } from '../../personoversikt/saksoversiktHook'
import { formaterNavn } from '../../saksbilde/Personlinje'
import { BehandlingstatusType, JournalføringRequest, OppgaveStatusLabel, Oppgavetype } from '../../types/types.internal'
import { useDokument } from '../dokumenter/dokumentHook'
import { OppgaveType } from '../kolonner/OpgaveType'
import { Dokumenter } from './Dokumenter'

const Container = styled.div`
  overflow: auto;
  border-right: 1px solid var(--a-border-default);
  padding-top: var(--a-spacing-6);
  padding-right: var(--a-spacing-4);
`
export const JournalpostSkjema: React.FC = () => {
  const navigate = useNavigate()
  const { journalpostID } = useParams<{ journalpostID: string }>()
  const { journalpost, /*isError,*/ isLoading } = useDokument(journalpostID)
  const { fodselsnummer, setFodselsnummer } = usePersonContext()
  const [valgtEksisterendeSakId, setValgtEksisterendeSakId] = useState('')
  const [journalføresPåFnr, setJournalføresPåFnr] = useState('')
  const { isLoading: henterPerson, personInfo } = usePersonInfo(fodselsnummer)
  const {
    saksoversikt,
    isLoading: henterSaker,
    isError,
  } = useSaksoversikt(fodselsnummer, Oppgavetype.BARNEBRILLER, BehandlingstatusType.ÅPEN)
  const [journalpostTittel, setJournalpostTittel] = useState(journalpost?.tittel || '')
  // const [error, setError] = useState('')
  const [journalfører, setJournalfører] = useState(false)

  const journalfør = () => {
    const journalføringRequest: JournalføringRequest = {
      journalpostID: journalpost!.journalpostID,
      tittel: journalpostTittel,
      journalføresPåFnr: fodselsnummer,
      sakId: valgtEksisterendeSakId !== '' ? valgtEksisterendeSakId : undefined,
    }
    setJournalfører(true)
    postJournalføring(journalføringRequest)
      .then((opprettetSakResponse: any) => {
        const opprettetSakID = opprettetSakResponse.data.sakId

        if (!opprettetSakID) {
          throw new Error('Klarte ikke å opprette sak')
        }

        navigate(`/sak/${opprettetSakID}`)
      })
      .catch(() => setJournalfører(false))
  }

  if (henterPerson || !personInfo || isLoading || !journalpost) {
    return (
      <Container>
        <Toast>Henter journalpost</Toast>
      </Container>
    )
  }

  return (
    <Container>
      <Heading level="1" size="small" spacing>
        Journalføring
      </Heading>
      <form>
        <Heading size="small" level="2" spacing>
          Bruker
        </Heading>
        <Avstand marginRight={3} paddingLeft={1}>
          <ExpansionCard size="small" aria-label="Bruker det skal journalføres på">
            <ExpansionCard.Header>
              <ExpansionCard.Title as="h3" size="small">
                <IconContainer>
                  <Applicant />
                </IconContainer>
                {`${formaterNavn(personInfo)} | ${personInfo?.fnr}`}
              </ExpansionCard.Title>
            </ExpansionCard.Header>
            <ExpansionCard.Content>
              <Kolonner>
                <TextField
                  label="Endre bruker"
                  description="Skriv inn fødselsnummer eller D-nummer"
                  size="small"
                  value={journalføresPåFnr}
                  onChange={(e) => setJournalføresPåFnr(e.target.value)}
                />
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => {
                    setFodselsnummer(journalføresPåFnr)
                  }}
                  disabled={henterPerson}
                  loading={henterPerson}
                >
                  Endre bruker
                </Button>
              </Kolonner>
            </ExpansionCard.Content>
          </ExpansionCard>
        </Avstand>
        <Avstand paddingTop={8} marginRight={3} marginLeft={2}>
          <Heading size="small" level="2" spacing>
            Journalpost
          </Heading>
          <TextField
            label="Dokumentittel"
            description="Tittelen blir synlig i fagsystemer og for bruker"
            size="small"
            value={journalpostTittel}
            onChange={(e) => setJournalpostTittel(e.target.value)}
          />
        </Avstand>
        <Dokumenter journalpostID={journalpostID} />
        <Avstand paddingTop={10}>
          <Heading size="small" level="2" spacing>
            Knytt til eksisterende sak
          </Heading>
          <Avstand paddingTop={4} paddingBottom={4}>
            {saksoversikt?.hotsakSaker && saksoversikt?.hotsakSaker.length > 0 && (
              <Alert variant="info" size="small">
                <Brødtekst>
                  Det finnes åpne saker på denne personen i Hotsak. Hvis du vil knytte dokummentene til en eksisterende
                  sak, marker saken du vil knytte dokumentene til.
                </Brødtekst>
              </Alert>
            )}
          </Avstand>
          <RadioGroup
            legend=""
            size="small"
            hideLegend={true}
            value={valgtEksisterendeSakId}
            onChange={(value: string) => setValgtEksisterendeSakId(value)}
          >
            <Table size="small">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell scope="col" />
                  <Table.HeaderCell scope="col">Saksid</Table.HeaderCell>
                  <Table.HeaderCell scope="col">Sakstype</Table.HeaderCell>
                  <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                  <Table.HeaderCell scope="col">Sist endret</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {saksoversikt?.hotsakSaker.map((s) => (
                  <Table.Row key={s.sakId}>
                    <Table.DataCell style={{ verticalAlign: 'middle', width: '50px' }}>
                      <Radio value={s.sakId}>{''}</Radio>
                    </Table.DataCell>
                    <Table.DataCell style={{ verticalAlign: 'middle' }}>{s.sakId}</Table.DataCell>
                    <Table.DataCell style={{ verticalAlign: 'middle' }}>
                      {s.sakstype && <OppgaveType oppgaveType={s.sakstype} />}
                    </Table.DataCell>
                    <Table.DataCell style={{ verticalAlign: 'middle' }}>
                      {OppgaveStatusLabel.get(s.status)}
                    </Table.DataCell>
                    <Table.DataCell style={{ verticalAlign: 'middle' }}>
                      {formaterDato(s.statusEndretDato)}
                    </Table.DataCell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </RadioGroup>
        </Avstand>
        <Avstand paddingTop={4}>
          {valgtEksisterendeSakId !== '' && (
            <Alert variant="info" size="small">
              <Brødtekst>Dokumentene du journalfører vil knyttes til saken du har valgt i liste over.</Brødtekst>
              <Button variant="tertiary" size="small" onClick={() => setValgtEksisterendeSakId('')}>
                Fjern knytning til sak
              </Button>
            </Alert>
          )}
        </Avstand>
        <Avstand paddingLeft={2}>
          <Knappepanel>
            <Button
              type="submit"
              variant="primary"
              size="small"
              onClick={(e) => {
                e.preventDefault()
                journalfør()
              }}
              data-cy="btn-journalfør"
              disabled={journalfører}
              loading={journalfører}
            >
              {valgtEksisterendeSakId !== '' ? 'Journalfør og knytt til sak' : 'Journalfør og opprett sak'}
            </Button>
          </Knappepanel>
        </Avstand>
      </form>
    </Container>
  )
}
