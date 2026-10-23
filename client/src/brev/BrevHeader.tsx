import { Buildings3Icon, ChevronDownIcon, PlusCircleIcon } from '@navikt/aksel-icons'
import { Box, Button, Checkbox, CheckboxGroup, Heading, HelpText, HStack, Tabs, Tag, VStack } from '@navikt/ds-react'
import { useState, type ReactNode } from 'react'
import { useMiljø } from '../utils/useMiljø.ts'

import { Tekst } from '../felleskomponenter/typografi.tsx'
import { type HttpError } from '../io/HttpError.ts'
import { BrevadresseSkjema } from './BrevadresseSkjema.tsx'
import { useBehovsmelding } from '../saksbilde/useBehovsmelding.ts'
import { useSak } from '../saksbilde/useSak.ts'
import { type Veiadresse } from '../types/hotlibs.ts'
import { formaterAdresse, formaterNavn, storeBokstaverIOrd } from '../utils/formater.ts'
import { isVedtaksbrev } from './brevSelectors.ts'
import { type Brev, BrevmalTekst, type BrevmottakerResponse, Mottakertype } from './brevTyper.ts'
import { useBrevmottakerActions, useBrevmottakere } from './useBrev.ts'

export interface BrevHeaderProps {
  brev: Brev[]
  valgtBrevId?: string
  kanOppretteBrev: boolean
  onVelgBrev(brevId: string): void
  onNyttBrev(): void
  kanRedigere?: boolean
  handlinger?: ReactNode
}

export function BrevHeader({
  brev,
  valgtBrevId,
  kanOppretteBrev,
  onVelgBrev,
  onNyttBrev,
  kanRedigere = false,
  handlinger,
}: BrevHeaderProps) {
  const { erIkkeProd } = useMiljø()
  const [innstillingerÅpen, setInnstillingerÅpen] = useState(false)
  const { data } = useBrevmottakere(valgtBrevId)
  const erVedtaksbrevValgt = brev.some((b) => b.brevId === valgtBrevId && isVedtaksbrev(b))
  const flereMottakere = (data?.brevmottakere?.length ?? 0) > 1

  return (
    <Box borderRadius="12" marginBlock="space-0 space-4">
      {erIkkeProd && (
        <Tabs value={valgtBrevId ?? ''} onChange={onVelgBrev} size="small">
          <Tabs.List>
            {brev.map((b) => (
              <Tabs.Tab key={b.brevId} value={b.brevId} label={BrevmalTekst[b.brevmal]} />
            ))}
            {erIkkeProd && (
              <Button
                variant="tertiary"
                size="small"
                disabled={!kanOppretteBrev}
                onClick={onNyttBrev}
                icon={<PlusCircleIcon fontSize="1.5rem" />}
              >
                Nytt utkast
              </Button>
            )}
          </Tabs.List>
        </Tabs>
      )}
      {valgtBrevId && (
        <Box padding="space-8">
          <HStack justify="space-between">
            <HStack gap="space-4">
              {erIkkeProd && (
                <>
                  <Button
                    variant="tertiary"
                    size="small"
                    aria-expanded={innstillingerÅpen}
                    onClick={() => setInnstillingerÅpen(!innstillingerÅpen)}
                    icon={<ChevronDownIcon fontSize="1.3rem" />}
                  >
                    Innstillinger
                  </Button>
                  {flereMottakere && (
                    <Tag variant="warning" size="small">
                      Flere mottakere
                    </Tag>
                  )}
                </>
              )}
            </HStack>
            <HStack gap="space-4">{handlinger}</HStack>
          </HStack>
        </Box>
      )}
      {innstillingerÅpen && (
        <BrevHeaderInnstillinger
          key={valgtBrevId}
          valgtBrevId={valgtBrevId}
          mottakere={erVedtaksbrevValgt ? data : undefined}
          kanRedigere={kanRedigere}
        />
      )}
    </Box>
  )
}

interface BrevHeaderInnstillingerProps {
  valgtBrevId?: string
  mottakere?: BrevmottakerResponse
  kanRedigere: boolean
}

export function BrevHeaderInnstillinger({ valgtBrevId, mottakere, kanRedigere }: BrevHeaderInnstillingerProps) {
  return (
    <Box padding="space-20">
      <VStack gap="space-8">
        <Heading level="2" size="xsmall">
          Innstillinger for brevet
        </Heading>
        {mottakere && <DelKopiMedFormidler brevId={valgtBrevId} mottakere={mottakere} kanRedigere={kanRedigere} />}
      </VStack>
    </Box>
  )
}

interface DelKopiMedFormidlerProps {
  brevId?: string
  mottakere: BrevmottakerResponse
  kanRedigere: boolean
}

function DelKopiMedFormidler({ brevId, mottakere, kanRedigere }: DelKopiMedFormidlerProps) {
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
          disabled={isMutating || !kanRedigere}
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
