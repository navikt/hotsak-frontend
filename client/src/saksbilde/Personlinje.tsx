import { Button, HStack, Label, Link, Skeleton, Tag } from '@navikt/ds-react'
import { Children, ReactNode, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { Kopiknapp } from '../felleskomponenter/Kopiknapp.tsx'
import { Tekst } from '../felleskomponenter/typografi'
import { søknadslinjeHøyde } from '../GlobalStyles'
import { usePersonContext } from '../personoversikt/PersonContext'
import { Adressebeskyttelse, AdressebeskyttelseAlert, Person } from '../types/types.internal'
import { beregnAlder, formaterDato } from '../utils/dato'
import { formaterFødselsnummer, formaterNavn, formaterTelefonnummer } from '../utils/formater'
import classes from './personlinje.module.css'
import { VergeInformasjonsModal } from './VergeInformasjonsModal.tsx'
import { Eksperiment } from '../felleskomponenter/Eksperiment.tsx'

export interface PersonlinjeProps {
  person?: Person
  skjulTelefonnummer?: boolean
  loading: boolean
}

export function Personlinje({ person, loading, skjulTelefonnummer = false }: PersonlinjeProps) {
  const { setFodselsnummer } = usePersonContext()
  const navigate = useNavigate()
  const vergemålModalRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (person?.fnr) {
      setFodselsnummer(person?.fnr)
    }
    return () => setFodselsnummer('')
  }, [person?.fnr])

  if (loading) return <LasterPersonlinje />
  if (!person) return <Container />

  const { fødselsdato, fnr, brukernummer, telefon, dødsdato, adressebeskyttelseOgSkjerming, vergemål = [] } = person
  const [adressebeskyttelse] = (adressebeskyttelseOgSkjerming?.gradering || []).filter(
    (gradering) => gradering !== Adressebeskyttelse.UGRADERT
  )

  return (
    <Container>
      <Element>
        <Label
          as={Link}
          size="small"
          href="#"
          onClick={(event: React.MouseEvent) => {
            event.preventDefault()
            setFodselsnummer(fnr)
            navigate('/personoversikt/saker')
          }}
          aria-live="polite"
        >
          {fødselsdato ? `${formaterNavn(person)} (${beregnAlder(fødselsdato)} år)` : formaterNavn(person)}
        </Label>
      </Element>
      {fnr ? (
        <Element>
          <Tekst>{`Fnr: ${formaterFødselsnummer(fnr)}`}</Tekst>
          <Kopiknapp tooltip="Kopier fødselsnumer" copyText={fnr} placement="bottom" />
        </Element>
      ) : (
        <Tekst>Fødselsnummer ikke tilgjengelig</Tekst>
      )}
      {brukernummer && (
        <Element>
          <Tekst>{`Brukernr: ${brukernummer}`}</Tekst>
          <Kopiknapp tooltip="Kopier brukernummer" copyText={brukernummer} placement="bottom" />
        </Element>
      )}
      {!skjulTelefonnummer && telefon && (
        <Element>
          <Tekst>{`Tlf: ${formaterTelefonnummer(telefon)}`}</Tekst>
          <Kopiknapp tooltip="Kopier telefonnummer" copyText={telefon} placement="bottom" />
        </Element>
      )}
      {dødsdato && (
        <Tag data-color="warning" size="small" variant="outline">
          Død {formaterDato(dødsdato)}
        </Tag>
      )}
      {adressebeskyttelse && (
        <Tag data-color="danger" size="small" variant="outline">
          {AdressebeskyttelseAlert[adressebeskyttelse]}
        </Tag>
      )}
      {adressebeskyttelseOgSkjerming?.skjermet && (
        <Tag data-color="danger" size="small" variant="outline">
          Skjermet
        </Tag>
      )}
      <Eksperiment>
        <>
          {vergemål.length > 0 && (
            <Button variant="secondary" size="small" onClick={() => vergemålModalRef.current?.showModal()}>
              Vergemål
            </Button>
          )}
          <VergeInformasjonsModal modalRef={vergemålModalRef} vergemål={vergemål} />
        </>
      </Eksperiment>
    </Container>
  )
}

export function LasterPersonlinje() {
  return (
    <Container>
      <Element>
        <Skeleton width={175} height={32} />
      </Element>
      {Array.from({ length: 3 }, (_, key) => (
        <Skeleton key={key} width={135} height={32} />
      ))}
    </Container>
  )
}

function Element({ children }: { children: ReactNode }) {
  return (
    <HStack align="center" gap="space-4">
      {children}
    </HStack>
  )
}

function Container({ children }: { children?: ReactNode }) {
  return (
    <HStack
      align="center"
      flexShrink="0"
      //minWidth={hotsakTotalMinWidth}
      height={søknadslinjeHøyde}
      gap="space-16"
      paddingInline="space-12"
      className={classes.container}
    >
      {Children.map(children, (child, index) => (
        <>
          {child && index > 0 && <div>|</div>}
          {child}
        </>
      ))}
    </HStack>
  )
}
