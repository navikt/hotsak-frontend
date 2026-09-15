import { PadlockLockedIcon, PadlockUnlockedIcon } from '@navikt/aksel-icons'
import { Box, Button, Dialog, HStack, InlineMessage, Switch, Table, Tooltip, VStack } from '@navikt/ds-react'
import { useState } from 'react'

import {
  type Brev,
  type Brevdata,
  BrevmalTekst,
  type BrevmottakerResponse,
  Mottakertype,
} from '../../../brev/brevTyper.ts'
import { useBrev, useBrevmottakere, useBrevmottakerActions } from '../../../brev/useBrev.ts'
import { CompactExpandableCard } from '../../../felleskomponenter/panel/CompactExpandableCard'
import { Tekst } from '../../../felleskomponenter/typografi'
import { usePerson } from '../../../personoversikt/usePerson.ts'
import { useSak } from '../../../saksbilde/useSak.ts'
import { beregnAlder } from '../../../utils/dato.ts'
import { formaterNavn, storForbokstavIOrd } from '../../../utils/formater.ts'

export function MottakereCard({ vedtaksbrevId }: { vedtaksbrevId?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const { data, error } = useBrevmottakere(vedtaksbrevId)
  const { brev } = useBrev(vedtaksbrevId)

  if (!data || error || !brev) return null

  return (
    <Box>
      <CompactExpandableCard variant="subtle" tittel="Mottakere">
        <Table size="small">
          <Table.Body>
            {data.brevmottakere.map((mottaker) => {
              const mottakertype = storForbokstavIOrd(mottaker.mottakertype)
              return (
                <Table.ExpandableRow
                  key={mottaker.id}
                  content={
                    <VStack gap="space-4" paddingBlock="space-0" paddingInline="space-0">
                      <HStack gap="space-4">
                        <UtvidetRad fnr={mottaker.fnr} />
                      </HStack>
                    </VStack>
                  }
                >
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
                </Table.ExpandableRow>
              )
            })}
            <Table.Row shadeOnHover={false}>
              <Table.DataCell colSpan={3} align="right">
                <Button size="small" onClick={() => setIsOpen(true)}>
                  Endre mottakere
                </Button>
              </Table.DataCell>
            </Table.Row>
          </Table.Body>
        </Table>
      </CompactExpandableCard>
      <EndreMottakereDialog brevId={vedtaksbrevId} brev={brev} mottakere={data} isOpen={isOpen} setIsOpen={setIsOpen} />
    </Box>
  )
}

function EndreMottakereDialog({
  brevId,
  brev,
  mottakere,
  isOpen,
  setIsOpen,
}: {
  brevId?: string
  brev: Brev<Brevdata>
  mottakere: BrevmottakerResponse
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}) {
  const { sak } = useSak()
  const { leggTilBrevmottaker, slettBrevmottaker } = useBrevmottakerActions(brevId)
  const isMutating = leggTilBrevmottaker.isMutating || slettBrevmottaker.isMutating

  const låsteMottakere = mottakere.brevmottakere.filter((mottaker) => !mottaker.kanSlettes)
  const formidler = mottakere.brevmottakere.find((mottaker) => mottaker.mottakertype === Mottakertype.FORMIDLER)
  const formidlerFnr = sak?.data.innsender.fnr

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Popup width="large">
        <Dialog.Header>
          <Dialog.Title>Endre mottakere av {BrevmalTekst[brev.brevmal].toLowerCase()}</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <VStack gap="space-16">
            <InlineMessage status="info">
              Låste mottakere kan ikke endres. Foreløpig kan du kun legge til eller fjerne formidler som mottaker.
            </InlineMessage>
            <VStack gap="space-8">
              {låsteMottakere.map((mottaker) => (
                <Switch key={mottaker.id} checked readOnly>
                  {storForbokstavIOrd(mottaker.mottakertype)}
                </Switch>
              ))}
              <Switch
                checked={!!formidler}
                disabled={isMutating || (!formidler && !formidlerFnr)}
                onChange={async () => {
                  if (formidler) {
                    await slettBrevmottaker.trigger(formidler.id)
                  } else if (formidlerFnr) {
                    await leggTilBrevmottaker.trigger({ fnr: formidlerFnr, mottakertype: Mottakertype.FORMIDLER })
                  }
                }}
              >
                {storForbokstavIOrd(Mottakertype.FORMIDLER)}
              </Switch>
            </VStack>
          </VStack>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.CloseTrigger>
            <Button variant="secondary">Lukk</Button>
          </Dialog.CloseTrigger>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
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
