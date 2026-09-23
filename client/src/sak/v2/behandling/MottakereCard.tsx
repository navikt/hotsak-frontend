import { PadlockLockedIcon, PadlockUnlockedIcon } from '@navikt/aksel-icons'
import { Box, Checkbox, CheckboxGroup, Heading, HelpText, HStack, Table, Tooltip } from '@navikt/ds-react'

import { type BrevmottakerResponse, Mottakertype } from '../../../brev/brevTyper.ts'
import { useBrev, useBrevmottakerActions, useBrevmottakere } from '../../../brev/useBrev.ts'
import { CompactExpandableCard } from '../../../felleskomponenter/panel/CompactExpandableCard'
import { Tekst } from '../../../felleskomponenter/typografi'
import { usePerson } from '../../../personoversikt/usePerson.ts'
import { useSak } from '../../../saksbilde/useSak.ts'
import { formaterNavn, storForbokstavIOrd } from '../../../utils/formater.ts'

export function MottakereCard({ vedtaksbrevId }: { vedtaksbrevId?: string }) {
  const { data, error } = useBrevmottakere(vedtaksbrevId)
  const { brev } = useBrev(vedtaksbrevId)

  if (!data || error || !brev) return null

  return (
    <Box>
      <Box marginBlock="space-0 space-8">
        <Heading level="2" size="xsmall">
          Hvem mottar dette brevet?
        </Heading>
      </Box>
      <CompactExpandableCard variant="subtle" tittel="Mottakere" defaultOpen={false}>
        <Table size="small">
          <Table.Body>
            {data.brevmottakere.map((mottaker) => {
              if (mottaker.mottakertype == Mottakertype.FORMIDLER) return null //special case
              const mottakertype = storForbokstavIOrd(mottaker.mottakertype)
              return (
                <Table.Row key={mottaker.id}>
                  <Table.DataCell scope="row">
                    <Tekst>{mottakertype}</Tekst>
                  </Table.DataCell>
                  <Table.DataCell align="right">
                    {mottaker.kanSlettes ? (
                      <Tooltip content={`${mottakertype} kan fjernes som mottaker av brevet`}>
                        <PadlockUnlockedIcon fontSize="1.5rem" />
                      </Tooltip>
                    ) : (
                      <Tooltip content={`${mottakertype} er låst som mottaker av brevet`}>
                        <PadlockLockedIcon fontSize="1.5rem" />
                      </Tooltip>
                    )}
                  </Table.DataCell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
      </CompactExpandableCard>
      <DelKopiMedFormidler brevId={vedtaksbrevId} mottakere={data} />
    </Box>
  )
}

function DelKopiMedFormidler({ brevId, mottakere }: { brevId?: string; mottakere: BrevmottakerResponse }) {
  const { sak } = useSak()
  const { leggTilBrevmottaker, slettBrevmottaker } = useBrevmottakerActions(brevId)
  const isMutating = leggTilBrevmottaker.isMutating || slettBrevmottaker.isMutating

  const formidler = mottakere.brevmottakere.find((mottaker) => mottaker.mottakertype === Mottakertype.FORMIDLER)
  const formidlerFnr = sak?.data.innsender.fnr

  const { personInfo } = usePerson(formidlerFnr)

  const endreFormidler = async (skalMottaKopi: boolean) => {
    if (skalMottaKopi && !formidler && formidlerFnr) {
      await leggTilBrevmottaker.trigger({ fnr: formidlerFnr, mottakertype: Mottakertype.FORMIDLER })
    } else if (!skalMottaKopi && formidler) {
      await slettBrevmottaker.trigger(formidler.id)
    }
  }

  const handleFormidlerKopi = async (values: string[]) => {
    await endreFormidler(values.includes('formidler'))
  }

  return (
    <Box marginBlock="space-12 space-8">
      <HStack gap="space-2">
        <Heading size="xsmall" level="2" spacing={false}>
          Del kopi med formidler
        </Heading>
        <HelpText title="Vurder å dele kopi med formidler">
          Hvis du deler en kopi av brevet med formidler, vil det bli synlig på formidler sine sider i 4 uker fra
          vedtaksdatoen. Du må selv vurdere om formidler skal motta en kopi av brevet.
        </HelpText>
      </HStack>
      <CheckboxGroup
        legend="Del kopi med formidler"
        hideLegend
        value={formidler ? ['formidler'] : []}
        onChange={handleFormidlerKopi}
        disabled={isMutating || (!formidler && !formidlerFnr)}
        size="small"
      >
        <Checkbox value="formidler">Formidler - {formaterNavn(personInfo?.navn)}</Checkbox>
      </CheckboxGroup>
    </Box>
  )
}
