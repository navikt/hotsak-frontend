import { Buildings3Icon, PadlockLockedIcon, PadlockUnlockedIcon } from '@navikt/aksel-icons'
import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Heading,
  HelpText,
  HStack,
  Table,
  Tooltip,
  VStack,
} from '@navikt/ds-react'

import { useState } from 'react'
import { type BrevmottakerResponse, Mottakertype } from '../../../brev/brevTyper.ts'
import { useBrev, useBrevmottakerActions, useBrevmottakere } from '../../../brev/useBrev.ts'
import { CompactExpandableCard } from '../../../felleskomponenter/panel/CompactExpandableCard'
import { Tekst } from '../../../felleskomponenter/typografi'
import { type HttpError } from '../../../io/HttpError.ts'
import { usePerson } from '../../../personoversikt/usePerson.ts'
import { useBehovsmelding } from '../../../saksbilde/useBehovsmelding.ts'
import { useSak } from '../../../saksbilde/useSak.ts'
import { type Veiadresse } from '../../../types/hotlibs.ts'
import { formaterAdresse, formaterNavn, storeBokstaverIOrd, storForbokstavIOrd } from '../../../utils/formater.ts'

import { BrevadresseSkjema } from './BrevadresseSkjema.tsx'

export function MottakereCard({ vedtaksbrevId }: { vedtaksbrevId?: string }) {
  const { data, error } = useBrevmottakere(vedtaksbrevId)
  const { brev } = useBrev(vedtaksbrevId)
  const { sak } = useSak()

  const { personInfo } = usePerson(sak?.data.bruker.fnr)
  const vergemål = personInfo?.vergemål || []
  const harVerge = vergemål.length > 0

  if (!data || error || !brev) return null

  return (
    <Box>
      {harVerge && (
        <>
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
        </>
      )}
      <DelKopiMedFormidler brevId={vedtaksbrevId} mottakere={data} />
    </Box>
  )
}

function DelKopiMedFormidler({ brevId, mottakere }: { brevId?: string; mottakere: BrevmottakerResponse }) {
  const { sak } = useSak()
  const { behovsmelding } = useBehovsmelding()
  const { leggTilBrevmottaker, slettBrevmottaker } = useBrevmottakerActions(brevId)
  const isMutating = leggTilBrevmottaker.isMutating || slettBrevmottaker.isMutating
  const [visSkjema, setVisSkjema] = useState(false)

  const formidlerSomMottaker = mottakere.brevmottakere.find(
    (mottaker) => mottaker.mottakertype === Mottakertype.FORMIDLER
  )
  const innsender = sak?.data.innsender
  const formidlerNavn = innsender ? formaterNavn(innsender.navn) : undefined
  const initiellAdresse = behovsmelding?.levering?.hjelpemiddelformidler?.adresse
  const arbeidssted = behovsmelding?.levering?.hjelpemiddelformidler?.arbeidssted

  const handleFormidlerKopi = async (skalMottaKopi: boolean) => {
    if (skalMottaKopi && !formidlerSomMottaker) {
      leggTilBrevmottaker.reset()
      setVisSkjema(true)
    } else if (!skalMottaKopi) {
      setVisSkjema(false)
      if (formidlerSomMottaker) await slettBrevmottaker.trigger(formidlerSomMottaker.id)
    }
  }

  const handleLagre = async (adresse: Veiadresse) => {
    // POST med samme mottakertype oppdaterer adressen. Bytt til PUT etter hvert
    // Orgnr mangler i behovsmelding foreløpig. Inntil det finnes går kopien som sentral utskrift til adressen.
    await leggTilBrevmottaker.trigger({
      mottakertype: Mottakertype.FORMIDLER,
      navn: formidlerNavn,
      adresse,
    })
    setVisSkjema(false)
  }

  const feilmelding = leggTilBrevmottaker.error ? feilmeldingFra(leggTilBrevmottaker.error) : undefined

  return (
    <Box marginBlock="space-12 space-8">
      <CheckboxGroup legend="Del kopi med formidler" hideLegend size="small">
        <Checkbox
          checked={!!formidlerSomMottaker || visSkjema}
          disabled={isMutating}
          description="Formidleren får kopien digitalt og som brev."
          onChange={(e) => handleFormidlerKopi(e.target.checked)}
        >
          <HStack gap="space-2">
            <Tekst weight="semibold">Del kopi med formidler</Tekst>
            <HelpText title="Vurder å dele kopi med formidler">
              Hvis du deler en kopi av brevet med formidler, vil det bli synlig på formidler sine sider i 4 uker fra
              vedtaksdatoen. Du må selv vurdere om formidler skal motta en kopi av brevet.
            </HelpText>
          </HStack>
        </Checkbox>
      </CheckboxGroup>
      {(formidlerSomMottaker || visSkjema) && (
        <Box borderWidth="1" padding="space-8" borderRadius="8" borderColor="neutral-subtleA">
          <VStack gap="space-4">
            <HStack gap="space-2">
              <Buildings3Icon aria-hidden fontSize="1.1rem" />
              <Tekst>
                {storeBokstaverIOrd(arbeidssted)} v/ {formidlerNavn}
              </Tekst>
            </HStack>
            {formidlerSomMottaker && !visSkjema ? (
              <>
                <Tekst>{formidlerSomMottaker.adresse && formaterAdresse(formidlerSomMottaker.adresse)}</Tekst>
                <div>
                  <Button
                    type="button"
                    size="small"
                    variant="secondary"
                    disabled={isMutating}
                    onClick={() => {
                      leggTilBrevmottaker.reset()
                      setVisSkjema(true)
                    }}
                  >
                    Endre
                  </Button>
                </div>
              </>
            ) : (
              <BrevadresseSkjema
                initiellAdresse={formidlerSomMottaker?.adresse ?? initiellAdresse}
                formidlerNavn={formidlerNavn}
                isLoading={leggTilBrevmottaker.isMutating}
                feilmelding={feilmelding}
                onLagre={handleLagre}
                onAvbryt={() => setVisSkjema(false)}
              />
            )}
          </VStack>
        </Box>
      )}
    </Box>
  )
}

function feilmeldingFra(error: HttpError): string {
  return typeof error.cause === 'string' && error.cause ? error.cause : 'Kunne ikke lagre mottakeren. Prøv igjen.'
}
