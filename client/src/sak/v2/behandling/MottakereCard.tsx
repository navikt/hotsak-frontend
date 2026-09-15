import { PadlockLockedIcon, TrashIcon } from '@navikt/aksel-icons'
import { Box, Button, HStack, Table, Tooltip, VStack } from '@navikt/ds-react'
import { useBrevmottakere } from '../../../brev/useBrev.ts'
import { CompactExpandableCard } from '../../../felleskomponenter/panel/CompactExpandableCard'
import { Tekst } from '../../../felleskomponenter/typografi'
import { usePerson } from '../../../personoversikt/usePerson.ts'
import { beregnAlder } from '../../../utils/dato.ts'
import { formaterNavn } from '../../../utils/formater.ts'

export function MottakereCard({ vedtaksbrevId }: { vedtaksbrevId?: string }) {
  const { data, error } = useBrevmottakere(vedtaksbrevId)

  if (!data || error) return null

  return (
    <Box>
      <CompactExpandableCard variant="subtle" tittel="Mottakere">
        <Table size="small">
          <Table.Body>
            {data.brevmottakere.map((mottaker) => {
              return (
                <Table.ExpandableRow
                  key={`${mottaker.brevId}-${mottaker.mottakertype}`}
                  content={
                    <VStack gap="space-4" paddingBlock="space-0" paddingInline="space-0">
                      <HStack gap="space-4">
                        <UtvidetRad fnr={mottaker.fnr} />
                      </HStack>
                    </VStack>
                  }
                >
                  <Table.DataCell scope="row">
                    <Tekst>{mottaker.mottakertype}</Tekst>
                  </Table.DataCell>
                  <Table.DataCell align="right">
                    {mottaker.mottakertype == 'BRUKER' ? (
                      <Tooltip content={`${mottaker.mottakertype} er låst som mottaker av brevet`}>
                        <PadlockLockedIcon fontSize="1.5rem" />
                      </Tooltip>
                    ) : (
                      <Tooltip content={`Fjern ${mottaker.mottakertype} som mottaker av brevet`}>
                        <TrashIcon fontSize="1.5rem" />
                      </Tooltip>
                    )}
                  </Table.DataCell>
                </Table.ExpandableRow>
              )
            })}
            <Table.Row shadeOnHover={false}>
              <Table.DataCell colSpan={3} align="right">
                <Button size="small">Legg til mottakere</Button>
              </Table.DataCell>
            </Table.Row>
          </Table.Body>
        </Table>
      </CompactExpandableCard>
    </Box>
  )
}

function UtvidetRad({ fnr }: { fnr: string }) {
  const { personInfo } = usePerson(fnr)

  return (
    <VStack gap="space-4" paddingBlock="space-0" paddingInline="space-0">
      <HStack gap="space-4">
        <Tekst>
          {personInfo?.fødselsdato
            ? `${formaterNavn(personInfo)} (${beregnAlder(personInfo.fødselsdato)} år)`
            : formaterNavn(personInfo)}
        </Tekst>
      </HStack>
    </VStack>
  )
}
