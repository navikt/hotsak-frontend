import { FigureCombinationIcon, FigureInwardIcon, FigureOutwardIcon } from '@navikt/aksel-icons'
import { HStack, Label, Link, Skeleton, Tag } from '@navikt/ds-react'
import { Children, ReactNode, SVGProps } from 'react'
import { useNavigate } from 'react-router-dom'

import { Kopiknapp } from '../felleskomponenter/Kopiknapp.tsx'
import { Tekst } from '../felleskomponenter/typografi'
import { hotsakTotalMinWidth, søknadslinjeHøyde } from '../GlobalStyles'
import { usePersonContext } from '../personoversikt/PersonContext'
import { Adressebeskyttelse, AdressebeskyttelseAlert, Kjønn, Person } from '../types/types.internal'
import { amplitude_taxonomy, logAmplitudeEvent } from '../utils/amplitude'
import { beregnAlder, formaterDato } from '../utils/dato'
import { formaterFødselsnummer, formaterNavn, formaterTelefonnummer } from '../utils/formater'

export interface PersonlinjeProps {
  person?: Person
  skjulTelefonnummer?: boolean
  loading: boolean
}

export function Personlinje({ person, loading, skjulTelefonnummer = false }: PersonlinjeProps) {
  const { setFodselsnummer } = usePersonContext()
  const navigate = useNavigate()

  if (loading) return <LasterPersonlinje />
  if (!person) return <Container />

  const { kjønn, fødselsdato, fnr, brukernummer, telefon, dødsdato, adressebeskyttelseOgSkjerming } = person
  const [adressebeskyttelse] = (adressebeskyttelseOgSkjerming?.gradering || []).filter(
    (gradering) => gradering !== Adressebeskyttelse.UGRADERT
  )

  return (
    <Container>
      <Element>
        <Kjønnsikon kjønn={kjønn} />
        <Label
          as={Link}
          size="small"
          href="#"
          onClick={(event) => {
            event.preventDefault()
            logAmplitudeEvent(amplitude_taxonomy.PERSONOVERSIKT)
            setFodselsnummer(fnr)
            navigate('/personoversikt/saker')
          }}
          aria-live="polite"
        >
          {`${formaterNavn(person)} (${fødselsdato && beregnAlder(fødselsdato)} år)`}
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
        <Kjønnsikon />
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

function Kjønnsikon({ kjønn }: { kjønn?: Kjønn }) {
  const iconProps: SVGProps<SVGSVGElement> = {
    fontSize: 'var(--a-font-size-heading-large)',
  }
  switch (kjønn) {
    case Kjønn.KVINNE:
      return <FigureOutwardIcon {...iconProps} />
    case Kjønn.MANN:
      return <FigureInwardIcon {...iconProps} />
    default:
      return <FigureCombinationIcon {...iconProps} />
  }
}

function Container({ children }: { children?: ReactNode }) {
  return (
    <HStack
      align="center"
      flexShrink="0"
      height={søknadslinjeHøyde}
      gap="4"
      minWidth={hotsakTotalMinWidth}
      paddingInline="8"
      style={{
        background: 'var(--a-bg-subtle)',
        borderBottom: '1px solid var(--a-border-default)',
        color: 'var(--a-text-default)',
      }}
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
