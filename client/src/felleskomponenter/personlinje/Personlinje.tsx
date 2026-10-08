import { HStack, Label, Link, Skeleton, Tag } from '@navikt/ds-react'
import { Children, ReactNode, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'

import { Kopiknapp } from '../Kopiknapp.tsx'
import { Tekst } from '../typografi.tsx'
import { usePersonContext } from '../../personoversikt/PersonContext.tsx'
import { Adressebeskyttelse, AdressebeskyttelseAlert, Person } from '../../types/types.internal.ts'
import { beregnAlder, formaterDato } from '../../utils/dato.ts'
import { formaterFødselsnummer, formaterNavn, formaterTelefonnummer } from '../../utils/formater.ts'
import classes from './personlinje.module.css'

export interface PersonlinjeProps {
  person?: Person
  skjulTelefonnummer?: boolean
  loading: boolean
}

export function Personlinje({ person, loading, skjulTelefonnummer = false }: PersonlinjeProps) {
  const { setFodselsnummer } = usePersonContext()
  const navigate = useNavigate()
  const sattFodselsnummer = useRef<string>(undefined)

  useEffect(() => {
    if (person?.fnr) {
      setFodselsnummer(person.fnr)
      sattFodselsnummer.current = person.fnr
    }
  }, [person?.fnr, setFodselsnummer])

  useEffect(() => {
    return () => {
      // Tøm bare hvis ingen andre har byttet fødselsnummer siden, f.eks. et søk som navigerer bort herfra.
      const satt = sattFodselsnummer.current
      if (satt) {
        setFodselsnummer((gjeldende) => (gjeldende === satt ? '' : gjeldende))
      }
    }
  }, [setFodselsnummer])

  if (loading) return <LasterPersonlinje />
  if (!person) return <Container />

  const { fnr, fødselsdato, dødsdato, brukernummer, telefonnummer, vergemål = [], gradering, isSkjermet } = person

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
      {!skjulTelefonnummer && telefonnummer && (
        <Element>
          <Tekst>{`Tlf: ${formaterTelefonnummer(telefonnummer)}`}</Tekst>
          <Kopiknapp tooltip="Kopier telefonnummer" copyText={telefonnummer} placement="bottom" />
        </Element>
      )}
      {dødsdato && (
        <Tag data-color="warning" size="small" variant="outline">
          Død {formaterDato(dødsdato)}
        </Tag>
      )}
      {gradering && gradering !== Adressebeskyttelse.UGRADERT && (
        <Tag data-color="danger" size="small" variant="outline">
          {AdressebeskyttelseAlert[gradering]}
        </Tag>
      )}
      {isSkjermet && (
        <Tag data-color="danger" size="small" variant="outline">
          Skjermet
        </Tag>
      )}
      {vergemål && vergemål.length > 0 && (
        <Tag data-color="warning" size="small" variant="outline">
          Vergemål
        </Tag>
      )}
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
    <HStack align="center" flexShrink="0" gap="space-16" paddingInline="space-12" className={classes.container}>
      {Children.map(children, (child, index) => (
        <>
          {child && index > 0 && <div>|</div>}
          {child}
        </>
      ))}
    </HStack>
  )
}
