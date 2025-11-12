import { HStack, Label, Link, Skeleton, Tag } from '@navikt/ds-react'
import { Children, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

import { Kopiknapp } from '../../../../../felleskomponenter/Kopiknapp'
import { Tekst } from '../../../../../felleskomponenter/typografi'
import { søknadslinjeHøyde } from '../../../../../GlobalStyles'
import { usePersonContext } from '../../../../../personoversikt/PersonContext'
import { Adressebeskyttelse, AdressebeskyttelseAlert, Person } from '../../../../../types/types.internal'
import { beregnAlder, formaterDato } from '../../../../../utils/dato'
import { formaterFødselsnummer, formaterNavn, formaterTelefonnummer } from '../../../../../utils/formater'
import styles from './personlinje.module.css'

export interface PersonlinjeEksperimentProps {
  person?: Person
  skjulTelefonnummer?: boolean
  loading: boolean
}

export function PersonlinjeEksperiment({ person, loading, skjulTelefonnummer = false }: PersonlinjeEksperimentProps) {
  const { setFodselsnummer } = usePersonContext()
  const navigate = useNavigate()

  if (loading) return <LasterPersonlinje />
  if (!person) return <Container />

  const { fødselsdato, fnr, brukernummer, telefon, dødsdato, adressebeskyttelseOgSkjerming } = person
  const [adressebeskyttelse] = (adressebeskyttelseOgSkjerming?.gradering || []).filter(
    (gradering) => gradering !== Adressebeskyttelse.UGRADERT
  )

  return (
    <Container>
      <Label
        as={Link}
        size="small"
        href="#"
        onClick={(event) => {
          event.preventDefault()
          setFodselsnummer(fnr)
          navigate('/personoversikt/saker')
        }}
        aria-live="polite"
      >
        {fødselsdato ? `${formaterNavn(person)} (${beregnAlder(fødselsdato)} år)` : formaterNavn(person)}
      </Label>
      {fnr ? (
        <>
          <Tekst>{`Fnr: ${formaterFødselsnummer(fnr)}`}</Tekst>
          <Kopiknapp tooltip="Kopier brukernummer" copyText={fnr} placement="bottom" />
        </>
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
        <Tag size="small" variant="warning">
          Død {formaterDato(dødsdato)}
        </Tag>
      )}
      {adressebeskyttelse && (
        <Tag size="small" variant="error">
          {AdressebeskyttelseAlert[adressebeskyttelse]}
        </Tag>
      )}
      {adressebeskyttelseOgSkjerming?.skjermet && (
        <Tag size="small" variant="error">
          Skjermet
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
    <HStack align="center" gap="1">
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
      gap="space-6"
      paddingInline="space-8"
      className={styles.container}
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
