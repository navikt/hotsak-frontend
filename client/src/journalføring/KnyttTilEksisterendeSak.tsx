import { Alert, Box, Button, HStack, Radio, RadioGroup, Table } from '@navikt/ds-react'

import { HeadingMedHjelpetekst } from '../felleskomponenter/HeadingMedHjelpetekst'
import { SakstypeEtikett } from '../felleskomponenter/SakstypeEtikett.tsx'
import { Tekst } from '../felleskomponenter/typografi'
import { type SaksoversiktSak } from '../personoversikt/saksoversiktTypes.ts'
import { OppgaveStatusLabel } from '../types/types.internal'
import { formaterDato } from '../utils/dato'

export interface KnyttTilEksisterendeSakProps {
  åpneSaker: SaksoversiktSak[]
  valgtEksisterendeSakId: string
  onChange: (...args: any[]) => any
}

export function KnyttTilEksisterendeSak(props: KnyttTilEksisterendeSakProps) {
  const { åpneSaker, valgtEksisterendeSakId, onChange } = props
  const harÅpneSaker = åpneSaker.length > 0

  const åpneSakerHjelpetekst = harÅpneSaker
    ? ' Det finnes åpne saker på denne personen i Hotsak. Hvis du vil knytte dokummentene til en eksisterende  sak, marker saken du vil knytte dokumentene til.'
    : 'Personen har ingen åpne saker i Hotsak av typen Tilskudd ved kjøp av briller til barn.'

  return (
    <Box paddingBlock="6 0">
      <HStack gap="2">
        <HeadingMedHjelpetekst level="2" hjelpetekst={åpneSakerHjelpetekst} placement="right-end">
          Knytt til eksisterende sak
        </HeadingMedHjelpetekst>
        {harÅpneSaker && (
          <RadioGroup
            legend=""
            size="small"
            hideLegend={true}
            value={valgtEksisterendeSakId}
            onChange={(value: string) => onChange(value)}
          >
            <Table size="small" title="Åpne saker">
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
                {åpneSaker.map((sak) => (
                  <Table.Row key={sak.sakId}>
                    <Table.DataCell style={{ verticalAlign: 'middle', width: '50px' }}>
                      <Radio value={sak.sakId}>{''}</Radio>
                    </Table.DataCell>
                    <Table.DataCell style={{ verticalAlign: 'middle' }}>{sak.sakId}</Table.DataCell>
                    <Table.DataCell style={{ verticalAlign: 'middle' }}>
                      {sak.sakstype && <SakstypeEtikett sakstype={sak.sakstype} />}
                    </Table.DataCell>
                    <Table.DataCell style={{ verticalAlign: 'middle' }}>
                      {OppgaveStatusLabel.get(sak.saksstatus)}
                    </Table.DataCell>
                    <Table.DataCell style={{ verticalAlign: 'middle' }}>
                      {formaterDato(sak.saksstatusGyldigFra)}
                    </Table.DataCell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </RadioGroup>
        )}
        {valgtEksisterendeSakId !== '' && (
          <Alert variant="info" size="small">
            <Tekst>Dokumentene du journalfører vil knyttes til saken du har valgt i liste over.</Tekst>
            <Button variant="tertiary" size="small" onClick={() => onChange('')}>
              Fjern knytning til sak
            </Button>
          </Alert>
        )}
      </HStack>
    </Box>
  )
}
