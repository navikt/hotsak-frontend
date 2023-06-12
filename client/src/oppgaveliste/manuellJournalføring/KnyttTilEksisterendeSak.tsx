import { Alert, Button, Radio, RadioGroup, Table } from '@navikt/ds-react'

import { formaterDato } from '../../utils/date'

import { Avstand } from '../../felleskomponenter/Avstand'
import { HeadingMedHjelpetekst } from '../../felleskomponenter/HeadingMedHjelpetekst'
import { Brødtekst } from '../../felleskomponenter/typografi'
import { OppgaveStatusLabel, Saksoversikt_Sak } from '../../types/types.internal'
import { OppgaveType } from '../kolonner/OpgaveType'

interface Props {
  åpneSaker: Saksoversikt_Sak[]
  valgtEksisterendeSakId: string
  onChange: (...args: any[]) => any
}

export const KnyttTilEksisterendeSak: React.FC<Props> = (props) => {
  const { åpneSaker, valgtEksisterendeSakId, onChange } = props
  const harÅpneSaker = åpneSaker.length > 0

  const åpneSakerHjelpetekst = harÅpneSaker
    ? ' Det finnes åpne saker på denne personen i Hotsak. Hvis du vil knytte dokummentene til en eksisterende  sak, marker saken du vil knytte dokumentene til.'
    : 'Personen har ingen åpne saker i Hotsak av typen Tilskudd ved kjøp av briller til barn.'

  return (
    <>
      <HeadingMedHjelpetekst level="2" hjelpetekst={åpneSakerHjelpetekst} placement="right-end">
        Knytt til eksisterende sak
      </HeadingMedHjelpetekst>
      <Avstand paddingBottom={2} />
      {harÅpneSaker && (
        <RadioGroup
          legend=""
          size="small"
          hideLegend={true}
          value={valgtEksisterendeSakId}
          onChange={(value: string) => onChange(value)}
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
              {åpneSaker.map((s) => (
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
      )}
      <Avstand paddingTop={4}>
        {valgtEksisterendeSakId !== '' && (
          <Alert variant="info" size="small">
            <Brødtekst>Dokumentene du journalfører vil knyttes til saken du har valgt i liste over.</Brødtekst>
            <Button variant="tertiary" size="small" onClick={() => onChange('')}>
              Fjern knytning til sak
            </Button>
          </Alert>
        )}
      </Avstand>
    </>
  )
}
