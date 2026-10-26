import { Buildings3Icon } from '@navikt/aksel-icons'
import { Box, Button, Checkbox, CheckboxGroup, HStack, HelpText, VStack } from '@navikt/ds-react'
import { useState } from 'react'
import { Tekst } from '../felleskomponenter/typografi'
import { HttpError } from '../io/HttpError'
import { useBehovsmelding } from '../saksbilde/useBehovsmelding'
import { useSak } from '../saksbilde/useSak'
import { Veiadresse } from '../types/hotlibs'
import { formaterAdresse, formaterNavn, storeBokstaverIOrd } from '../utils/formater'
import { BrevadresseSkjema } from './BrevadresseSkjema'
import { BrevmottakerResponse, Mottakertype } from './brevTyper'
import { useBrevmottakerActions } from './useBrev'

interface DelKopiMedFormidlerProps {
  brevId?: string
  mottakere: BrevmottakerResponse
  kanRedigere: boolean
}

export function DelKopiMedFormidler({ brevId, mottakere, kanRedigere }: DelKopiMedFormidlerProps) {
  const { sak } = useSak()
  const { behovsmelding } = useBehovsmelding()
  const { leggTilBrevmottaker, endreBrevmottaker, slettBrevmottaker } = useBrevmottakerActions(brevId)
  const isMutating = leggTilBrevmottaker.isMutating || endreBrevmottaker.isMutating || slettBrevmottaker.isMutating
  const [visSkjema, setVisSkjema] = useState(false)

  const formidlerSomMottaker = mottakere.brevmottakere.find(
    (mottaker) => mottaker.mottakertype === Mottakertype.FORMIDLER
  )
  const innsender = sak?.data.innsender
  const digitalBehovsmelding = behovsmelding?.isDigitalBehovsmelding ?? false
  const formidlerNavn = digitalBehovsmelding && innsender ? formaterNavn(innsender.navn) : undefined
  const initiellAdresse = behovsmelding?.levering?.hjelpemiddelformidler?.adresse
  const arbeidssted = behovsmelding?.levering?.hjelpemiddelformidler?.arbeidssted

  const handleFormidlerKopi = async (skalMottaKopi: boolean) => {
    if (skalMottaKopi && !formidlerSomMottaker) {
      leggTilBrevmottaker.reset()
      endreBrevmottaker.reset()
      setVisSkjema(true)
    } else if (!skalMottaKopi) {
      setVisSkjema(false)
      if (formidlerSomMottaker) await slettBrevmottaker.trigger(formidlerSomMottaker.id)
    }
  }

  const handleLagre = async (adresse: Veiadresse, formidlerNavn: string) => {
    if (formidlerSomMottaker) {
      await endreBrevmottaker.trigger({ brevmottakerId: formidlerSomMottaker.id, navn: formidlerNavn, adresse })
    } else {
      // Orgnr mangler i behovsmelding foreløpig. Inntil det finnes går kopien som sentral utskrift til adressen.
      await leggTilBrevmottaker.trigger({
        mottakertype: Mottakertype.FORMIDLER,
        navn: formidlerNavn,
        adresse,
      })
    }
    setVisSkjema(false)
  }

  const lagreFeil = leggTilBrevmottaker.error ?? endreBrevmottaker.error
  const feilmelding = lagreFeil ? feilmeldingFra(lagreFeil) : undefined

  return (
    <Box marginBlock="space-12 space-8">
      <CheckboxGroup legend="Del kopi med formidler" hideLegend size="small">
        <Checkbox
          checked={!!formidlerSomMottaker || visSkjema}
          disabled={isMutating || !kanRedigere}
          description={`Formidleren får kopien ${digitalBehovsmelding ? 'digitalt og som brev' : 'som brev'}.`}
          onChange={(e) => handleFormidlerKopi(e.target.checked)}
        >
          <HStack gap="space-2">
            <Tekst weight="semibold">Del kopi med formidler</Tekst>
            <HelpText title="Vurder å dele kopi med formidler">
              {digitalBehovsmelding ? (
                <p>
                  Hvis du deler en kopi av brevet med formidler, vil en kopi av brevet distribueres til formidleren. Du
                  må selv vurdere om formidler skal motta en kopi av brevet.
                </p>
              ) : (
                <p>
                  Hvis du deler en kopi av brevet med formidler, vil det bli synlig på formidler sine sider i 4 uker fra
                  vedtaksdatoen i tillegg til å distribueres som brev. Du må selv vurdere om formidler skal motta en
                  kopi av brevet.
                </p>
              )}
            </HelpText>
          </HStack>
        </Checkbox>
      </CheckboxGroup>
      {(formidlerSomMottaker || visSkjema) && (
        <Box borderWidth="1" padding="space-8" borderRadius="8" borderColor="neutral-subtleA">
          <VStack gap="space-4">
            <HStack gap="space-2">
              <Buildings3Icon aria-hidden fontSize="1.1rem" />
              {digitalBehovsmelding && (
                <Tekst>
                  {storeBokstaverIOrd(arbeidssted)} v/ {formidlerNavn}
                </Tekst>
              )}
            </HStack>
            {formidlerSomMottaker && !visSkjema ? (
              <>
                <Tekst>{formidlerSomMottaker.adresse && formaterAdresse(formidlerSomMottaker.adresse)}</Tekst>
                {kanRedigere && (
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
                )}
              </>
            ) : (
              <BrevadresseSkjema
                initiellAdresse={formidlerSomMottaker?.adresse ?? initiellAdresse}
                formidlerNavn={formidlerNavn}
                isLoading={leggTilBrevmottaker.isMutating || endreBrevmottaker.isMutating}
                feilmelding={feilmelding}
                onLagre={handleLagre}
                onAvbryt={() => setVisSkjema(false)}
                digitalBehovsmelding={digitalBehovsmelding}
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
