import React, { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import styled from 'styled-components'

import { BodyLong, Label } from '@navikt/ds-react'

import { Strek } from '../../felleskomponenter/Strek'
import useOnScreen, { EndringsloggInnslag, MerkSomLestCallback } from './endringsloggHooks'
import { format } from 'date-fns'

export const Endringslogg: React.FC<{
  endringslogginnslag: ReadonlyArray<EndringsloggInnslag>
  merkSomLest: MerkSomLestCallback
}> = ({ endringslogginnslag, merkSomLest }) => {
  return (
    <>
      <Overskrift as="h2">Nytt i HOTSAK</Overskrift>
      <Liste>
        {endringslogginnslag.map((innslag) => (
          <Innslag key={innslag.id} innslag={innslag} merkSomLest={merkSomLest} />
        ))}
      </Liste>
    </>
  )
}

const Innslag: React.FC<{ innslag: EndringsloggInnslag; merkSomLest: MerkSomLestCallback }> = ({
  innslag,
  merkSomLest,
}) => {
  const dato = format(innslag.dato, 'PPP')
  const ulest = !innslag.lest
  const timeoutRef = useRef<number | null>(null)
  const innslagRef = useRef<HTMLElement>(null)
  const isOnScreen = useOnScreen(innslagRef)
  const [isFading, setIsFading] = useState(!ulest)
  useEffect(() => {
    if (isOnScreen && ulest) {
      timeoutRef.current = window.setTimeout(() => {
        merkSomLest(innslag.id)
          .then(() => {
            setIsFading(true)
          })
          .catch((err) => {
            console.warn(err)
          })
      }, 5_000)
    }
  }, [isOnScreen, ulest, merkSomLest, innslag])
  useEffect(() => {
    if (!isOnScreen && timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [isOnScreen])
  return (
    <>
      <dt ref={innslagRef}>
        <Ulest $fading={isFading}>{dato}</Ulest>
        <Label as="h3" spacing>
          {innslag.tittel}
        </Label>
      </dt>
      <dd>
        <ReactMarkdown>{innslag.innhold}</ReactMarkdown>
        <div />
      </dd>
      <Strek />
    </>
  )
}

const Overskrift = styled(BodyLong)`
  margin: 0 !important;
  color: var(--a-text-on-inverted);
  background-color: var(--a-surface-inverted);
  padding: var(--a-spacing-3) var(--a-spacing-4);
  text-align: center;
`

const Liste = styled.dl`
  margin: var(--a-spacing-3) var(--a-spacing-6) !important;

  dd ul {
    margin: var(--a-spacing-3) 0 !important;
    padding: 0 var(--a-spacing-5) !important;
    list-style: initial;
  }
`

const Ulest = styled.span<{ $fading: boolean }>`
  position: relative;

  &:before {
    position: absolute;
    transform: translateY(-50%);
    top: 50%;
    left: -16px;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background-color: var(--a-icon-warning);
    content: '';
    visibility: ${(props) => (props.$fading ? 'hidden' : undefined)};
    opacity: ${(props) => (props.$fading ? 0 : undefined)};
    transition: ${(props) => (props.$fading ? 'visibility 0s 2s, opacity 2s linear' : undefined)};
  }
`
